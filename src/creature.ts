import { wrapper } from "./UI"
import { pages, pageCounter, resetGame } from "./book"

export enum CreatureState {
	Dormant,
	Hunting,
	Trapped,
	Vanished
}

@Component('behavior')
export class CreatureComponent {
}


let camera = Camera.instance
camera.rotation.toRotationMatrix


const rayMaterial = new Material()
rayMaterial.metallic = 1
rayMaterial.roughness = 0.5
rayMaterial.albedoColor = new Color3(30, 1, 1)

// creature class

export class Creature extends Entity {
	speed: number = 0.3
	originalSpeed: number = 0.3
	spawningSpeed: number = 0.2
	initialPosition: Vector3 = new Vector3(32, -1.5, 20)
	targetYPosition: number = 4
	trappedPosition: Vector3 = new Vector3(24, 1, 24)
	rotationSpeed: number = 15
	currentState: CreatureState = CreatureState.Dormant
	transform: Transform
	laserL: IEntity = null
	laserR: IEntity = null
	beingWatched: boolean = false
	watchingPlayer: boolean = false
	waitingForRay: boolean = false

	constructor(
		transform: TranformConstructorArgs,
		model: GLTFShape,
		speed: number = 0.3,
		currentState: CreatureState = CreatureState.Dormant
	) {
	  super();
	  this.addComponent(model)
	  this.addComponent(new Transform(transform))
	  this.addComponent(new CreatureComponent())
	  engine.addEntity(this)
	  this.currentState = currentState
	  this.transform = this.getComponent(Transform)
	} 

	public watchForPlayer(playerPos: Vector3): void {
		if (this.waitingForRay) return
		this.waitingForRay = true
		const rayToPlayer: Ray = PhysicsCast.instance.getRayFromPositions(this.transform.position, playerPos)

		PhysicsCast.instance.hitFirst(rayToPlayer, (e) => {
			this.waitingForRay = false
			if (e.didHit) {
				wrapper.visible = false
				this.watchingPlayer = false
			} else {
				wrapper.visible = true
				this.watchingPlayer = true
			}
		})
	}	

	public adjustSpeed(cameraForward: ReadOnlyVector3, playerPos: Vector3): void {

		let viewAngle = Math.abs(Vector3.GetAngleBetweenVectors(
			new Vector3(cameraForward.x, cameraForward.y, cameraForward.z), 
			this.transform.position.subtract(playerPos), Vector3.Up())
			)
		if (viewAngle < 0.4) {
			if (this.watchingPlayer) {
				this.beingWatched = true
				this.speed *= 1.1
			} else {
				this.speed = this.originalSpeed
			}

		} else {
			this.beingWatched = false
		}
	}

	public startLaser(): void {

		if (this.laserL){
			this.laserL.getComponent(GLTFShape).visible = true
			this.laserR.getComponent(GLTFShape).visible = true
		} else {
			let laserL = new Entity()
			laserL.addComponent(new BoxShape())
			laserL.getComponent(BoxShape).withCollisions = false
			laserL.addComponent(new Transform({
				scale: new Vector3(0.05 ,0.05, 10 ),
				position: new Vector3(-0.065, 0.55, 5)
			}))
			laserL.addComponent(rayMaterial)
			laserL.setParent(this)
			this.laserL = laserL
			engine.addEntity(laserL)
	
			let laserR = new Entity()
			laserR.addComponent(new BoxShape())
			laserR.getComponent(BoxShape).withCollisions = false
			laserR.addComponent(new Transform({
				scale: new Vector3(0.05 ,0.05, 10 ),
				position: new Vector3(0.065, 0.55, 5)
			}))
			laserR.addComponent(rayMaterial)
			laserR.setParent(this)
			this.laserR = laserR
			engine.addEntity(laserR)
		}
	}

