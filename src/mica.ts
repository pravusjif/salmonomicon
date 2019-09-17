import utils from "../node_modules/decentraland-ecs-utils/index"



export function spawnMica(){


	const rayMaterial = new Material()
	rayMaterial.metallic = 1
	rayMaterial.roughness = 0.5
	rayMaterial.albedoColor = new Color3(30, 1, 1)

	let micaPos = new Vector3(20, 1, 20)

	let mica = new Entity()


	mica.addComponent(new GLTFShape("models/Mika_Head.glb"))
	mica.addComponent(new Transform({
		position: micaPos
	}))
	mica.addComponent(new utils.KeepRotatingComponent(
		Quaternion.Euler(0, 25, 0)
	))

	engine.addEntity(mica)



	let isMicaSpinning = true

	let micaRay: Ray = {
		origin: micaPos,
		direction: Vector3.Forward().rotate(mica.getComponent(Transform).rotation),
		distance: 20
	}

	let laserL = new Entity()
	laserL.addComponent(new BoxShape())
	laserL.addComponent(new Transform({
		scale: new Vector3(0.1 ,0.1, 20 ),
		position: new Vector3(-0.2, 1.2, 10)
	}))
	laserL.addComponent(rayMaterial)
	laserL.setParent(mica)

	engine.addEntity(laserL)


	let laserR = new Entity()
	laserR.addComponent(new BoxShape())
	laserR.addComponent(new Transform({
		scale: new Vector3(0.1 ,0.1, 20 ),
		position: new Vector3(0.2, 1.2, 10)
	}))
	laserR.addComponent(rayMaterial)
	laserR.setParent(mica)

	engine.addEntity(laserR)


	class MicaSpinningLaser {

		update(dt: number) {
			micaRay.direction = Vector3.Forward().rotate(mica.getComponent(Transform).rotation)
			PhysicsCast.instance.hitFirst(micaRay, (e) => {
				log("hit? ", e.didHit)
				let hitPoint = new Vector3(e.hitPoint.x, e.hitPoint.y, e.hitPoint.z)
				micaRay = PhysicsCast.instance.getRayFromPositions(micaPos, hitPoint)
			})
		}	
	}

	engine.addSystem(new MicaSpinningLaser())


}