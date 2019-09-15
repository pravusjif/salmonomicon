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
					} else {
						// log("WATCHING YOU")
						redView.visible = true
					}
				})

				this.waitingForMonsterRay = true
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

