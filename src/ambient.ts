import utils from "../node_modules/decentraland-ecs-utils/index"

export class AmbientSound extends Entity {
	source: AudioSource
	clip: AudioClip
	constructor(
	  transform: TranformConstructorArgs,
	  sound: string,
	  interval: number = 0,
	  isPlaying: boolean = false

	) {
	  super()
	  this.clip = new AudioClip(sound)
	  this.source = new AudioSource(this.clip)
	  this.addComponent(this.source)
	  this.addComponent(new Transform(transform))
	  engine.addEntity(this)

	  if (interval > 1){
		this.source.loop = false
		  this.addComponent(new utils.Interval(
			  interval,
			  ()=> {
					this.source.playOnce()
			  }
		   ))
	  } else if (isPlaying){
		  this.source.loop = true
		  this.source.playing = true
	  }
	}

	public play(): void {
		this.source.playOnce()
	}
	public stop(): void {
		this.source.playing = false
	}
}