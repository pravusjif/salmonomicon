import { atlas } from './UI'
import { CreatureComponent, CreatureSystem } from './creature'
import {createBuilderScene} from './builderScene'
import { scatterPages } from '././book'
import { addCandles } from './candles'
import { AmbientSound } from './ambient'
import { releaseLeftHand } from './micaUI'

//// creature






createBuilderScene()

//scatterPages(5)


// spawnMica()

//addCandles()


let crickets1 = new AmbientSound(
	{position: new Vector3(10, 1, 10)},
	"sounds/crickets1.wav",
	0,
	true
)

// let crickets2 = new AmbientSound(
// 	{position: new Vector3(18, 1, 18)},
// 	"sounds/crickets2.aiff",
// 	0,
// 	true
// )

// let crickets3 = new AmbientSound(
// 	{position: new Vector3(8, 1, 18)},
// 	"sounds/crickets3.aiff",
// 	0,
// 	true
// )



let owl1 = new AmbientSound(
	{position: new Vector3(15, 4, 22)},
	"sounds/owl1.mp3",
	30000
)


// let owl2 = new AmbientSound(
// 	{position: new Vector3(24, 4, 24)},
// 	"sounds/owl2.wav",
// 	7000,
// 	true
// )