import { creature, CreatureState, invokeSound, invokePlace, trapPlace, trapSound } from "./creature";
import { pageCounterUI, dieScreen, playerWatchedUIWrapper } from "./UI";
import { addCandles, candles } from "./candles";
import { resetMicasHead, grabMicasHead, releaseMicasHead, micaDialogueSystem, radarMica } from "./mica";
import { radarMicaDialogueUIText } from "./micaUI";
import { animatedUISystem } from "./UISpritesAnimation";


@Component('page')
export class PageComponent {
}

export let pages = engine.getComponentGroup(PageComponent)

export let pageCounter:number = 0
export let hasAllPages: boolean = false

let triggerOffset = new Vector3(0, 2, 0)

export class pagePos { pos: Vector3 ; rot: Vector3 }

export let pagePositions: pagePos[] = [
	{pos: new Vector3(22,1.5,7), rot: new Vector3(0,0, 90) },
	{pos: new Vector3(15,1.5,15), rot: new Vector3(0,0, 90) },
	{pos: new Vector3(17,1.5,9), rot: new Vector3(0,0, 90) },
	{pos: new Vector3(18,1.5,18), rot: new Vector3(0,0, 90) },
	{pos: new Vector3(19,1.5,12), rot: new Vector3(0,0, 90) },
	{pos: new Vector3(15,1.5,8), rot: new Vector3(0,0, 90) },
	{pos: new Vector3(24,1.5,8), rot: new Vector3(0,0, 90) },
	{pos: new Vector3(18,1.5,10), rot: new Vector3(0,0, 90) },
	{pos: new Vector3(12,1.5,20), rot: new Vector3(0,0, 90) },
	{pos: new Vector3(15,1.5,20), rot: new Vector3(0,0, 90) },
	{pos: new Vector3(17,1.5,22), rot: new Vector3(0,0, 90) },
	{pos: new Vector3(8,1.5,8), rot: new Vector3(0,0, 90) }
]


export class Page extends Entity {
	transform: Transform
	isPicked: boolean = false

	constructor(
	  transform: TranformConstructorArgs,
	  model: GLTFShape,
	  totalPages: number

	) {
	  super();
	  this.addComponent(model);
	  this.transform = new Transform(transform)
	  this.addComponent(this.transform);
	  engine.addEntity(this);

	  this.addComponent(new PageComponent()) 
	  this.addComponent(new OnPointerDown(e => {
			if (e.hit.length > 3) return
			this.grab(totalPages)
	  	}

	  ))
	}

	public grab(totalPages: number): void {
		if (this.isPicked) return
		
		pageCounter += 1
		pageCounterUI.value = "Pages: " + pageCounter.toString() + "/5"
		
		this.getComponent(GLTFShape).visible = false
		
		this.isPicked = true
	
		if (pageCounter >= totalPages){
			hasAllPages = true
			book.activateGlow()

			radarMicaDialogueUIText.value = "Now place me by the book and I shall cast the spell!"
			micaDialogueSystem.enabled = false;
		}
	}
}

// add pages in random places
export let neededPages = []
export function scatterPages(totalPages: number){
	pageCounter = 0
	pageCounterUI.value = "Pages: " + pageCounter.toString() + "/5"
	if (pages.entities.length > 1 ){
		for (let page of pages.entities){
			page.getComponent(GLTFShape).visible = true
		}
	}else {
		let usedPositions: number[] = []
		for (let i = 0; i < totalPages; i ++){
	
			let index = Math.floor(Math.random() * pagePositions.length)
	
			while (usedPositions.indexOf(index) > -1 ){
				index = Math.floor(Math.random() * pagePositions.length)
			}
			usedPositions.push(index)
			let newPage = new Page(
				{
					position: pagePositions[index].pos,
					rotation: pagePositions[index].rot.toQuaternion()
				},
				new GLTFShape('models/PapyrusOpen_01/PapyrusOpen_01.glb'), 
				totalPages
			)
			neededPages.push(newPage)
		}
	}	
}

