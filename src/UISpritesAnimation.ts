export class AnimationSprite {
    size: Vector2
    position: Vector2

    constructor(size: Vector2, position: Vector2) {
        this.size = size
        this.position = position
    }
}

@Component('animatedUI')
export class AnimatedUIImage {
    imageComponent: UIImage
    currentIndex: number = 0
    sprites: AnimationSprite[]
    defaultSize: Vector2
    gridDimensions: Vector2
    gridPosition: Vector2
    secondsBetweenFrames: number = 0.1
    waitingTime: number = 0

    constructor(overridenSprites : AnimationSprite[] = null) {
        if(overridenSprites) {
            this.sprites = overridenSprites
        }
    }

    bakeSprites() {
        this.sprites = new Array(this.gridDimensions.x * this.gridDimensions.y)

        for (let index = 0; index < this.sprites.length; index++) {
            let spriteRow = Math.floor((this.defaultSize.x * index) / (this.gridDimensions.x * this.defaultSize.x))
            let spriteColumn = Math.floor((index / (this.gridDimensions.x * spriteRow + 1)))
            let spriteXPosition = this.gridPosition.x + this.defaultSize.x * spriteColumn
            let spriteYPosition = this.gridPosition.y + this.defaultSize.y * spriteRow

            this.sprites[index] = new AnimationSprite(this.defaultSize, new Vector2(spriteXPosition, spriteYPosition))
        }
    }
}

export class AnimatedUISystem implements ISystem {
    animations: ComponentGroup = engine.getComponentGroup(AnimatedUIImage)

    update(dt: number) {
        for (let animationEntity of this.animations.entities) {
            let animationData = animationEntity.getComponent(AnimatedUIImage)

            if(!animationData.sprites)
                animationData.bakeSprites()

            if(animationData.waitingTime > 0) {
                animationData.waitingTime -= dt

                if(animationData.waitingTime > 0)
                    continue
            }

            animationData.imageComponent.sourceWidth = animationData.sprites[animationData.currentIndex].size.x
            animationData.imageComponent.sourceHeight = animationData.sprites[animationData.currentIndex].size.y
            animationData.imageComponent.sourceLeft = animationData.sprites[animationData.currentIndex].position.x
            animationData.imageComponent.sourceTop = animationData.sprites[animationData.currentIndex].position.y
            animationData.imageComponent.width = animationData.imageComponent.sourceWidth
            animationData.imageComponent.height = animationData.imageComponent.sourceHeight

            animationData.currentIndex++;
            if(animationData.currentIndex == animationData.sprites.length)
                animationData.currentIndex = 0

            animationData.waitingTime = animationData.secondsBetweenFrames
        }
    }
}
engine.addSystem(new AnimatedUISystem())

/* const handAnimationEntity = new Entity()
const handAnimation = new AnimatedUIImage();
handAnimation.imageComponent = leftHandImage
handAnimation.gridDimensions = new Vector2(3, 6)
handAnimation.gridPosition = new Vector2(0, 0)
handAnimation.defaultSize = new Vector2(800, 480)
handAnimationEntity.addComponent(handAnimation)
engine.addEntity(handAnimationEntity) */