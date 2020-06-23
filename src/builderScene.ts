export const domeEntity = new Entity()
export const domeShape = new GLTFShape('models/Dome.glb')
domeShape.withCollisions = false
domeEntity.addComponentOrReplace(domeShape)
domeEntity.addComponentOrReplace(
  new Transform({
    position: new Vector3(32, 0, 32),
    scale: new Vector3(1, 1, 1),
  })
)
engine.addEntity(domeEntity)

// Forest
const forest = new Entity()
forest.addComponentOrReplace(new GLTFShape('models/Forest.glb'))
forest.getComponent(GLTFShape).isPointerBlocker = false
forest.addComponentOrReplace(
  new Transform({
    position: new Vector3(32, 0, 32),
    rotation: Quaternion.Euler(0, 180, 0),
    scale: new Vector3(1, 1, 1),
  })
)
engine.addEntity(forest)

// Fog
const fog = new Entity()
fog.addComponentOrReplace(new GLTFShape('models/Fog.glb'))
fog.addComponentOrReplace(
  new Transform({
    position: new Vector3(32, 0, 32),
    scale: new Vector3(1, 1, 1),
  })
)

const fogAnim = new Animator()
fog.addComponent(fogAnim)
let fogAnimation = new AnimationState('fog', { speed: 0.15 })
fogAnim.addClip(fogAnimation)
fogAnimation.play()

engine.addEntity(fog)

// Flys
const flys1 = new Entity()
flys1.addComponentOrReplace(new GLTFShape('models/flys.glb'))
flys1.addComponentOrReplace(
  new Transform({
    position: new Vector3(38, 0.5, 37),
    scale: new Vector3(1, 1, 1),
  })
)

const flys1Anim = new Animator()
flys1.addComponent(flys1Anim)
let flys1Animation = new AnimationState('fly', { speed: 1 })
flys1Anim.addClip(flys1Animation)
flys1Animation.play()

engine.addEntity(flys1)

// Flys
const flys2 = new Entity()
flys2.addComponentOrReplace(new GLTFShape('models/flys.glb'))
flys2.addComponentOrReplace(
  new Transform({
    position: new Vector3(55, 1, 14),
    scale: new Vector3(1, 1, 1),
  })
)

const flys2Anim = new Animator()
flys2.addComponent(flys2Anim)
let flys2Animation = new AnimationState('fly', { speed: 0.9 })
flys2Anim.addClip(flys2Animation)
flys2Animation.play()

engine.addEntity(flys2)

// Flys3
const flys3 = new Entity()
flys3.addComponentOrReplace(new GLTFShape('models/flys.glb'))
flys3.addComponentOrReplace(
  new Transform({
    position: new Vector3(28, 2, 48),
    scale: new Vector3(1, 1, 1),
  })
)

const flys3Anim = new Animator()
flys3.addComponent(flys3Anim)
let flys3Animation = new AnimationState('fly', { speed: 0.8 })
flys3Anim.addClip(flys3Animation)
flys3Animation.play()

engine.addEntity(flys3)

/// builder stuff
const scene = new Entity()
const transform = new Transform({
  position: new Vector3(0, 0, 0),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1),
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
  scale: new Vector3(1, 1, 1),
})
forestFloor.addComponentOrReplace(transform_4)
engine.addEntity(forestFloor)
