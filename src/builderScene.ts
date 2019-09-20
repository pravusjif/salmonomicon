

export function createBuilderScene(){

	// trees
	const trees = new Entity()
	trees.addComponentOrReplace(new GLTFShape('models/Trees.glb'))
	trees.addComponentOrReplace(new Transform({
		position: new Vector3(32, 0, 32),
		scale: new Vector3(1, 1, 1)
	  }))
	engine.addEntity(trees)	

	const trees2 = new Entity()
	trees2.addComponentOrReplace(new GLTFShape('models/Trees.glb'))
	trees2.addComponentOrReplace(new Transform({
		position: new Vector3(32, 0, 32),
		scale: new Vector3(1, 1, 1),
		rotation: Quaternion.Euler(0, 90, 0)
	  }))
	engine.addEntity(trees2)

	/// builder stuff
	const scene = new Entity()
	const transform = new Transform({
	  position: new Vector3(0, 0, 0),
	  rotation: new Quaternion(0, 0, 0, 1),
	  scale: new Vector3(1, 1, 1)
	})
	scene.addComponentOrReplace(transform)
	engine.addEntity(scene)
	
	const bonesChest_01 = new Entity()
	bonesChest_01.setParent(scene)
	const gltfShape = new GLTFShape('models/BonesChest_01/BonesChest_01.glb')
	bonesChest_01.addComponentOrReplace(gltfShape)
	const transform_2 = new Transform({
	  position: new Vector3(27, 0, 18.5),
	  rotation: new Quaternion(0, 0, 0, 1),
	  scale: new Vector3(1, 1, 1)
	})
	bonesChest_01.addComponentOrReplace(transform_2)
	engine.addEntity(bonesChest_01)
	
	const fish_02 = new Entity()
	fish_02.setParent(scene)
	const gltfShape_2 = new GLTFShape('models/Fish_02/Fish_02.glb')
	fish_02.addComponentOrReplace(gltfShape_2)
	const transform_3 = new Transform({
	  position: new Vector3(22, 0, 25),
	  rotation: new Quaternion(0, 0, 0, 1),
	  scale: new Vector3(1, 1, 1)
	})
	fish_02.addComponentOrReplace(transform_3)
	engine.addEntity(fish_02)
	
	const floorBaseDirt_01 = new Entity()
	floorBaseDirt_01.setParent(scene)
	const gltfShape_3 = new GLTFShape('models/FloorBaseDirt_01/FloorBaseDirt_01.glb')
	floorBaseDirt_01.addComponentOrReplace(gltfShape_3)
	const transform_4 = new Transform({
	  position: new Vector3(32, 0, 32),
	  rotation: new Quaternion(0, 0, 0, 1),
	  scale: new Vector3(4, 2, 4)
	})
	floorBaseDirt_01.addComponentOrReplace(transform_4)
	engine.addEntity(floorBaseDirt_01)
	
	const floorBaseDirt_01_2 = new Entity()
	floorBaseDirt_01_2.setParent(scene)
	floorBaseDirt_01_2.addComponentOrReplace(gltfShape_3)
	const transform_5 = new Transform({
	  position: new Vector3(24, 0, 8),
	  rotation: new Quaternion(0, 0, 0, 1),
	  scale: new Vector3(1, 1, 1)
	})
	floorBaseDirt_01_2.addComponentOrReplace(transform_5)
	engine.addEntity(floorBaseDirt_01_2)
	
	const floorBaseDirt_01_3 = new Entity()
	floorBaseDirt_01_3.setParent(scene)
	floorBaseDirt_01_3.addComponentOrReplace(gltfShape_3)
	const transform_6 = new Transform({
	  position: new Vector3(8, 0, 24),
	  rotation: new Quaternion(0, 0, 0, 1),
	  scale: new Vector3(1, 1, 1)
	})
	floorBaseDirt_01_3.addComponentOrReplace(transform_6)
	engine.addEntity(floorBaseDirt_01_3)
	
	const floorBaseDirt_01_4 = new Entity()
	floorBaseDirt_01_4.setParent(scene)
	floorBaseDirt_01_4.addComponentOrReplace(gltfShape_3)
	const transform_7 = new Transform({
	  position: new Vector3(24, 0, 24),
	  rotation: new Quaternion(0, 0, 0, 1),
	  scale: new Vector3(1, 1, 1)
	})
	floorBaseDirt_01_4.addComponentOrReplace(transform_7)
	engine.addEntity(floorBaseDirt_01_4)
	
/* 	const module_Stone_Curve_02 = new Entity()
	module_Stone_Curve_02.setParent(scene)
	const gltfShape_4 = new GLTFShape('models/Module_Stone_Curve_02/Module_Stone_Curve_02.glb')
	module_Stone_Curve_02.addComponentOrReplace(gltfShape_4)
	const transform_8 = new Transform({
	  position: new Vector3(24.5, 0, 5.5),
	  rotation: new Quaternion(0, 0, 0, 1),
	  scale: new Vector3(1, 1, 1)
	})
	module_Stone_Curve_02.addComponentOrReplace(transform_8)
	engine.addEntity(module_Stone_Curve_02)
	
	const module_Stone_Straight_Window_02 = new Entity()
	module_Stone_Straight_Window_02.setParent(scene)
	const gltfShape_5 = new GLTFShape('models/Module_Stone_Straight_Window_02/Module_Stone_Straight_Window_02.glb')
	module_Stone_Straight_Window_02.addComponentOrReplace(gltfShape_5)
	const transform_9 = new Transform({
	  position: new Vector3(20.5, 0, 5.5),
	  rotation: new Quaternion(0, 0, 0, 1),
	  scale: new Vector3(1, 1, 1)
	})
	module_Stone_Straight_Window_02.addComponentOrReplace(transform_9)
	engine.addEntity(module_Stone_Straight_Window_02) */
	
/* 	const module_Stair_Stones_1M = new Entity()
	module_Stair_Stones_1M.setParent(scene)
	const gltfShape_7 = new GLTFShape('models/Module_Stair_Stones_1M/Module_Stair_Stones_1M.glb')
	module_Stair_Stones_1M.addComponentOrReplace(gltfShape_7)
	const transform_11 = new Transform({
	  position: new Vector3(6, 0, 26),
	  rotation: new Quaternion(0, 0, 0, 1),
	  scale: new Vector3(6, 6, 6)
	})
	module_Stair_Stones_1M.addComponentOrReplace(transform_11)
	engine.addEntity(module_Stair_Stones_1M)
	
	const module_Stone_Curve_01 = new Entity()
	module_Stone_Curve_01.setParent(scene)
	const gltfShape_8 = new GLTFShape('models/Module_Stone_Curve_01/Module_Stone_Curve_01.glb')
	module_Stone_Curve_01.addComponentOrReplace(gltfShape_8)
	const transform_12 = new Transform({
	  position: new Vector3(7.545231209431366, 0, 29.720018065989848),
	  rotation: new Quaternion(-0.0054489159138363386, -0.9760325458292444, -0.024603544911041598, 0.21616069109636316),
	  scale: new Vector3(1, 1, 1)
	})
	module_Stone_Curve_01.addComponentOrReplace(transform_12)
	engine.addEntity(module_Stone_Curve_01) */

}

