
const canvas = new UICanvas()

export const atlas = new Texture("textures/blood-27051.png")
let currentHandsY: number = -20
const handsPanel = new UIContainerRect(canvas)
handsPanel.isPointerBlocker = false
handsPanel.width = '100%'
handsPanel.height = '100%'
handsPanel.positionY = currentHandsY

const leftHandImage = new UIImage(handsPanel, atlas)
leftHandImage.hAlign = 'left'
leftHandImage.vAlign = 'bottom'
leftHandImage.positionX = '15%'
leftHandImage.positionY = currentHandsY
leftHandImage.sourceWidth = 95
leftHandImage.sourceHeight = 125
leftHandImage.sourceLeft = 462
leftHandImage.sourceTop = 566
leftHandImage.width = leftHandImage.sourceWidth * 4
leftHandImage.height = leftHandImage.sourceHeight * 4

const rightHandImage = new UIImage(handsPanel, atlas)
rightHandImage.hAlign = 'right'
rightHandImage.vAlign = 'bottom'
rightHandImage.positionX = '-15%'
rightHandImage.positionY = currentHandsY
rightHandImage.sourceWidth = 102
rightHandImage.sourceHeight = 130
rightHandImage.sourceLeft = 791
rightHandImage.sourceTop = 559
rightHandImage.width = rightHandImage.sourceWidth * 4
rightHandImage.height = rightHandImage.sourceHeight * 4

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

        currentHandsY += this.currentSpeed * dt * this.speedMultiplier * (Vector3.Distance(this.playerLastPos, Camera.instance.position))

        if(Math.abs(currentHandsY - this.oscillationPivot) >= this.oscillationLength / 2) {
            currentHandsY = this.oscillationPivot + (this.oscillationLength / 2) * this.speedMultiplier

            this.speedMultiplier *= -1
        }

        handsPanel.positionY = currentHandsY
        this.playerLastPos = Camera.instance.position.clone()
    }
}
engine.addSystem(new HandsMovingSystem(300, 30))

export const redView = new UIContainerRect(canvas)
redView.width = `100%`
redView.height = `100%`
redView.isPointerBlocker = false
redView.visible = false

const beingWatchedText = new UIText(redView)
beingWatchedText.value = "You feel like someone's watching you..."
beingWatchedText.color = Color4.Red()
beingWatchedText.outlineColor = Color4.Yellow()
beingWatchedText.fontSize = 45
beingWatchedText.outlineWidth = 0.1
beingWatchedText.vAlign = "top"
beingWatchedText.hAlign = "center"
beingWatchedText.vTextAlign = "center"
beingWatchedText.hTextAlign = "center"




export const pagesUI = new UIText(canvas)
pagesUI.isPointerBlocker = false
pagesUI.visible = false
pagesUI.value = "Pages:"
pagesUI.color = Color4.Red()
pagesUI.outlineColor = Color4.Yellow()
pagesUI.fontSize = 30
pagesUI.outlineWidth = 0.1
pagesUI.vAlign = "bottom"
pagesUI.hAlign = "left"
pagesUI.vTextAlign = "center"
pagesUI.hTextAlign = "center"

export const pageCounterUI = new UIText(canvas)
pageCounterUI.isPointerBlocker = false
pageCounterUI.visible = false
pageCounterUI.value = ""
pageCounterUI.color = Color4.Red()
pageCounterUI.outlineColor = Color4.Yellow()
pageCounterUI.fontSize = 30
pageCounterUI.outlineWidth = 0.1
pageCounterUI.vAlign = "bottom"
pageCounterUI.hAlign = "left"
pageCounterUI.vTextAlign = "center"
pageCounterUI.hTextAlign = "center"
pageCounterUI.positionX = 60