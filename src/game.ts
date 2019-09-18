import { atlas } from './UI'
import { Behavior, FollowPlayerSystem, spawnCreature } from './creature'
import {createBuilderScene} from './builderScene'
import { scatterPages } from '././book'
import { spawnMica } from '././mica'

//// creature

engine.addSystem(new FollowPlayerSystem())


let creature = spawnCreature()



createBuilderScene()

scatterPages(5)


spawnMica()

