import decentralandEcsUtils from "../node_modules/decentraland-ecs-utils/index"

export const canvas = new UICanvas()

export let atlas = new Texture("textures/HeadSprites.png")
let currentHandsY: number = -20
const handsPanel = new UIContainerRect(canvas)
handsPanel.isPointerBlocker = false
handsPanel.width = '100%'
handsPanel.height = '100%'
handsPanel.positionY = currentHandsY

export let leftHandImage = new UIImage(handsPanel, atlas)
leftHandImage.hAlign = 'left'
leftHandImage.vAlign = 'bottom'
leftHandImage.positionX = '10%'
leftHandImage.positionY = currentHandsY - 10
leftHandImage.sourceWidth = 425
leftHandImage.sourceHeight = 425
leftHandImage.sourceLeft = 0
leftHandImage.sourceTop = 4 * leftHandImage.sourceWidth
leftHandImage.width = leftHandImage.sourceWidth * 1.6
leftHandImage.height = leftHandImage.sourceHeight * 1.6

const rightHandImage = new UIImage(handsPanel, atlas)
rightHandImage.hAlign = 'right'
rightHandImage.vAlign = 'bottom'
rightHandImage.positionY = currentHandsY
rightHandImage.sourceWidth = 425
rightHandImage.sourceHeight = 425
rightHandImage.sourceLeft = 2 * rightHandImage.sourceWidth
rightHandImage.sourceTop = 4 * rightHandImage.sourceHeight
rightHandImage.width = rightHandImage.sourceWidth * 1.6
rightHandImage.height = rightHandImage.sourceHeight * 1.6

class HandsMovingSystem implements ISystem {
    oscillationSpeed: number
    oscillationLength: number
    oscillationPivot: number

    speedMultiplier: number
    idleSpeed: number
    currentSpeed: number
    playerLastPos: Vector3

    constructor(speed: number, length: number) {
        this.oscillationSpeed = speed
        this.oscillationLength = length

        this.speedMultiplier = 1
        this.idleSpeed = 15
        this.currentSpeed = 0
        this.oscillationPivot = currentHandsY
        this.playerLastPos = Camera.instance.position.clone()
    }

    update(dt: number) {
        this.currentSpeed = this.oscillationSpeed

        if(this.currentSpeed == 0) return

        let deltaMovement = this.currentSpeed * dt * this.speedMultiplier * (Vector3.Distance(this.playerLastPos, Camera.instance.position))
        
        if(deltaMovement == 0) return
        currentHandsY += deltaMovement

        if(Math.abs(currentHandsY - this.oscillationPivot) >= this.oscillationLength / 2) {
            currentHandsY = this.oscillationPivot + (this.oscillationLength / 2) * this.speedMultiplier

            this.speedMultiplier *= -1
        }

        handsPanel.positionY = currentHandsY
        this.playerLastPos = Camera.instance.position.clone()
    }
}
engine.addSystem(new HandsMovingSystem(300, 30))

export let playerWatchedUIWrapper = new UIContainerRect(canvas)
playerWatchedUIWrapper.width = `100%`
playerWatchedUIWrapper.height = `100%`
playerWatchedUIWrapper.isPointerBlocker = false
playerWatchedUIWrapper.visible = false

export let redView = new UIContainerRect(canvas)
redView.width = `100%`
redView.height = `100%`
redView.isPointerBlocker = false
redView.visible = false
redView.color = new Color4(0.8, 0, 0, 0.5)

let beingWatchedText = new UIText(playerWatchedUIWrapper)
beingWatchedText.value = "It's watching you!"
beingWatchedText.color = Color4.Red()
beingWatchedText.outlineColor = Color4.Yellow()
beingWatchedText.fontSize = 40
beingWatchedText.outlineWidth = 0.1
beingWatchedText.vAlign = "top"
beingWatchedText.hAlign = "center"
beingWatchedText.vTextAlign = "center"
beingWatchedText.hTextAlign = "center"

export const pageCounterUI = new UIText(canvas)
pageCounterUI.isPointerBlocker = false
pageCounterUI.visible = false
pageCounterUI.value = "Pages 0/5"
pageCounterUI.color = Color4.Red()
pageCounterUI.outlineColor = Color4.Yellow()
pageCounterUI.fontSize = 30
pageCounterUI.outlineWidth = 0.1
pageCounterUI.vAlign = "bottom"
pageCounterUI.hAlign = "center"
pageCounterUI.vTextAlign = "center"
pageCounterUI.hTextAlign = "center"

export function dieScreen(){

redView.visible = true
let dummyEnt = new Entity()
engine.addEntity(dummyEnt)
dummyEnt.addComponent(new decentralandEcsUtils.Delay(2000,
	() => {
		redView.visible = false
	}
))

}