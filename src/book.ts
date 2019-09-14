

import utils from "../node_modules/decentraland-ecs-utils/index"

@Component('page')
export class Page {
}

export let pages = engine.getComponentGroup(Page)

export let pageCounter:number = 0

let triggerOffset = new Vector3(0, 2, 0)

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


export function grabPage(page: IEntity){
	pageCounter += 1
	log("grabbed page ", pageCounter)
	page.getComponent(GLTFShape).visible = false
	//engine.removeEntity(page)

	if (pageCounter => pages.entities.length){
		log("RAAARRWWRR I'm DYING")
	}
}

export function resetGame(){
	for (let page of pages.entities) {
		page.getComponent(GLTFShape).visible = true
	}
	log("YOU LOOSE")
	pageCounter = pages.entities.length
}