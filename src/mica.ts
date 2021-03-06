import { book, startGame } from "./book"
import { creature, CreatureState } from "./creature"
import { 
	enableMicasHeadOnHand,
	 releaseLeftHand, 
	 RadarMicaSystem,
	 radarMicaDialogueUIText,
	 GrabLighter} from "./micaUI"
import { animatedUISystem } from "./UISpritesAnimation"
import { beingWatchedText } from "./UI"

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
			new DialogueLine("Oh, look out for the creature that's bound to this curse", 5),
			new DialogueLine("It wants to kill you", 3),
			new DialogueLine("DON'T look at it directly, or he will come at you faster!", 4),
			new DialogueLine("And whatever you do... DO NOT LET HIM GET TO YOU", 4),
			new DialogueLine("Find the pages, follow my eyes", 3),
			new DialogueLine("", -1)
		]

		this.finalPassageDialogueLines = [
			new DialogueLine("Great! Now I must recite the magic words...", 3),
			new DialogueLine("It's been so long since I chanted this, I hope it works...", 3),
			new DialogueLine("Klaatu... Barada... AHEM-Cof!-Cof!-oktu!", 3),
			new DialogueLine("Oh shait! It seems it worked half-way", 3),
			new DialogueLine("It's trapped in the pentagram, but...", 3),
			new DialogueLine("Light the candles to finish sending him back!", -1),
		]

		this.gameFinishedDialogueLines = [
			new DialogueLine("We did it!", 3),
			new DialogueLine("Thank you so much!", 3),
			new DialogueLine("I admit this was not the state I pictured my body would be in...", 5),
			new DialogueLine("But after 300 years what can you expect, right? HA!", 5),
			new DialogueLine("Join me in this victory dance!", 4),
		]
	}

	getCurrentState() : MicaState {
		return this.currentState
	}

	setState(newState: MicaState) {
		if(this.currentState == newState) return

		this.currentDialogueIndex = 0
		this.currentState = newState

		micaDialogueSystem.waitingState = 0
	}
}

let camera = Camera.instance
let micaHeadEntity = new Entity()

export let micaComponent = new MicaComponent()
micaHeadEntity.addComponent(micaComponent)

export function IsMicaComponentOnPedestal(): boolean {
	let currentState = micaComponent.getCurrentState()
	return currentState == MicaState.GameStart || currentState == MicaState.ReadingFinalPassage
}

let micaHeadShape = new GLTFShape("models/Mika_Head.glb")

micaHeadEntity.addComponent(micaHeadShape)
export let micaTransform = new Transform({
	position: new Vector3(31.5, 1.8, 14.8),
	rotation: Quaternion.Euler(0,0,0),
	scale: new Vector3(0.5, 0.5, 0.5)
})
//micaHeadEntity.addComponent(new Billboard())
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
					if(micaComponent.currentDialogueIndex == micaComponent.gameStartDialogueLines.length-1){
						startGame()
					} else if(micaDialogueSystem.waitingState != -1){
						micaDialogueSystem.waitingState = 0
					}
				}
				break;
			case MicaState.ReadingFinalPassage:
				if(creature.currentState == CreatureState.Hunting && micaDialogueSystem.waitingState != -1){
					micaDialogueSystem.waitingState = 0
				}
				break;
	}

	// if (creature.currentState == CreatureState.Vanished){
	// 	resetGame()
	// }
}))
engine.addEntity(micaHeadEntity)

let micaTextEntity = new Entity()

