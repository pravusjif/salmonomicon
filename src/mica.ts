import utils from "../node_modules/decentraland-ecs-utils/index"



export function spawnMica(){


	const rayMaterial = new Material()
	rayMaterial.metallic = 1
	rayMaterial.roughness = 0.5
	rayMaterial.albedoColor = new Color3(30, 1, 1)

	let micaPos = new Vector3(20, 0.75, 20)

	let mica = new Entity()


	mica.addComponent(new GLTFShape("models/Mika_Head.glb"))
	mica.addComponent(new Transform({
		position: micaPos
	}))
	// mica.addComponent(new utils.KeepRotatingComponent(
	// 	Quaternion.Euler(0, 25, 0)
	// ))

	engine.addEntity(mica)


	// let micaRay: Ray = {
	// 	origin: micaPos,
	// 	direction: Vector3.Forward().multiply(mica.getComponent(Transform).rotation),
	// 	distance: 20
	// }

	let laserL = new Entity()
	laserL.addComponent(new BoxShape())
	laserL.getComponent(BoxShape).withCollisions = false
	laserL.addComponent(new Transform({
		scale: new Vector3(0.1 ,0.1, 20 ),
		position: new Vector3(-0.2, 1.2, 10)
	}))
	laserL.addComponent(rayMaterial)
	laserL.setParent(mica)

	engine.addEntity(laserL)


	let laserR = new Entity()
	laserR.addComponent(new BoxShape())
	laserR.getComponent(BoxShape).withCollisions = false
	laserR.addComponent(new Transform({
		scale: new Vector3(0.1 ,0.1, 20 ),
		position: new Vector3(0.2, 1.2, 10)
	}))
	laserR.addComponent(rayMaterial)
	laserR.setParent(mica)

	engine.addEntity(laserR)

	let debugCube = new Entity()
	engine.addEntity(debugCube)
	debugCube.addComponent(new BoxShape())
	debugCube.getComponent(BoxShape).withCollisions = false
	debugCube.addComponent(new Transform())

	class MicaSpinningLaser implements ISystem {
		isMikaSpinning: Boolean = true
		rotationVelocity: number = 10

		update(dt: number) {

			if (!this.isMikaSpinning) {return}

			mica.getComponent(Transform).rotate(Vector3.Up(), dt * this.rotationVelocity)

			let newRay: Ray = {
				origin: micaPos,
				direction: Vector3.Forward().rotate(mica.getComponent(Transform).rotation),
				distance: 50
			}

			PhysicsCast.instance.hitFirst(newRay, (e) => {
				if (e.didHit){
					// for (let entityHit of e.entities) {

					// 	engine.entities[entityHit.entity.entityId].addComponentOrReplace(hitMaterial)
					//   }	 
					
					debugCube.getComponent(Transform).position.set(e.hitPoint.x, e.hitPoint.y, e.hitPoint.z)
					let hitPoint = new Vector3(e.hitPoint.x, e.hitPoint.y, e.hitPoint.z)
					let laserLen = Vector3.Distance(micaPos, hitPoint)
					laserL.getComponent(Transform).scale.z = laserLen
					laserR.getComponent(Transform).scale.z = laserLen
					laserL.getComponent(Transform).position.z = laserLen/2
					laserR.getComponent(Transform).position.z = laserLen/2
					// for (let entityHit of e.entities) {
					// 	let entID = entityHit.entity.entityId
					log(" laserLen: ", laserLen, " id: ", e.entity.entityId)
					// }
					
					//micaRay = PhysicsCast.instance.getRayFromPositions(micaPos, hitPoint)
				}
			})
		}	
	}

	engine.addSystem(new MicaSpinningLaser())


}