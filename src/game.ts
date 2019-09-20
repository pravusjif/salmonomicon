import { atlas } from './UI'
import { Behavior, FollowPlayerSystem, spawnCreature } from './creature'
import {createBuilderScene} from './builderScene'
import { scatterPages } from '././book'
import { spawnMica } from '././mica'

//// creature



let creature = spawnCreature()
engine.addSystem(new FollowPlayerSystem())


createBuilderScene()

scatterPages(5)


// spawnMica()

