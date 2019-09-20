

import utils from "../node_modules/decentraland-ecs-utils/index"
import { creatureComponent, CreatureState } from "./creature";


@Component('page')
export class Page {
}

export let pages = engine.getComponentGroup(Page)

export let pageCounter:number = 0
export let hasAllPages: boolean = false

let triggerOffset = new Vector3(0, 2, 0)


// add pages in random places
export function scatterPages(pages: number){
	for (let i = 0; i < pages; i ++){

		let randomX = Math.random()*32
		let randomZ = Math.random()*32

		let pos = new Vector3(randomX, 0, randomZ)

		let page = new Entity()
		page.addComponent(new GLTFShape('models/PapyrusOpen_01/PapyrusOpen_01.glb'))
		page.addComponentOrReplace(new Transform({
			position: pos,
			rotation: new Quaternion(0, 0, 0, 1),
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
				grabPage(page)
				page.removeComponent(utils.TriggerComponent)				
			 },
			 null,
			 false
		))
		engine.addEntity(page)
	}
}

// when player grabs a page
export function grabPage(page: IEntity){
	pageCounter += 1
	log("grabbed page ", pageCounter)
	page.getComponent(GLTFShape).visible = false
	//engine.removeEntity(page)

	if (pageCounter => pages.entities.length){
		log("RAAARRWWRR I'm DYING")
		hasAllPages = true
	}
}

// when creature kills player
export function resetGame(){
	for (let page of pages.entities) {
		page.getComponent(GLTFShape).visible = true
	}
	log("YOU LOOSE")
	pageCounter = pages.entities.length
	hasAllPages = false
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
const book = new Entity()
const gltfShape_9 = new GLTFShape('models/Book_05/Book_05.glb')
book.addComponentOrReplace(gltfShape_9)
const transform_13 = new Transform({
position: new Vector3(0, 2.75, 0),
rotation: new Quaternion(0, 0, 0, 1),
scale: new Vector3(2, 2, 2)
})
book.addComponentOrReplace(transform_13)
const bookComplete = false
book.addComponentOrReplace(new OnClick(()=>{
	if(!bookComplete && creatureComponent.currentState == CreatureState.Dormant)
		creatureComponent.currentState = CreatureState.Hunting
}))
book.setParent(pedestal)
engine.addEntity(book)