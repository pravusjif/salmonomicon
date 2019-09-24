

import utils from "../node_modules/decentraland-ecs-utils/index"
import { creature, CreatureState } from "./creature";
import { pageCounterUI, pagesUI, dieScreen } from "./UI";
import { addCandles, candlesOnCounter, candles } from "./candles";


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
	constructor(
	  transform: TranformConstructorArgs,
	  model: GLTFShape,
	  totalPages: number,
	  isPicked: boolean = false,

	) {
	  super();
	  this.addComponent(model);
	  this.addComponent(new Transform(transform));
	  engine.addEntity(this);

	  this.addComponent(new PageComponent())  //???
	  this.addComponent(new utils.TriggerComponent(
		new utils.TriggerBoxShape(new Vector3(2,2,2), triggerOffset),
		0, //layer
		0, //triggeredByLayer
		null, //onTriggerEnter
		null, //onTriggerExit
		() => {  //onCameraEnter	
			this.grab(totalPages)			
		 },
		 () => {
			this.getComponent(utils.TriggerComponent).enabled = false
		 },
		 false
	))
	}

	public grab(totalPages: number): void {
		if (pageCounter == 0){
			pageCounterUI.visible = true
			pagesUI.visible = true
		}
		pageCounter += 1
		pageCounterUI.value = pageCounter.toString()
		log("grabbed page ", pageCounter)
		this.getComponent(GLTFShape).visible = false
		//engine.removeEntity(page)
	
		if (pageCounter >= totalPages){
			log("YOU HAVE ALL PAGES: ", totalPages )
			hasAllPages = true
			pageCounterUI.value = ""
			pagesUI.value = "You have them all!"
			pagesUI.positionX = 75
			book.activateGlow()
		}
	}
}

// add pages in random places
export function scatterPages(totalPages: number){
	pageCounter = 0
	pageCounterUI.value = ""
	if (pages.entities.length > 1 ){
		for (let page of pages.entities){
			page.getComponent(GLTFShape).visible = true
			page.getComponent(utils.TriggerComponent).enabled = true
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
				totalPages,
				false
			)
		}
	}	
}

export function startGame(){
	if(creature.currentState != CreatureState.Dormant) return

	book.invokeCreature()
}

// RESET GAME
export function resetGame(){
	
	if (creature.currentState != CreatureState.Vanished &&
		creature.currentState != CreatureState.Dormant
		){
		log("YOU LOOSE")
		dieScreen()
	}
	
	for (let page of pages.entities) {
		page.getComponent(GLTFShape).visible = false
		page.getComponent(utils.TriggerComponent).enabled = true
	}
	pageCounter = pages.entities.length
	hasAllPages = false
	pageCounter = 0
	pagesUI.value = "Pages:"
	pagesUI.positionX = 0
	pageCounterUI.value = pageCounter.toString()
	book.activateGlow()

	//candlesOnCounter = 0
	for (let candle of candles) {
		candle.turnOff()
		engine.removeEntity(candle)
	}
	
	creature.laserOff()
	creature.currentState = CreatureState.Dormant




	// RESET MIKA STATE 
}


// book's glow
const rayMaterial = new Material()
rayMaterial.metallic = 1
rayMaterial.roughness = 0.5
rayMaterial.alpha = 0.2
rayMaterial.hasAlpha = true
rayMaterial.albedoColor = new Color4(2, 2, 3, 0.1)


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
	  this.glow.visible = true
	  rayCubeObject.addComponent(new Transform({
		position: new Vector3(0, 10, 0),
		scale: new Vector3(0.5, 20, 0.5)
	  }))
	  rayCubeObject.addComponentOrReplace(rayMaterial)
	  engine.addEntity(rayCubeObject) 
	}
	public invokeCreature(): void {
		creature.currentState = CreatureState.Hunting
		creature.invokeAnim.playing = true
		creature.attackAnim.playing = false
		creature.searchAnim.playing = false
		creature.waitingForRay = false
		scatterPages(5)
		this.removeGlow()
	}
	public trapCreature(): void {
		creature.currentState = CreatureState.Trapped
		creature.startLaser()
		addCandles()
		this.removeGlow()
		creature.transform.position = creature.trappedPosition
		creature.transform.rotation = Quaternion.Euler(0,0,0)
		creature.waitingForRay = false
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

book.addComponentOrReplace(new OnClick(()=>{
	if (hasAllPages && creature.currentState == CreatureState.Hunting){
		book.trapCreature()
	}
}))