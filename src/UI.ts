
const canvas = new UICanvas()

export const atlas = new Texture("textures/blood-27051.png")
let currentLeftHandY: number = -20
const leftHandImage = new UIImage(canvas, atlas)
leftHandImage.hAlign = 'left'
leftHandImage.vAlign = 'bottom'
leftHandImage.positionX = '15%'
leftHandImage.positionY = currentLeftHandY
leftHandImage.sourceWidth = 95
leftHandImage.sourceHeight = 125
leftHandImage.sourceLeft = 462
leftHandImage.sourceTop = 566
leftHandImage.width = leftHandImage.sourceWidth * 4
leftHandImage.height = leftHandImage.sourceHeight * 4

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
        this.oscillationPivot = currentLeftHandY
        this.playerLastPos = Camera.instance.position.clone()
    }

    update(dt: number) {
        if(this.playerLastPos.equals(Camera.instance.position)) {
            this.currentSpeed = this.idleSpeed

            if(this.currentSpeed == 0) return

            currentLeftHandY += this.currentSpeed * dt * this.speedMultiplier
        }
        else {
            this.currentSpeed = this.oscillationSpeed

            if(this.currentSpeed == 0) return

            currentLeftHandY += this.currentSpeed * dt * this.speedMultiplier * (Vector3.Distance(this.playerLastPos, Camera.instance.position))
        }

        if(Math.abs(currentLeftHandY - this.oscillationPivot) >= this.oscillationLength / 2) {
            currentLeftHandY = this.oscillationPivot + (this.oscillationLength / 2) * this.speedMultiplier

            this.speedMultiplier *= -1
        }

        leftHandImage.positionY = currentLeftHandY
        this.playerLastPos = Camera.instance.position.clone()
    }
}
engine.addSystem(new HandsMovingSystem(300, 30))



export const redView = new UIContainerRect(canvas)
redView.width = `100%`
redView.height = `100%`
redView.opacity = 0.1
redView.isPointerBlocker = false
redView.color = Color4.Red()