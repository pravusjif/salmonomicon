import utils from "../node_modules/decentraland-ecs-utils/index"
import { book, resetGame, startGame } from "./book"
import { creature, CreatureState } from "./creature"
import { 
	enableMicasHeadOnHand,
	 releaseLeftHand, 
	 RadarMicaSystem} from "./micaUI"

export enum MicaState {
	AskingForHelp,
	GameStart,
	DetectingPages,
	ReadingFinalPassage,
	Reincarnated // nice to have: Mica with a newly spawned body, but it's a woman's body and he says something like "Well... it's better than not having a body at all!"
}

class DialogueLine {
	text: string
	readingTimeInSeconds: number = 3

	constructor(text: string, readingTimeInSeconds: number) {
		this.text = text
		this.readingTimeInSeconds = readingTimeInSeconds
	}
}

@Component('MicaComponent')
export class MicaComponent {
	private currentState: MicaState = MicaState.AskingForHelp

	currentDialogueIndex: number = 0
	
	helpDialogueLines: DialogueLine[]
	gameStartDialogueLines: DialogueLine[]
	detectingPagesDialogueLines: DialogueLine[]
	finalPassageDialogueLines: DialogueLine[]
	gameFinishedDialogueLines: DialogueLine[]

	constructor() {
		this.helpDialogueLines = [
			new DialogueLine("Hey you!", 3),
			new DialogueLine("Help!", 3),
			new DialogueLine("Hey!", 3),
			new DialogueLine("Help me!", 3),
			new DialogueLine("Hey get over here!", 3),
			new DialogueLine("Damn...", 3),
			new DialogueLine("I HATE this curse!", 3),
			new DialogueLine("Please get over here!", 3),
			new DialogueLine("!!!", 3),
			new DialogueLine("I need your help!", 3)
		]

		this.gameStartDialogueLines = [
			new DialogueLine("Hi! I'm Mika, nice to meet you", 4),
			new DialogueLine("I've been cursed and lost my body", 4),
			new DialogueLine("Will you help me please?", 2),
			new DialogueLine("I must retrieve pages from my book, the Salmonomicon", 4),
			new DialogueLine("Take me with you, I'll lead the way!", -1)
		]

		this.detectingPagesDialogueLines = [
			new DialogueLine("Oh, by the way, look out for the creature that's bound to this curse, it will try to kill you", 4),
			new DialogueLine("DON'T look at it directly, or he will come at you faster!", 4),
			new DialogueLine("And whatever you do... DO NOT LET HIM GET TO YOU", 4),
			new DialogueLine("", -1)
		]

		this.finalPassageDialogueLines = [
			new DialogueLine("Great! Now I just need to recite the magic words and be done with this damn curse!", 5),
			new DialogueLine("Here I go... It's been so long since I chanted this, I hope it works...", 4),
			new DialogueLine("Klaatu... Barada... AHEM-Cof!-Cof!-oktu!", 6),
			new DialogueLine("Oh shait! It seems it worked half-way", 3),
			new DialogueLine("The creature is trapped in the pentagram, but...", 3),
			new DialogueLine("You have to light the 3 candles to finish sending him back!", -1),
		]
	}

	getCurrentState() : MicaState {
		return this.currentState
	}

	setState(newState: MicaState) {
		if(this.currentState == newState) return

		this.currentDialogueIndex = 0
		this.currentState = newState
	}
}

let camera = Camera.instance
let micaHeadEntity = new Entity()

export let micaComponent = new MicaComponent()
micaHeadEntity.addComponent(micaComponent)

let micaHeadShape = new GLTFShape("models/Mika_Head.glb")

