import { redView } from "./UI"


@Component('behavior')
export class Behavior {
  speed: number = 0.02
}

let creatures = engine.getComponentGroup(Behavior)


let camera = Camera.instance


export class FollowPlayerSystem {
	update(dt: number) {
		let playerPos = camera.position.clone()
		for (let creature of creatures.entities) {
			let creatureBehavior = creature.getComponent(Behavior)
			let creatureTransform = creature.getComponent(Transform)
			let direction = playerPos.subtract(creatureTransform.position).normalize().scale(creatureBehavior.speed)
			//log(direction)
			creatureTransform.position = creatureTransform.position.add(direction)

			const rayFromPlayer: Ray = PhysicsCast.instance.getRayFromPositions(creatureTransform.position, playerPos)

			PhysicsCast.instance.hitFirst(rayFromPlayer, (e) => {
				if (e.didHit) {
					  log("safe")
					  redView.visible = false
				} else {
					log("WATCHING YOU")
					redView.visible = true
				}
			})
		}

	}
}




