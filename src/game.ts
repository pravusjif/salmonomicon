import { atlas } from './UI'
import { Behavior, FollowPlayerSystem } from './creature'
import {createBuilderScene} from './builderScene'
import { scatterPages } from '././book'
import { spawnMica } from '././mica'

//// creature

engine.addSystem(new FollowPlayerSystem())

let creature = new Entity()
engine.addEntity(creature)
creature.addComponent(new GLTFShape("models/mule.gltf"))
creature.addComponent(new Transform({
	position: new Vector3(20, 0, 20)
}))
creature.addComponent(new Behavior())



createBuilderScene()

scatterPages(5)


spawnMica()