micaHeadEntity.addComponent(micaHeadShape)
export let micaTransform = new Transform({
	position: new Vector3(31.5, 1.3, 15.3),
	rotation: Quaternion.Euler(0,180,0),
	scale: new Vector3(0.5, 0.5, 0.5)
})
micaHeadEntity.addComponent(micaTransform)
micaHeadEntity.addComponentOrReplace(new OnPointerDown(e=>{
	if(e.hit.length > 3) return

	let currentState = micaComponent.getCurrentState()
	
	switch (currentState) {
		case MicaState.AskingForHelp:
				micaComponent.setState(MicaState.GameStart)
			break;
		case MicaState.GameStart:
			if(creature.currentState == CreatureState.Dormant){
				if(micaComponent.currentDialogueIndex == micaComponent.gameStartDialogueLines.length){
					startGame()
				} else {
					micaDialogueSystem.waitingState = 0
				}
			}
			break;
	}

	// if (creature.currentState == CreatureState.Vanished){
	// 	resetGame()
	// }
}))
engine.addEntity(micaHeadEntity)

let micaTextEntity = new Entity()

let micaTextShape = new TextShape()
micaTextShape.billboard = true
micaTextShape.fontSize = 3
// micaTextShape.resizeToFit = true
micaTextShape.color = Color3.Yellow()
micaTextEntity.addComponent(micaTextShape)
micaTextEntity.addComponent(new Transform({
position: new Vector3(0, 1.25, 0)
}))
micaTextEntity.setParent(micaHeadEntity)
engine.addEntity(micaTextEntity)

class MicaDialogueSystem implements ISystem {
	currentWaitingTime: number = 0
	waitingState: MicaState

	update(dt: number) {
		let currentState = micaComponent.getCurrentState()

		if(this.currentWaitingTime > 0) {
			if(currentState != this.waitingState) {
				// Reset waiting time if we changed states
				this.currentWaitingTime = 0
			} else {
				this.currentWaitingTime -= dt
	
				if(this.currentWaitingTime > 0) return
			}
		} else if (this.currentWaitingTime == -1) {
			return
		}
		
		switch (currentState) {
			case MicaState.AskingForHelp:
				// random index
				micaComponent.currentDialogueIndex = Math.floor(Scalar.RandomRange(0, micaComponent.helpDialogueLines.length))
				
				this.currentWaitingTime = micaComponent.helpDialogueLines[micaComponent.currentDialogueIndex].readingTimeInSeconds
				this.waitingState = currentState
				
				micaTextShape.value = micaComponent.helpDialogueLines[micaComponent.currentDialogueIndex].text
				
				break;

			case MicaState.GameStart:
				this.currentWaitingTime = micaComponent.gameStartDialogueLines[micaComponent.currentDialogueIndex].readingTimeInSeconds
				this.waitingState = currentState

				micaTextShape.value = micaComponent.gameStartDialogueLines[micaComponent.currentDialogueIndex].text
				
				micaComponent.currentDialogueIndex++;
				break;

			case MicaState.DetectingPages:
			
				break;
		
			case MicaState.ReadingFinalPassage:
		
				break;
		}
	}	
}

let micaDialogueSystem = new MicaDialogueSystem()
engine.addSystem(micaDialogueSystem)
engine.addSystem(new RadarMicaSystem(micaComponent))

export function grabMicasHead() {
	micaTextShape.visible = false
	micaTextShape.value = ""
	micaHeadShape.visible = false

	enableMicasHeadOnHand()

	micaComponent.setState(MicaState.DetectingPages)
}

export function resetMicasHead() {
	micaTextShape.visible = true
	micaHeadShape.visible = true

	micaComponent.setState(MicaState.AskingForHelp)

	releaseLeftHand()
}

export function reencarnateMika(){

	micaHeadEntity.getComponent(MicaComponent).setState(MicaState.Reincarnated)
	micaHeadEntity.addComponentOrReplace(new GLTFShape("models/MikaDance.glb"))
	let micaTransform = new Transform({
		position: new Vector3(31.5, 1.3, 15.3),
		rotation: Quaternion.Euler(0,180,0),
		scale: new Vector3(0.05, 0.05, 0.05)
	})
	//micaHeadEntity.addComponent(n	ew Animator())
	//micaHeadEntity.getComponent(Animator).getClip("Dance").play()

	micaHeadEntity.addComponent(new AudioSource(new AudioClip("sounds/champignong.mp3")))
	micaHeadEntity.getComponent(AudioSource).playing = true

}