    public checkLaser(playerPos: Vector3): void {
		let newRay: Ray = {
			origin: this.transform.position,
			direction: Vector3.Forward().rotate(this.transform.rotation),
			distance: 15
		}

		PhysicsCast.instance.hitFirst(newRay, (e) => {
			let laserLen: number
			if (e.didHit){
				//debugCube.getComponent(Transform).position.set(e.hitPoint.x, e.hitPoint.y, e.hitPoint.z)
				let hitPoint = new Vector3(e.hitPoint.x, e.hitPoint.y, e.hitPoint.z)
				laserLen = Vector3.Distance(this.transform.position, hitPoint)
				this.drawLaserLength(laserLen)
				//log(" laserLen: ", laserLen, " id: ", e.entity.entityId)
			} else {
				laserLen = 15
				this.drawLaserLength(laserLen)
			}
			const rayToPlayer: Ray = PhysicsCast.instance.getRayFromPositions(this.transform.position, playerPos)
			let angle = Vector3.GetAngleBetweenVectors(
				new Vector3(rayToPlayer.direction.x, rayToPlayer.direction.y, rayToPlayer.direction.z),
				new Vector3(newRay.direction.x, newRay.direction.y, newRay.direction.z)
				, Vector3.Up()
				)
			if (Math.abs(angle) < 0.2	 && rayToPlayer.distance < laserLen){
				log("PLAYER HIT,  angle: ", angle )
				resetGame()
			}
		})
	}

	public drawLaserLength(laserLen: number): void {
		this.laserL.getComponent(Transform).scale.z = laserLen
		this.laserR.getComponent(Transform).scale.z = laserLen
		this.laserL.getComponent(Transform).position.z = laserLen/2
		this.laserR.getComponent(Transform).position.z = laserLen/2
	}

	public laserOff () :void {
		if (this.currentState == CreatureState.Trapped){
			this.laserL.getComponent(GLTFShape).visible = false
			this.laserR.getComponent(GLTFShape).visible = false
		}	
	}
}



export class CreatureSystem {
	playerPos: Vector3
	waitingForMonsterRay: boolean = false
	waitingForCameraRay: boolean = false

	update(dt: number) {
		this.playerPos = camera.position.clone()

		for (let creature of creatures) {

			//let creatureComponent = creature.getComponent(CreatureComponent)
			let creatureTransform = creature.getComponent(Transform)

			switch (creature.currentState) {

				////// HUNTING  ///////
				case CreatureState.Hunting:
					if(creatureTransform.position.y < creature.targetYPosition) {
						creatureTransform.position.y += creature.spawningSpeed * dt

						if(creatureTransform.position.y > creature.targetYPosition)
							creatureTransform.position.y = creature.targetYPosition
						else continue
					}

					creatureTransform.lookAt(this.playerPos)

					let gap = this.playerPos.subtract(creatureTransform.position)

					let gapModule = gap.length()
					if (gapModule < 3) {
						resetGame()
						return
					}

					let direction = gap.normalize().scale(creature.speed * dt)

					creatureTransform.position = creatureTransform.position.add(direction)
					if (creatureTransform.position.y < 4) {
						creatureTransform.position.y = 4
					}

					creature.watchForPlayer(this.playerPos)

					let cameraForward = PhysicsCast.instance.getRayFromCamera(1).direction
					creature.adjustSpeed(cameraForward, this.playerPos)

					break;

				//////  TRAPPED //////
				case CreatureState.Trapped:
						
						if (creatureTransform.position.y != creature.trappedPosition.y) {
							creatureTransform.position = creature.trappedPosition
							creature.startLaser()		
						}
						creatureTransform.rotate(Vector3.Up(), dt * creature.rotationSpeed)
						creature.checkLaser(this.playerPos)
					break;

				////// DORMANT & VANISHED  //////
				default: 
					if(creatureTransform.position.y > creature.initialPosition.y) {
						creatureTransform.position.y -= creature.spawningSpeed * dt

						if(creatureTransform.position.y < creature.initialPosition.y)
							creatureTransform.position.y = creature.initialPosition.y
					}
					break;
			}
		}
	}
}

engine.addSystem(new CreatureSystem())



// Instance creature
export let creature = new Creature(
	{
		position: new Vector3(31, -1.5, 25),
		scale: new Vector3(1.5, 1.5, 1.5)
	},
	new GLTFShape("models/Chobi.glb")
)

let creatures: Creature[] = [creature]