export function startGame(){
	if(creature.currentState != CreatureState.Dormant) return

	micaDialogueSystem.enabled = true;

	book.invokeCreature()

	grabMicasHead()
}

// RESET GAME
export function resetGame(){
	playerWatchedUIWrapper.visible = false
	
	if (creature.currentState == CreatureState.Hunting) {
	
		log("YOU LOOSE")
		dieScreen("hunted")

	} else if (creature.currentState == CreatureState.Trapped){

		log("YOU LOOSE")
		dieScreen("laser")
	}
	creature.getReset()
		
	
	for (let i = 0 ; i < neededPages.length; i ++){	
		let page = neededPages[i] as Page
		page.isPicked = false
		page.getComponent(GLTFShape).visible = false

	}
	//pageCounter = pages.entities.length
	hasAllPages = false
	pageCounter = 0
	pageCounterUI.visible = false
	pageCounterUI.value = "Pages: " + pageCounter.toString() + "/5"
	book.activateGlow()

	//candlesOnCounter = 0
	for (let candle of candles) {
		candle.turnOff()
		engine.removeEntity(candle)
	}

	// RESET MIKA STATE 
	resetMicasHead()

	micaDialogueSystem.enabled = true;
	radarMica.enabled = false
	animatedUISystem.enabled = false
}


// book's glow
const rayMaterial = new Material()
rayMaterial.metallic = 1
rayMaterial.roughness = 0.5
//rayMaterial.alpha = 0.2
//rayMaterial.hasAlpha = true
rayMaterial.transparencyMode = TransparencyMode.ALPHA_BLEND
rayMaterial.albedoColor = new Color4(2, 2, 3, 0.3)


const pedestal = new Entity()
const pedestalGLTFShape = new GLTFShape('models/Pedestal_01/Pedestal_01.glb')
pedestal.addComponentOrReplace(pedestalGLTFShape)
const transform_10 = new Transform({
  position: new Vector3(31.5, -0.1, 15),
  scale: new Vector3(0.4, 0.4, 0.4)
})
pedestal.addComponentOrReplace(transform_10)
engine.addEntity(pedestal)


// book of salmonomicon

export class Book extends Entity {
	glow: BoxShape
	constructor(
	  transform: TranformConstructorArgs,
	  model: GLTFShape
	) {
	  super()
	  this.addComponent(model)
	  this.addComponent(new Transform(transform))
	  engine.addEntity(this)
	  this.setParent(pedestal)

	  // glow
	  const rayCubeObject = new Entity()
	  rayCubeObject.setParent(this)
	  let rayShape = new BoxShape()
	  rayCubeObject.addComponent(rayShape )
	  this.glow = rayShape
	  this.glow.withCollisions = false
	  this.glow.visible = false
	  rayCubeObject.addComponent(new Transform({
		position: new Vector3(0, 10, 0),
		scale: new Vector3(0.5, 20, 0.5)
	  }))
	  rayCubeObject.addComponentOrReplace(rayMaterial)
	  engine.addEntity(rayCubeObject) 
	}
	public invokeCreature(): void {
		if(creature.currentState == CreatureState.Hunting) return

		creature.getInvoked()
		scatterPages(5)
		this.removeGlow()		
	}
	public trapCreature(): void {
		if(creature.currentState == CreatureState.Trapped) return

		creature.getTrapped()
		addCandles()
		this.removeGlow()
	}

	public activateGlow(): void {
		this.glow.visible = true
	}

	public removeGlow(): void {
		this.glow.visible = false
	}

}


export const book = new Book(
	{ position: new Vector3(0, 2.75, -0.55),
	  rotation: new Quaternion(0, 0, 0, 1),
	  scale: new Vector3(2, 2, 2)
	},
	new GLTFShape('models/Book_05/Book_05.glb')
)

book.addComponentOrReplace(new OnPointerDown(e=>{
	if (e.hit.length > 4) {return}
	if (hasAllPages && creature.currentState == CreatureState.Hunting){
		// book.trapCreature()
		releaseMicasHead()
	}
}))
