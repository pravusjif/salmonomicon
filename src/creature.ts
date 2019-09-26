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
	rotationSpeed: number = 40
	currentState: CreatureState = CreatureState.Dormant
	transform: Transform
	laserL: IEntity = null
	laserR: IEntity = null
	beingWatched: boolean = false
	watchingPlayer: boolean = false
	waitingForRay: boolean = false
	invokeAnim: AnimationState
	searchAnim: AnimationState
	attackAnim: AnimationState
	searchSound: AudioSource
	attackSound: AudioSource

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

	  // animations
	  this.invokeAnim = new AnimationState("Invoke")
	  this.searchAnim = new AnimationState("Search")
	  this.attackAnim = new AnimationState("Attack")
	  this.addComponent(new Animator()).addClip(this.invokeAnim)
	  this.getComponent(Animator).addClip(this.searchAnim)
	  this.getComponent(Animator).addClip(this.attackAnim)
	  this.invokeAnim.play()

	  // sounds
	  let mumblingClip = new AudioClip("sounds/Search.mp3")
	  this.addComponent(new AudioSource(mumblingClip))
	  this.searchSound = this.getComponent(AudioSource)

	  let attackAudioEnt = new Entity()
	  engine.addEntity(attackAudioEnt)
	  attackAudioEnt.setParent(this)
	  let attackClip = new AudioClip("sounds/Attack.mp3")
	  let attackSource = new AudioSource(attackClip)
	  this.attackSound = attackSource
	  attackAudioEnt.addComponent(this.attackSound)
	} 

	public getInvoked() : void {
		this.currentState = CreatureState.Hunting
		this.invokeAnim.playing = true
		this.attackAnim.playing = false
		this.searchAnim.playing = false
		this.waitingForRay = false
		invokeSound.playOnce()
		this.searchSound.playing = true
	}
	
	public getTrapped() : void {
		this.currentState = CreatureState.Trapped
		this.startLaser()
		this.transform.position = creature.trappedPosition
		this.transform.rotation = Quaternion.Euler(0,0,0)
		this.waitingForRay = false
		trapSound.playOnce()
		this.searchSound.playing = false
		this.attackSound.playing = true
	}

	public getKilled() : void {
		this.laserOff()
		this.currentState = CreatureState.Vanished
		trapPlace.getComponent(AudioSource).playOnce()
		
		this.invokeAnim.playing = true
		this.attackAnim.playing = false
		this.searchAnim.playing = false
		
		this.searchSound.playing = false
		this.attackSound.playing = false
	}

	public getReset() : void {
		this.laserOff()
		this.currentState = CreatureState.Dormant
		
		this.transform.position = this.initialPosition
		this.invokeAnim.playing = false
		this.attackAnim.playing = false
		this.searchAnim.playing = false
		
		this.searchSound.playing = false
		this.attackSound.playing = false
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
				this.invokeAnim.playing = false
				this.attackAnim.playing = true
				this.searchAnim.playing = false
				this.attackSound.playing = true
			} else {
				this.speed = this.originalSpeed
				this.invokeAnim.playing = false
				this.attackAnim.playing = false
				this.searchAnim.playing = true
				this.attackSound.playing = false
			}

		} else {
			this.beingWatched = false
			this.invokeAnim.playing = false
			this.attackAnim.playing = false
			this.searchAnim.playing = true
			this.attackSound.playing = false
		}
		
	}

	public startLaser(): void {

		if (this.laserL){
			this.laserL.getComponent(BoxShape).visible = true
			this.laserR.getComponent(BoxShape).visible = true
		} else {
			let laserL = new Entity()
			laserL.addComponent(new BoxShape())
			laserL.getComponent(BoxShape).withCollisions = false
			laserL.addComponent(new Transform({
				scale: new Vector3(0.05 ,0.05, 10 ),
				position: new Vector3(-0.065, 0.55, 5.2)
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
				position: new Vector3(0.065, 0.55, 5.2)
			}))
			laserR.addComponent(rayMaterial)
			laserR.setParent(this)
			this.laserR = laserR
			engine.addEntity(laserR)
		}

		this.invokeAnim.playing = false
		this.attackAnim.playing = false
		this.searchAnim.playing = true
	}

    public checkLaser(playerPos: Vector3): void {
		if (!this.laserL || !this.laserR) return
		if (this.waitingForRay) return
		this.waitingForRay = true

		let newRay: Ray = {
			origin: this.transform.position,
			direction: Vector3.Forward().rotate(this.transform.rotation),
			distance: 15
		}

		PhysicsCast.instance.hitFirst(newRay, (e) => {
			let laserLen: number
			let playerSafe: boolean = false
			if (e.didHit){
				//debugCube.getComponent(Transform).position.set(e.hitPoint.x, e.hitPoint.y, e.hitPoint.z)
				let hitPoint = new Vector3(e.hitPoint.x, e.hitPoint.y, e.hitPoint.z)
				laserLen = Vector3.Distance(this.transform.position, hitPoint) - 2
				this.drawLaserLength(laserLen)
				//log(" laserLen: ", laserLen, " id: ", e.entity.entityId)
			} else {
				laserLen = 15
				this.drawLaserLength(laserLen)
			}
			const rayToPlayer: Ray = PhysicsCast.instance.getRayFromPositions(this.transform.position, playerPos)
			PhysicsCast.instance.hitFirst(rayToPlayer, (e) => {
				if(e.didHit){
					playerSafe = true
				} else {
					let angle = Vector3.GetAngleBetweenVectors(
						new Vector3(rayToPlayer.direction.x, rayToPlayer.direction.y, rayToPlayer.direction.z),
						new Vector3(newRay.direction.x, newRay.direction.y, newRay.direction.z)
						, Vector3.Up()
						)
					if (Math.abs(angle) < 0.2	 && rayToPlayer.distance < laserLen + 0.5){
						log("PLAYER HIT,  laserLen: ", laserLen, " player distance: ",  rayToPlayer.distance)
						resetGame()
					}
				}
			})

			
			//log(laserLen)
			this.waitingForRay = false
		})
	}

	public drawLaserLength(laserLen: number): void {
		this.laserL.getComponent(Transform).scale.z = laserLen
		this.laserR.getComponent(Transform).scale.z = laserLen
		this.laserL.getComponent(Transform).position.z = laserLen/2 + 0.5
		this.laserR.getComponent(Transform).position.z = laserLen/2 + 0.5
	}

	public laserOff () :void {
		if (this.currentState == CreatureState.Trapped){
			this.laserL.getComponent(BoxShape).visible = false
			this.laserR.getComponent(BoxShape).visible = false
		}	
		this.invokeAnim.playing = true
		this.attackAnim.playing = false
		this.searchAnim.playing = false
		this.waitingForRay = false
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
		rotation: Quaternion.Euler(0, 180, 8),
		scale: new Vector3(1.5, 1.5, 1.5)
	},
	new GLTFShape("models/Chobi.glb")
)

let creatures: Creature[] = [creature]


export let invokeSound = new AudioSource(new AudioClip("sounds/creature-summoned2.wav"))
export let invokePlace = new Entity()
invokePlace.addComponent(new Transform({
	position: creature.initialPosition
}))
engine.addEntity(invokePlace)
invokePlace.addComponent(invokeSound)

export let trapSound = new AudioSource(new AudioClip("sounds/creature-trapped.wav"))
export let trapPlace = new Entity()
trapPlace.addComponent(new Transform({
	position: creature.trappedPosition
}))
engine.addEntity(trapPlace)
trapPlace.addComponent(trapSound)
