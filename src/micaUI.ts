import { leftHandImage, canvas, playerWatchedUIWrapper, pageCounterUI} from "./UI";
import { MicaComponent} from "./mica";
import { neededPages, Page } from "./book";
import { AnimatedUIImage, AnimationSprite, animatedUISystem } from "./UISpritesAnimation";

const micaTalkingAnimationEntity = new Entity()
const micaTalkingAnimation = new AnimatedUIImage();
micaTalkingAnimation.imageComponent = leftHandImage
micaTalkingAnimation.secondsBetweenFrames = 0.3
micaTalkingAnimation.defaultSize = new Vector2(425, 425)
micaTalkingAnimation.updateUIImageSize = false
micaTalkingAnimation.sprites = [
    new AnimationSprite(micaTalkingAnimation.defaultSize, new Vector2(0,0)),
    new AnimationSprite(micaTalkingAnimation.defaultSize, new Vector2(micaTalkingAnimation.defaultSize.x, 3 * micaTalkingAnimation.defaultSize.y)),
    new AnimationSprite(micaTalkingAnimation.defaultSize, new Vector2(2 * micaTalkingAnimation.defaultSize.x, 3 * micaTalkingAnimation.defaultSize.y))
]
engine.addEntity(micaTalkingAnimationEntity)

export function enableMicasHeadOnHand() {
    leftHandImage.width = leftHandImage.sourceWidth * 1.4
    leftHandImage.height = leftHandImage.sourceHeight * 1.4
    micaTalkingAnimationEntity.addComponent(micaTalkingAnimation)

    pageCounterUI.visible = true

    animatedUISystem.enabled = true
}

export function releaseLeftHand() {
    leftHandImage.hAlign = 'left'
    leftHandImage.vAlign = 'bottom'
    leftHandImage.positionX = '10%'
    leftHandImage.sourceWidth = 425
    leftHandImage.sourceHeight = 425
    leftHandImage.sourceLeft = 0
    leftHandImage.sourceTop = 4 * leftHandImage.sourceWidth
    leftHandImage.width = leftHandImage.sourceWidth * 1.6
    leftHandImage.height = leftHandImage.sourceHeight * 1.6
}

export let radarMicaDialogueUIText = new UIText(canvas)
radarMicaDialogueUIText.color = Color4.Red()
radarMicaDialogueUIText.outlineColor = Color4.Yellow()
radarMicaDialogueUIText.fontSize = 40
radarMicaDialogueUIText.outlineWidth = 0.1
radarMicaDialogueUIText.vAlign = "top"
radarMicaDialogueUIText.hAlign = "center"
radarMicaDialogueUIText.vTextAlign = "center"
radarMicaDialogueUIText.hTextAlign = "center"

enum MikaRadarDirection {
    N,
    NE,
    E,
    SE,
    S,
    SW,
    W,
    NW,
    NONE
}

let camera = Camera.instance
export class RadarMicaSystem implements ISystem {
    enabled: boolean = false
    micaComponent: MicaComponent
    currentDirection: MikaRadarDirection = MikaRadarDirection.NONE

    constructor(micaComponent: MicaComponent) {
        this.micaComponent = micaComponent
        this.currentDirection = MikaRadarDirection.NONE
    }

    update(dt: number) {
        if(!this.enabled || this.micaComponent.getCurrentState() != 2) return // if we import anything from ./mica, the script can't be compiled, i think it has to do with circular references
        
        if(playerWatchedUIWrapper.visible){
            leftHandImage.sourceLeft = 0
            leftHandImage.sourceTop = 3 * leftHandImage.sourceHeight

            this.currentDirection = MikaRadarDirection.NONE

            return
        }

        let cameraForward = PhysicsCast.instance.getRayFromCamera(1).direction
        let playerPos = camera.position.clone()
        playerPos.y = 0

        let closestPagePosition : Vector3
        let closestPageDistance = 9999
        for (let index = 0; index < neededPages.length; index++) {
            const currentPage = neededPages[index] as Page

            if(currentPage.isPicked) continue
            
            let distanceToPlayer = Vector3.Distance(currentPage.transform.position, camera.position)
            if(distanceToPlayer < closestPageDistance || index == 0) {
                closestPagePosition = currentPage.transform.position.clone()
                closestPageDistance = distanceToPlayer
            }
        }

        if(closestPageDistance == 9999){ // no avaiable page found
            leftHandImage.sourceLeft = 0
            leftHandImage.sourceTop = 0

            return
        }

        let deltaVector = playerPos.subtract(closestPagePosition)
        deltaVector.y = 0
        
        let angle = Vector3.GetAngleBetweenVectors(new Vector3(cameraForward.x, 0, cameraForward.z), deltaVector , Vector3.Up())
        // log(angle)
        
        if(Math.abs(angle) >= 3){
            if(this.currentDirection == MikaRadarDirection.N) return

            leftHandImage.sourceLeft = 2 * leftHandImage.sourceWidth
            leftHandImage.sourceTop = 0 * leftHandImage.sourceHeight

            this.currentDirection = MikaRadarDirection.N
            
        }
        else if(Math.abs(angle) <= 0.2){
            if(this.currentDirection == MikaRadarDirection.S) return

            leftHandImage.sourceLeft = leftHandImage.sourceWidth
            leftHandImage.sourceTop = leftHandImage.sourceHeight

            this.currentDirection = MikaRadarDirection.S
        }
        else {
            if(angle > 0){
                if(angle > 2) {
                    if(this.currentDirection == MikaRadarDirection.NE) return

                    leftHandImage.sourceLeft = 0
                    leftHandImage.sourceTop = 2 * leftHandImage.sourceHeight

                    this.currentDirection = MikaRadarDirection.NE
                } else if(angle > 1) {
                    if(this.currentDirection == MikaRadarDirection.E) return

                    leftHandImage.sourceLeft = 0
                    leftHandImage.sourceTop = leftHandImage.sourceHeight

                    this.currentDirection = MikaRadarDirection.E
                } else if(angle > 0) {
                    if(this.currentDirection == MikaRadarDirection.SE) return

                    leftHandImage.sourceLeft = 2 * leftHandImage.sourceWidth
                    leftHandImage.sourceTop = 2 * leftHandImage.sourceHeight

                    this.currentDirection = MikaRadarDirection.SE
                }
            } else {
                if(angle < -2) {
                    if(this.currentDirection == MikaRadarDirection.NW) return

                    leftHandImage.sourceLeft = 2 * leftHandImage.sourceWidth
                    leftHandImage.sourceTop = leftHandImage.sourceHeight

                    this.currentDirection = MikaRadarDirection.NW
                } else if(angle < -1) {
                    if(this.currentDirection == MikaRadarDirection.W) return

                    leftHandImage.sourceLeft = leftHandImage.sourceWidth
                    leftHandImage.sourceTop = 0

                    this.currentDirection = MikaRadarDirection.W
                } else if(angle < 0) {
                    if(this.currentDirection == MikaRadarDirection.SW) return

                    leftHandImage.sourceLeft = leftHandImage.sourceWidth
                    leftHandImage.sourceTop = 2 * leftHandImage.sourceHeight

                    this.currentDirection = MikaRadarDirection.SW
                }
            }
        }
    }
}