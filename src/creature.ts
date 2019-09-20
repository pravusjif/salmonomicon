import { redView } from "./UI"
import { pages, pageCounter, resetGame } from "./book"

export enum CreatureState {
	Dormant,
	Hunting,
	Trapped,
	Vanished
}

@Component('behavior')
export class CreatureComponent {
	speed: number = 0.3
	originalSpeed: number = 0.3
	spawningSpeed: number = 0.2
	initialPosition: Vector3 = new Vector3(32, -1.5, 20)
	targetYPosition: number = 4
	trappedPosition: Vector3 = new Vector3(24, 1, 24)
	rotationSpeed: number = 15
	currentState: CreatureState = CreatureState.Dormant
	laserL: IEntity = null
	laserR: IEntity = null
}

let creatures = engine.getComponentGroup(CreatureComponent)
let camera = Camera.instance
camera.rotation.toRotationMatrix


const rayMaterial = new Material()
rayMaterial.metallic = 1
rayMaterial.roughness = 0.5
rayMaterial.albedoColor = new Color3(30, 1, 1)


export class CreatureSystem {
	playerPos: Vector3
	waitingForMonsterRay: boolean = false
	waitingForCameraRay: boolean = false
	creatureBeingWatched: boolean = false
	watchingPlayer: boolean = false



	update(dt: number) {
		this.playerPos = camera.position.clone()

		for (let creature of creatures.entities) {
			let creatureComponent = creature.getComponent(CreatureComponent)
			let creatureTransform = creature.getComponent(Transform)

			switch (creatureComponent.currentState) {

				////// HUNTING  ///////
				case CreatureState.Hunting:
					if(creatureTransform.position.y < creatureComponent.targetYPosition) {
						creatureTransform.position.y += creatureComponent.spawningSpeed * dt

						if(creatureTransform.position.y > creatureComponent.targetYPosition)
							creatureTransform.position.y = creatureComponent.targetYPosition
						else continue
					}

					let gap = this.playerPos.subtract(creatureTransform.position)
					creatureTransform.lookAt(this.playerPos)

					let gapModule = gap.length()
					if (gapModule < 3) {
						resetGame()
						return
					}

					let currentSpeed = this.creatureBeingWatched ? creatureComponent.speed : creatureComponent.originalSpeed
					let direction = gap.normalize().scale(currentSpeed * dt)

					creatureTransform.position = creatureTransform.position.add(direction)
					if (creatureTransform.position.y < 4) {
						creatureTransform.position.y = 4
					}

					if (!this.waitingForMonsterRay) {
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
					if (Math.abs(Vector3.GetAngleBetweenVectors(new Vector3(cameraForward.x, cameraForward.y, cameraForward.z), creatureTransform.position.subtract(this.playerPos), Vector3.Up())) < 0.4) {
						// log("MONSTER WATCHED")
						if (this.watchingPlayer) {
							this.creatureBeingWatched = true
							creatureComponent.speed *= 1.1
						} else {
							creatureComponent.speed = creatureComponent.originalSpeed
						}

					} else {
						// log("MONSTER NOT WATCHED")
						this.creatureBeingWatched = false
					}
					break;

				//////  TRAPPED //////
				case CreatureState.Trapped:
						
						if (creatureTransform.position.y != creatureComponent.trappedPosition.y) {

							creatureTransform.position = creatureComponent.trappedPosition
							//creatureTransform.rotation = Quaternion.Identity
							log("settingPos")

							let laserL = new Entity()
							laserL.addComponent(new BoxShape())
							laserL.getComponent(BoxShape).withCollisions = false
							laserL.addComponent(new Transform({
								scale: new Vector3(0.05 ,0.05, 10 ),
								position: new Vector3(-0.065, 0.55, 5)
							}))
							laserL.addComponent(rayMaterial)
							laserL.setParent(creature)
							creatureComponent.laserL = laserL
						
							engine.addEntity(laserL)
						
						
							let laserR = new Entity()
							laserR.addComponent(new BoxShape())
							laserR.getComponent(BoxShape).withCollisions = false
							laserR.addComponent(new Transform({
								scale: new Vector3(0.05 ,0.05, 10 ),
								position: new Vector3(0.065, 0.55, 5)
							}))
							laserR.addComponent(rayMaterial)
							laserR.setParent(creature)
							creatureComponent.laserR = laserR
							engine.addEntity(laserR)
						}

						creatureTransform.rotate(Vector3.Up(), dt * creatureComponent.rotationSpeed)

						let newRay: Ray = {
							origin: creatureTransform.position,
							direction: Vector3.Forward().rotate(creatureTransform.rotation),
							distance: 10
						}
			
						PhysicsCast.instance.hitFirst(newRay, (e) => {
							if (e.didHit){
			
								//debugCube.getComponent(Transform).position.set(e.hitPoint.x, e.hitPoint.y, e.hitPoint.z)
								let hitPoint = new Vector3(e.hitPoint.x, e.hitPoint.y, e.hitPoint.z)
								let laserLen = Vector3.Distance(creatureTransform.position, hitPoint)
								creatureComponent.laserL.getComponent(Transform).scale.z = laserLen
								creatureComponent.laserR.getComponent(Transform).scale.z = laserLen
								creatureComponent.laserL.getComponent(Transform).position.z = laserLen/2
								creatureComponent.laserR.getComponent(Transform).position.z = laserLen/2
								log(" laserLen: ", laserLen, " id: ", e.entity.entityId)
							} else {
								let laserLen = 10
								creatureComponent.laserL.getComponent(Transform).scale.z = laserLen
								creatureComponent.laserR.getComponent(Transform).scale.z = laserLen
								creatureComponent.laserL.getComponent(Transform).position.z = laserLen/2
								creatureComponent.laserR.getComponent(Transform).position.z = laserLen/2

							}
						})



					break;

				////// DORMANT & VANISHED  //////
				default: 
					if(creatureTransform.position.y > creatureComponent.initialPosition.y) {
						creatureTransform.position.y -= creatureComponent.spawningSpeed * dt

						if(creatureTransform.position.y < creatureComponent.initialPosition.y)
							creatureTransform.position.y = creatureComponent.initialPosition.y
					}
					break;
			}
		}
	}
}

export let creatureEntity = new Entity()
engine.addEntity(creatureEntity)
creatureEntity.addComponent(new GLTFShape("models/Chobi.glb"))
creatureEntity.addComponent(new Transform({
	position: new Vector3(31, -1.5, 25),
	scale: new Vector3(1.5, 1.5, 1.5)
}))
export let creatureComponent = new CreatureComponent()
creatureEntity.addComponent(creatureComponent)

/* const rayMaterial = new Material()
rayMaterial.metallic = 1
rayMaterial.roughness = 0.5
rayMaterial.albedoColor = new Color3(30, 1, 1)
let laserL = new Entity()
laserL.addComponent(new BoxShape())
laserL.getComponent(BoxShape).withCollisions = false
laserL.addComponent(new Transform({
	scale: new Vector3(0.1 ,0.1, 20 ),
	position: new Vector3(-0.2, 1.2, 10)
}))
laserL.addComponent(rayMaterial)
laserL.setParent(mica)

engine.addEntity(laserL)


let laserR = new Entity()
laserR.addComponent(new BoxShape())
laserR.getComponent(BoxShape).withCollisions = false
laserR.addComponent(new Transform({
	scale: new Vector3(0.1 ,0.1, 20 ),
	position: new Vector3(0.2, 1.2, 10)
}))
laserR.addComponent(rayMaterial)
laserR.setParent(mica)

engine.addEntity(laserR) */

engine.addSystem(new CreatureSystem())