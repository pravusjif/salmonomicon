import { redView } from "./UI"
import { pages, pageCounter, resetGame } from "./book"


@Component('behavior')
export class Behavior {
  speed: number = 0.02
  originalSpeed: number = 0.02
}

let creatures = engine.getComponentGroup(Behavior)


let camera = Camera.instance
camera.rotation.toRotationMatrix


export class FollowPlayerSystem {
	playerPos: Vector3
	waitingForMonsterRay: boolean = false
	waitingForCameraRay: boolean = false
	creatureBeingWatched: boolean = false
	watchingPlayer: boolean = false

	update(dt: number) {
		this.playerPos = camera.position.clone()
		
		for (let creature of creatures.entities) {
			let creatureBehavior = creature.getComponent(Behavior)
			let creatureTransform = creature.getComponent(Transform)
			let gap = this.playerPos.subtract(creatureTransform.position)
			creatureTransform.lookAt(this.playerPos)

			let gapModule = gap.length()
			if (gapModule < 3 ){ 
				resetGame()
				return
			}

			let currentSpeed = this.creatureBeingWatched ? creatureBehavior.speed : creatureBehavior.originalSpeed
			let direction = gap.normalize().scale(currentSpeed)
			
			creatureTransform.position = creatureTransform.position.add(direction)

			if(!this.waitingForMonsterRay) {
				const rayToPlayer: Ray = PhysicsCast.instance.getRayFromPositions(creatureTransform.position, this.playerPos)

				PhysicsCast.instance.hitFirst(rayToPlayer, (e) => {
					this.waitingForMonsterRay = false
					if (e.didHit) {
						//   log("safe")
						  redView.visible = false
						  this.watchingPlayer = false
					} else {
						// log("WATCHING YOU")
						redView.visible = true
						this.watchingPlayer = true
					}
				})

				this.waitingForMonsterRay = true
			}

			let cameraForward = PhysicsCast.instance.getRayFromCamera(1).direction
			if(Math.abs(Vector3.GetAngleBetweenVectors(new Vector3(cameraForward.x, cameraForward.y, cameraForward.z), creatureTransform.position.subtract(this.playerPos), Vector3.Up())) < 0.4) {
				// log("MONSTER WATCHED")
				if(this.watchingPlayer){
					this.creatureBeingWatched = true
					creatureBehavior.speed += 0.0025
				} else {
					creatureBehavior.speed = creatureBehavior.originalSpeed
				}
				
			} else {
				// log("MONSTER NOT WATCHED")
				this.creatureBeingWatched = false
			}

			/* if(!this.waitingForCameraRay) {
				const rayFromCamera: Ray = PhysicsCast.instance.getRayFromCamera(gapModule)

				PhysicsCast.instance.hitFirst(rayFromCamera, (e) => {
					this.waitingForCameraRay = false
					this.creatureBeingWatched = false

					if(e.didHit)
						log(e)

					if (e.didHit && e.entity.entityId == creature.uuid) {
						this.creatureBeingWatched = true
						log("watching the monster directly")
						// creatureBehavior.speed += 0.003
					} else {
						// log("not watching the monster directly")
					}
				})

				this.waitingForCameraRay = true
			} */
		}

	}
}


export function spawnCreature(){

	let creature = new Entity()
	engine.addEntity(creature)
	creature.addComponent(new GLTFShape("models/Chobi.glb"))
	creature.addComponent(new Transform({
		position: new Vector3(20, 0, 20),
		scale: new Vector3(1.5, 1.5, 1.5)
	}))
	creature.addComponent(new Behavior())

	return creature
}