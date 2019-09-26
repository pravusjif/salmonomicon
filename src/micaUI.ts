import { leftHandImage, atlas2, atlas } from "./UI";
import { MicaComponent, MicaState } from "./mica";
import { neededPages, Page } from "./book";

export function enableMicasHeadOnHand() {
    leftHandImage.source = atlas2
    leftHandImage.hAlign = 'left'
    leftHandImage.vAlign = 'bottom'
    leftHandImage.positionX = '5%'
    leftHandImage.sourceWidth = 850
    leftHandImage.sourceHeight = 850
    leftHandImage.sourceLeft = 0
    leftHandImage.sourceTop = 0
    leftHandImage.width = leftHandImage.sourceWidth / 1.5
    leftHandImage.height = leftHandImage.sourceHeight / 1.5
}

export function releaseLeftHand() {
    leftHandImage.source = atlas
    leftHandImage.hAlign = 'left'
    leftHandImage.vAlign = 'bottom'
    leftHandImage.positionX = '15%'
    leftHandImage.sourceWidth = 95
    leftHandImage.sourceHeight = 125
    leftHandImage.sourceLeft = 462
    leftHandImage.sourceTop = 566
    leftHandImage.width = leftHandImage.sourceWidth * 3
    leftHandImage.height = leftHandImage.sourceHeight * 3
}

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