

import utils from "../node_modules/decentraland-ecs-utils/index"
import { creatureComponent, CreatureState } from "./creature";
import { pageCounterUI, pagesUI } from "./UI";


@Component('page')
export class Page {
}

export let pages = engine.getComponentGroup(Page)

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





// add pages in random places
export function scatterPages(totalPages: number){
	let usedPositions: number[] = []
	for (let i = 0; i < totalPages; i ++){

		let index = Math.round(Math.random() * pagePositions.length)

		while (usedPositions.indexOf(index) > -1 ){
			index = Math.floor(Math.random() * pagePositions.length)
		}

		usedPositions.push(index)


		// let randomX = Math.random()*10 + 10
		// let randomZ = Math.random()*10 + 10

		//let pos = usedPositions[index].pos
		//let pos = new Vector3(randomX, 1, randomZ)

		let page = new Entity()
		page.addComponent(new GLTFShape('models/PapyrusOpen_01/PapyrusOpen_01.glb'))
		page.addComponentOrReplace(new Transform({
			position: pagePositions[index].pos,
			rotation: pagePositions[index].rot.toQuaternion(),
			scale: new Vector3(1, 1, 1)
		  }))
		page.addComponent(new Page())
		page.addComponent(new utils.TriggerComponent(
			new utils.TriggerBoxShape(new Vector3(2,2,2), triggerOffset),
			0, //layer
			0, //triggeredByLayer
			null, //onTriggerEnter
			null, //onTriggerExit
			() => {  //onCameraEnter	
				grabPage(page, totalPages)			
			 },
			 () => {
				page.getComponent(utils.TriggerComponent).enabled = false
			 },
			 false
		))
		engine.addEntity(page)
	}
}

// when player grabs a page
export function grabPage(page: IEntity, totalPages: number){
	
	

	if (pageCounter == 0){
		pageCounterUI.visible = true
		pagesUI.visible = true
	}
	pageCounter += 1
	pageCounterUI.value = pageCounter.toString()
	log("grabbed page ", pageCounter)
	page.getComponent(GLTFShape).visible = false
	//engine.removeEntity(page)

	if (pageCounter >= totalPages){
		log("YOU HAVE ALL PAGES: ", totalPages )
		hasAllPages = true
		pageCounterUI.value = ""
		pagesUI.value = "You have them all!"
		pagesUI.positionX = 75
	}
}

// when creature kills player
export function resetGame(){
	for (let page of pages.entities) {
		page.getComponent(GLTFShape).visible = true
		page.getComponent(utils.TriggerComponent).enabled = true
	}
	log("YOU LOOSE")
	pageCounter = pages.entities.length
	hasAllPages = false

	pageCounter = 0
	pageCounterUI.value = pageCounter.toString()
}

/* book.addComponent(new utils.TriggerComponent(
	new utils.TriggerBoxShape(new Vector3(1,8,1), triggerOffset),
	0, //layer
	0, //triggeredByLayer
	null, //onTriggerEnter
	null, //onTriggerExit
	() => {  //onCameraEnter
		if (hasAllPages){
			log("YOU WIN!")
		}			
	 },
	 null,
	 false
)) */

// book's glow
/* const rayMaterial = new Material()
rayMaterial.metallic = 1
rayMaterial.roughness = 0.5
rayMaterial.alpha = 0.2
rayMaterial.hasAlpha = true
rayMaterial.albedoColor = new Color4(1, 4, 2, 0.1)

const rayCubeObject = new Entity()
rayCubeObject.setParent(book)
const rayBoxShape = new BoxShape()
const rayObjectTransform = new Transform()

rayBoxShape.withCollisions = false
rayCubeObject.addComponent(rayBoxShape)
rayCubeObject.addComponentOrReplace(rayMaterial)
rayCubeObject.addComponentOrReplace(rayObjectTransform)

// This is just to show a ray-like object to represent
// the casted ray
rayObjectTransform.scale.x = 0.5
rayObjectTransform.scale.y = 20
rayObjectTransform.scale.z = 0.5
rayObjectTransform.position.y = 10

engine.addEntity(rayCubeObject) */

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
export const book = new Entity()
const gltfShape_9 = new GLTFShape('models/Book_05/Book_05.glb')
book.addComponentOrReplace(gltfShape_9)
const transform_13 = new Transform({
position: new Vector3(0, 2.75, -0.55),
rotation: new Quaternion(0, 0, 0, 1),
scale: new Vector3(2, 2, 2)
})
book.addComponentOrReplace(transform_13)

book.addComponentOrReplace(new OnClick(()=>{
	if(!hasAllPages && creatureComponent.currentState == CreatureState.Dormant){
		creatureComponent.currentState = CreatureState.Hunting
	} else if (hasAllPages && creatureComponent.currentState == CreatureState.Hunting){
		creatureComponent.currentState = CreatureState.Trapped
	}
}))
book.setParent(pedestal)
engine.addEntity(book)