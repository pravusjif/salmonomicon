
const canvas = new UICanvas()

export const atlas = new Texture("textures/blood-27051.png")
let currentHandsY: number = -20
const handsPanel = new UIContainerRect(canvas)
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
        // if(this.playerLastPos.equals(Camera.instance.position)) {
        //     this.currentSpeed = this.idleSpeed

        //     if(this.currentSpeed == 0) return

        //     currentLeftHandY += this.currentSpeed * dt * this.speedMultiplier
        // } else {
            this.currentSpeed = this.oscillationSpeed

            if(this.currentSpeed == 0) return

            currentHandsY += this.currentSpeed * dt * this.speedMultiplier * (Vector3.Distance(this.playerLastPos, Camera.instance.position))
        // }

        if(Math.abs(currentHandsY - this.oscillationPivot) >= this.oscillationLength / 2) {
            currentHandsY = this.oscillationPivot + (this.oscillationLength / 2) * this.speedMultiplier

            this.speedMultiplier *= -1
        }

        // leftHandImage.positionY = currentHandsY
        // rightHandImage.positionY = currentHandsY
        handsPanel.positionY = currentHandsY
        this.playerLastPos = Camera.instance.position.clone()
    }
}
engine.addSystem(new HandsMovingSystem(300, 30))



export const redView = new UIContainerRect(canvas)
redView.width = `100%`
redView.height = `100%`
// redView.opacity = 0.1
redView.isPointerBlocker = false
// redView.color = Color4.Red()
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

@Component('animatedUI')
export class AnimatedUIImage {
    imageComponent: UIImage
    index: number = 0
    size: Vector2
    gridDimensions: Vector2
    gridPosition: Vector2
    secondsBetweenFrames: number = 0.5
    waitingTime: number = 0

    getSpritesAmount()
    {
        return this.gridDimensions.x * this.gridDimensions.y
    }
}
const handAnimationEntity = new Entity()
const handAnimation = new AnimatedUIImage()
handAnimation.imageComponent = leftHandImage
handAnimation.gridDimensions = new Vector2(4, 2)
handAnimation.gridPosition = new Vector2(25, 715)
handAnimation.size = new Vector2(102, 102)
handAnimationEntity.addComponent(handAnimation)
engine.addEntity(handAnimationEntity)

class AnimatedUISystem implements ISystem {
    animations: ComponentGroup = engine.getComponentGroup(AnimatedUIImage)

    update(dt: number) {
        for (let animationEntity of this.animations.entities) {
            let animationData = animationEntity.getComponent(AnimatedUIImage)
            if(animationData.waitingTime > 0) {
                animationData.waitingTime -= dt

                if(animationData.waitingTime > 0)
                    continue
            }

            // let spriteRow = Math.floor((animationData.gridPosition.x + (animationData.size.x * animationData.index)) / (animationData.gridDimensions.x * animationData.size.x))
            let spriteRow = Math.floor((animationData.size.x * animationData.index) / (animationData.gridDimensions.x * animationData.size.x))
            let spriteColumn = Math.floor((animationData.index / (animationData.gridDimensions.x * spriteRow + 1)))
            let spriteYPosition = animationData.gridPosition.y + animationData.size.y * spriteRow
            // let spriteXPosition = (animationData.gridPosition.x + (animationData.size.x * animationData.index)) - (animationData.size.y * spriteRow)
            let spriteXPosition = animationData.gridPosition.x + animationData.size.x * spriteColumn

            animationData.imageComponent.sourceWidth = animationData.size.x
            animationData.imageComponent.sourceHeight = animationData.size.y
            animationData.imageComponent.sourceLeft = spriteXPosition
            animationData.imageComponent.sourceTop = spriteYPosition
            animationData.imageComponent.width = animationData.imageComponent.sourceWidth * 4
            animationData.imageComponent.height = animationData.imageComponent.sourceHeight * 4

            animationData.index++;
            if(animationData.index == animationData.getSpritesAmount())
                animationData.index = 0

            animationData.waitingTime = animationData.secondsBetweenFrames
        }
    }
}
engine.addSystem(new AnimatedUISystem())