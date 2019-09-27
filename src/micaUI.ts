import { leftHandImage, canvas} from "./UI";
import { MicaComponent} from "./mica";
import { neededPages, Page } from "./book";

export function enableMicasHeadOnHand() {
    leftHandImage.hAlign = 'left'
    leftHandImage.vAlign = 'bottom'
    leftHandImage.positionX = '5%'
    leftHandImage.sourceWidth = 425
    leftHandImage.sourceHeight = 425
    leftHandImage.sourceLeft = 0
    leftHandImage.sourceTop = 0
    leftHandImage.width = leftHandImage.sourceWidth * 1.4
    leftHandImage.height = leftHandImage.sourceHeight * 1.4
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
radarMicaDialogueUIText.hAlign = 'center'
radarMicaDialogueUIText.vAlign = 'bottom'
radarMicaDialogueUIText.positionY = '10%'
radarMicaDialogueUIText.fontSize = 23
radarMicaDialogueUIText.color = Color4.Yellow()
radarMicaDialogueUIText.hTextAlign = 'center'

let camera = Camera.instance
export class RadarMicaSystem implements ISystem {
    micaComponent: MicaComponent

    constructor(micaComponent: MicaComponent) {
        this.micaComponent = micaComponent
    }

    update(dt: number) {
        if(this.micaComponent.getCurrentState() != 2) return // if we import anything from ./mica, the script can't be compiled, i think it has to do with circular references
        
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

        if(closestPageDistance == 9999){
            leftHandImage.sourceLeft = 0
            leftHandImage.sourceTop = 0

            return
        }

        let deltaVector = playerPos.subtract(closestPagePosition)
        deltaVector.y = 0
        
        let angle = Vector3.GetAngleBetweenVectors(new Vector3(cameraForward.x, 0, cameraForward.z), deltaVector , Vector3.Up())
        // log(angle)
        
        if(Math.abs(angle) >= 3){
            // N
            leftHandImage.sourceLeft = 2 * leftHandImage.sourceWidth
            leftHandImage.sourceTop = 0 * leftHandImage.sourceHeight
            
        }
        else if(Math.abs(angle) <= 0.2){
            // S
            leftHandImage.sourceLeft = leftHandImage.sourceWidth
            leftHandImage.sourceTop = leftHandImage.sourceHeight
        }
        else {
            if(angle > 0){
                if(angle > 2) {
                    // NE
                    leftHandImage.sourceLeft = 0
                    leftHandImage.sourceTop = 2 * leftHandImage.sourceHeight
                } else if(angle > 1) {
                    // E
                    leftHandImage.sourceLeft = 0
                    leftHandImage.sourceTop = leftHandImage.sourceHeight
                } else if(angle > 0) {
                    // SE
                    leftHandImage.sourceLeft = 2 * leftHandImage.sourceWidth
                    leftHandImage.sourceTop = 2 * leftHandImage.sourceHeight
                }
            } else {
                if(angle < -2) {
                    // NW
                    leftHandImage.sourceLeft = 2 * leftHandImage.sourceWidth
                    leftHandImage.sourceTop = leftHandImage.sourceHeight
                } else if(angle < -1) {
                    // W
                    leftHandImage.sourceLeft = leftHandImage.sourceWidth
                    leftHandImage.sourceTop = 0
                } else if(angle < 0) {
                    // SW
                    leftHandImage.sourceLeft = leftHandImage.sourceWidth
                    leftHandImage.sourceTop = 2 * leftHandImage.sourceHeight
                }
            }
        }
    }
}