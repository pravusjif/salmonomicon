import { creature, CreatureState, trapPlace } from "./creature";

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
    this.addComponent(new Transform(transform));
	engine.addEntity(this);
	
	//this.onModel = onModel;
    const onEntity = new Entity()
    onEntity.addComponent(onModel)
    onEntity.setParent(this)

	onModel.visible = false;
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
		creature.laserOff()
		creature.currentState = CreatureState.Vanished
		trapPlace.getComponent(AudioSource).playOnce()
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
	{position: new Vector3(25, 1, 25)},
	{position: new Vector3(20, 1, 25)},
	{position: new Vector3(25, 1, 20)},
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