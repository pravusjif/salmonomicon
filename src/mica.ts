import utils from "../node_modules/decentraland-ecs-utils/index"

export enum MicaState {
	AskingForHelp,
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

class MicaComponent {
	currentState: MicaState = MicaState.AskingForHelp
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
			new DialogueLine("Hi! Im Mika, nice to meet you", 4),
			new DialogueLine("I've been cursed and lost my body", 3),
			new DialogueLine("Will you help me please?", 2),
			new DialogueLine("I just need you to retrieve 3 missing pages from my book, the Salmonomicon", 4),
			new DialogueLine("Just take me with you and I'll point you to the right direction", -1)
		]

		this.detectingPagesDialogueLines = [
			new DialogueLine("The only thing I didn't mention is that there's a creature, bound to this curse, that will try to stop us from retrieving the pages", 4),
			new DialogueLine("DON'T look at it directly or you'll make it faster.", 4),
			new DialogueLine("And whatever you do... DO NOT LET HIM GET TO YOU", 4),
			new DialogueLine("", -1)
		]

		this.finalPassageDialogueLines = [
			new DialogueLine("Great! Now I just need to recite the magic words and be done with this damn curse!", 5),
			new DialogueLine("Here I go... It's been so long since I chanted this, I hope it works...", 4),
			new DialogueLine("Klaatu... Barada... AHEM-Cof!-Cof!-oktu!", 6),
			new DialogueLine("Oh shait! It seems it worked half-way", 3),
			new DialogueLine("The creature is trapped in the pentagram, but...", 3),
			new DialogueLine("You have to lit the 3 candles to finish sendin him to the other side!", -1),
		]
	}
}

let micaPos = new Vector3(20, 0.75, 20)
let mica = new Entity()

export let micaComponent = new MicaComponent()
mica.addComponent(micaComponent)

mica.addComponent(new GLTFShape("models/Mika_Head.glb"))
mica.addComponent(new Transform({
	position: micaPos
}))
engine.addEntity(mica)

class MicaDialogueSystem implements ISystem {
	update(dt: number) {
		switch (micaComponent.currentState) {
			case MicaState.AskingForHelp:

				
				break;

			case MicaState.DetectingPages:
			
				break;
		
			case MicaState.ReadingFinalPassage:
		
				break;
		}
	}	
}

engine.addSystem(new MicaDialogueSystem())