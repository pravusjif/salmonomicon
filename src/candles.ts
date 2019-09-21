import { creatureComponent, CreatureState } from "./creature";

export class Candle extends Entity {
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


    this.addComponent(
	  new OnPointerDown(e => {
		if (e.hit.length > 4 || isOn) return

		isOn = true
		onModel.visible = true
		offModel.visible = false
		candleCounter += 1
		if (candleCounter == candlePositions.length) {
			log("YOU WIN")
			creatureComponent.currentState = CreatureState.Vanished
		}
	  })
    );
  }
}

let candlePositions: TranformConstructorArgs [] = [
	{position: new Vector3(25, 1, 25)},
	{position: new Vector3(20, 1, 25)},
	{position: new Vector3(25, 1, 20)},
]

let candleCounter: number = 0



export function addCandles(){

	for (let i = 0 ; i < candlePositions.length; i ++){
		const candle1 = new Candle(
			candlePositions[i],
			new GLTFShape("models/Candles/Candle_02.glb"),
			new GLTFShape("models/Candles/Candle_01.glb"),
			false
		)
	}
}