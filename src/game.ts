import { atlas } from './UI'
import { CreatureComponent, CreatureSystem } from './creature'
import { scatterPages } from '././book'
import { addCandles } from './candles'
import { AmbientSound } from './ambient'
import { releaseLeftHand } from './micaUI'



let crickets1 = new AmbientSound(
	{position: new Vector3(10, 1, 10)},
	"sounds/crickets1.mpw",
	0,
	true
)




let owl1 = new AmbientSound(
	{position: new Vector3(15, 4, 22)},
	"sounds/owl1.mp3",
	30000
)