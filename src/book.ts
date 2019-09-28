import { creature, CreatureState } from "./creature";
import { pageCounterUI, dieScreen, playerWatchedUIWrapper } from "./UI";
import { addCandles, candles } from "./candles";
import { resetMicasHead, grabMicasHead, releaseMicasHead, micaDialogueSystem, radarMica, prepareDancingMika } from "./mica";
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
	{pos: new Vector3(32.6, 1.12, 46.7), rot: new Vector3(0, 0, 0) },
	{pos: new Vector3(34.24, 0.65, 55.64), rot: new Vector3(0, 0, 0) },
	{pos: new Vector3(22.13, 1.12, 52.5), rot: new Vector3(0,0, 0) },
	{pos: new Vector3(32, 0.07, 32), rot: new Vector3(0, 0, 0) },
	 {pos: new Vector3(15.16, 0.3, 35), rot: new Vector3(0, 0, 0) },

	{pos: new Vector3(51, 3 , 49.15), rot: new Vector3(90, 45.22, 0) },
	{pos: new Vector3(41.59, 4.59, 53.45), rot: new Vector3( 72, 129.8, 1.2)},
	{pos: new Vector3(49.44, 2.15, 31.62), rot: new Vector3(90, -84.13, 0) },
	{pos: new Vector3(53.48, 1.1, 22.27), rot: new Vector3(0, 0, 8.58) },
	{pos: new Vector3(55.21, 0.42, 8.84), rot: new Vector3(0, 0, 0) },
	{pos: new Vector3(17.28, 2.91, 16.42), rot: new Vector3(0,0, -90)},
	{pos: new Vector3(25.34, 2.91 ,39.49), rot: new Vector3(0,-90, -90) },
	{pos: new Vector3(32.72, 0.2, 23.49), rot: new Vector3(0,0, 0)},
	{pos: new Vector3(17.87, 0.85 ,50.54), rot: new Vector3(0,0, 0) }
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
rayMaterial.transparencyMode = 2
rayMaterial.albedoColor = new Color4(2, 2, 3, 0.3)


const pedestal = new Entity()
const pedestalGLTFShape = new GLTFShape('models/Pedestal_01/Pedestal_01.glb')
pedestal.addComponentOrReplace(pedestalGLTFShape)
const transform_10 = new Transform({
  position: new Vector3(31.5, -0.1, 14.5),
  scale: new Vector3(0.4, 0.4, 0.4)
})
pedestal.addComponentOrReplace(transform_10)
engine.addEntity(pedestal)


// book of salmonomicon
export const totalPages = 5

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
		scatterPages(totalPages)
		this.removeGlow()		
	}
	public trapCreature(): void {
		if(creature.currentState == CreatureState.Trapped) return

		creature.getTrapped()
		prepareDancingMika()
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