export let micaTextShape = new TextShape()
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
	enabled: boolean = true
	currentWaitingTime: number = 0
	waitingState: MicaState

	update(dt: number) {
		let currentState = micaComponent.getCurrentState()
		// log("micaState: " + currentState)
		// log("creatureState: " + creature.currentState)
		if(!this.enabled) return

		if(beingWatchedText.visible) {
			radarMicaDialogueUIText.value = ""
			return
		}

		// let currentState = micaComponent.getCurrentState()

		if(this.currentWaitingTime > 0) {
			if(currentState != this.waitingState) {
				// Reset waiting time if we changed states
				this.currentWaitingTime = 0
			} else {
				this.currentWaitingTime -= dt
	
				if(this.currentWaitingTime > 0) return
			}
		}

		this.waitingState = currentState		
		switch (currentState) {
			case MicaState.AskingForHelp:
				// random index
				micaComponent.currentDialogueIndex = Math.floor(Scalar.RandomRange(0, micaComponent.helpDialogueLines.length))
				
				this.currentWaitingTime = micaComponent.helpDialogueLines[micaComponent.currentDialogueIndex].readingTimeInSeconds
				
				micaTextShape.value = micaComponent.helpDialogueLines[micaComponent.currentDialogueIndex].text
				
				break;

			case MicaState.GameStart:
				if(micaComponent.currentDialogueIndex < micaComponent.gameStartDialogueLines.length-1){
					this.currentWaitingTime = micaComponent.gameStartDialogueLines[micaComponent.currentDialogueIndex].readingTimeInSeconds
	
					micaTextShape.value = micaComponent.gameStartDialogueLines[micaComponent.currentDialogueIndex].text
					
					micaComponent.currentDialogueIndex++;

				} else if(micaTextShape.value != micaComponent.gameStartDialogueLines[micaComponent.currentDialogueIndex].text) {
					micaTextShape.value = micaComponent.gameStartDialogueLines[micaComponent.currentDialogueIndex].text
				}
				break;

			case MicaState.DetectingPages:
				if(micaComponent.currentDialogueIndex < micaComponent.detectingPagesDialogueLines.length-1){
					this.currentWaitingTime = micaComponent.detectingPagesDialogueLines[micaComponent.currentDialogueIndex].readingTimeInSeconds
	
					radarMicaDialogueUIText.value = micaComponent.detectingPagesDialogueLines[micaComponent.currentDialogueIndex].text
					
					micaComponent.currentDialogueIndex++;
				} else if(radarMicaDialogueUIText.value != micaComponent.detectingPagesDialogueLines[micaComponent.currentDialogueIndex].text){
					radarMicaDialogueUIText.value = micaComponent.detectingPagesDialogueLines[micaComponent.currentDialogueIndex].text

					radarMica.enabled = true
					animatedUISystem.enabled = false
				}
				break;
		
				case MicaState.ReadingFinalPassage:
					if(micaComponent.currentDialogueIndex < micaComponent.finalPassageDialogueLines.length-1){
						this.currentWaitingTime = micaComponent.finalPassageDialogueLines[micaComponent.currentDialogueIndex].readingTimeInSeconds
		
						// micaTextShape.value = micaComponent.finalPassageDialogueLines[micaComponent.currentDialogueIndex].text
						radarMicaDialogueUIText.value = micaComponent.finalPassageDialogueLines[micaComponent.currentDialogueIndex].text
						if(micaComponent.currentDialogueIndex == 3)
							book.trapCreature()
						
						micaComponent.currentDialogueIndex++;
					} else if(micaTextShape.value != micaComponent.finalPassageDialogueLines[micaComponent.currentDialogueIndex].text){
						// micaTextShape.value = micaComponent.finalPassageDialogueLines[micaComponent.currentDialogueIndex].text
						radarMicaDialogueUIText.value = micaComponent.finalPassageDialogueLines[micaComponent.currentDialogueIndex].text
	
						GrabLighter()
					}
					
					break;
				
				case MicaState.Reincarnated:
					this.currentWaitingTime = micaComponent.gameFinishedDialogueLines[micaComponent.currentDialogueIndex].readingTimeInSeconds
	
					reincarnatedMicaTextShape.value = micaComponent.gameFinishedDialogueLines[micaComponent.currentDialogueIndex].text
					
					micaComponent.currentDialogueIndex++;

					if(micaComponent.currentDialogueIndex == micaComponent.gameFinishedDialogueLines.length)
						micaComponent.currentDialogueIndex = 0
				
					break;
		}
	}	
}

export let micaDialogueSystem = new MicaDialogueSystem()
engine.addSystem(micaDialogueSystem)
export let radarMica = new RadarMicaSystem(micaComponent)
engine.addSystem(radarMica)

export function grabMicasHead() {
	if(micaComponent.getCurrentState() != MicaState.GameStart) return

	micaTextShape.visible = false
	micaTextShape.value = ""
	micaHeadShape.visible = false

	enableMicasHeadOnHand()

	micaComponent.setState(MicaState.DetectingPages)
}

export function releaseMicasHead() {
	if(micaComponent.getCurrentState() == MicaState.ReadingFinalPassage) return
	
	micaHeadShape.visible = true
	micaTextShape.visible = true
	radarMicaDialogueUIText.value = ""
	animatedUISystem.enabled = false
	
	releaseLeftHand()

	micaDialogueSystem.enabled = true;
	
	micaComponent.setState(MicaState.ReadingFinalPassage)
}

export function resetMicasHead() {
	micaHeadShape.visible = true
	micaTextShape.visible = true
	radarMicaDialogueUIText.value = ""
	animatedUISystem.enabled = false

	micaComponent.setState(MicaState.AskingForHelp)

	releaseLeftHand()
}


let dancingMica = new Entity()
let danceAnim = new AnimationState("Dance")

let reincarnatedMicaTextEntity = new Entity()

export let reincarnatedMicaTextShape = new TextShape()
reincarnatedMicaTextShape.billboard = true
reincarnatedMicaTextShape.fontSize = 2
reincarnatedMicaTextShape.color = Color3.Yellow()
reincarnatedMicaTextEntity.addComponent(reincarnatedMicaTextShape)
reincarnatedMicaTextEntity.addComponent(new Transform({
	position: new Vector3(0, 2, 0)
}))

reincarnatedMicaTextEntity.setParent(dancingMica)

let champignonAudioEntity = new Entity()

export function prepareDancingMika(){

	if (engine.entities[dancingMica.uuid]){return}

	dancingMica.addComponent(new GLTFShape("models/MikaDance.glb"))
	dancingMica.addComponent(new Transform({
		position: new Vector3(28, -3, 28),
		rotation: Quaternion.Euler(0, 180, 0),
		scale: new Vector3(1.5, 1.5, 1.5)
	}))
	dancingMica.addComponent(new Animator())
	dancingMica.getComponent(Animator).addClip(danceAnim)
	
	champignonAudioEntity.addComponent(new Transform({
		position: new Vector3(24, 1, 37)
	}))
	
	champignonAudioEntity.addComponent(new AudioSource(new AudioClip("sounds/champignong.mp3")))
	// dancingMica.addComponent(new AudioSource(new AudioClip("sounds/champignong.mp3")))

	engine.addEntity(dancingMica)
	engine.addEntity(reincarnatedMicaTextEntity)
	engine.addEntity(champignonAudioEntity)
}



export function reencarnateMika(){

	micaHeadShape.visible = false
	micaHeadEntity.getComponent(MicaComponent).setState(MicaState.Reincarnated)	

	champignonAudioEntity.getComponent(AudioSource).playing = true
	// dancingMica.getComponent(AudioSource).playing = true
	danceAnim.playing = true
	dancingMica.getComponent(Transform).position = new Vector3(32, 1, 39.8)

}