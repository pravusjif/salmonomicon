import { creature, CreatureState, trapPlace } from "./creature";
import { reencarnateMika, micaTextShape } from "./mica";
import { domeShape } from "./builderScene";

export class Candle extends Entity {
  isOn:boolean = false
  onModel: GLTFShape
  offModel: GLTFShape
  constructor(
	transform: TranformConstructorArgs,
	onModel: GLTFShape,
	offModel: GLTFShape,
	isOn: boolean = false
  ) {
    super();
    

	this.addComponent(offModel);
	this.addComponent(new Transform(transform))
	this.getComponent(Transform).scale.setAll(1.1)
	engine.addEntity(this);
	
	//this.onModel = onModel;
	onModel.visible = false;
    const onEntity = new Entity()
    onEntity.addComponent(onModel)
    onEntity.setParent(this)

	this.isOn = isOn
	this.onModel = onModel
	this.offModel = offModel


    this.addComponent(
	  new OnPointerDown(e => {
		if (e.hit.length > 4 || isOn) return
		  this.turnOn()
	  })
    )
  }
  public turnOn () :void {
	this.isOn = true
	this.onModel.visible = true
	this.offModel.visible = false
	candlesOnCounter += 1
	if (candlesOnCounter == candles.length) {
		log("YOU WIN")
		creature.getKilled()

		micaTextShape.value = ""

		domeShape.withCollisions = false

		reencarnateMika()
	}
  }

  public turnOff () :void {
	this.isOn = false
	this.onModel.visible = false
	this.offModel.visible = true
	candlesOnCounter = 0
  }
}

let candlePositions: TranformConstructorArgs [] = [
	{position: new Vector3(29.86, 0.1, 34.52)},
	{position: new Vector3(33.81, 0.1, 34.58)},
	{position: new Vector3(35, 0.1, 31.14)},
	{position: new Vector3(32, 0.1, 29.12)},
	{position: new Vector3(29, 0.1, 31.05)},
]

export let candlesOnCounter: number = 0

export let candles: Candle[] = []


export function addCandles(){
	if (candles.length > 1){
		for (let i = 0 ; i < candles.length; i ++){
			engine.addEntity(candles[i])
		}
	}else {
		for (let i = 0 ; i < candlePositions.length; i ++){
			const newCandle = new Candle(
				candlePositions[i],
				new GLTFShape("models/Candle_On/Candle_02.glb"),
				new GLTFShape("models/Candle_Off/Candle_01.glb"),
				false
			)
			candles.push(newCandle)
		}
	}	
}