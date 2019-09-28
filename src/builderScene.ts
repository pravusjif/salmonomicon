

export function createBuilderScene() {

	const dome = new Entity()
	dome.addComponentOrReplace(new GLTFShape('models/Dome.glb'))
	dome.addComponentOrReplace(new Transform({
		position: new Vector3(32, 0, 32),
		scale: new Vector3(1, 1, 1)
	}))
	engine.addEntity(dome)

	// Forest
	const forest = new Entity()
	forest.addComponentOrReplace(new GLTFShape('models/Forest.glb'))
	forest.addComponentOrReplace(new Transform({
		position: new Vector3(32, 0, 32),
		rotation: Quaternion.Euler(0, 180, 0),
		scale: new Vector3(1, 1, 1)
	}))
	engine.addEntity(forest)

	// Fog
	const fog = new Entity()
	fog.addComponentOrReplace(new GLTFShape('models/Fog.glb'))
	fog.addComponentOrReplace(new Transform({
		position: new Vector3(32, 0, 32),
		scale: new Vector3(1, 1, 1)
	}))

	const fogAnim = new Animator();
	fog.addComponent(fogAnim);
	let fogAnimation = new AnimationState("fog", { speed: 0.15 })
	fogAnim.addClip(fogAnimation);
	fogAnimation.play()

	engine.addEntity(fog)

	/// builder stuff
	const scene = new Entity()
	const transform = new Transform({
		position: new Vector3(0, 0, 0),
		rotation: new Quaternion(0, 0, 0, 1),
		scale: new Vector3(1, 1, 1)
	})
	scene.addComponentOrReplace(transform)
	engine.addEntity(scene)

	const forestFloor = new Entity()
	forestFloor.setParent(scene)
	const gltfShape_3 = new GLTFShape('models/Floor.glb')
	forestFloor.addComponentOrReplace(gltfShape_3)
	const transform_4 = new Transform({
		position: new Vector3(32, 0, 32),
		rotation: Quaternion.Euler(0, 180, 0),
		scale: new Vector3(1, 1, 1)
	})
	forestFloor.addComponentOrReplace(transform_4)
	engine.addEntity(forestFloor)

}

