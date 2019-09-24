import { leftHandImage, atlas2, atlas } from "./UI";

export function grabMicasHead() {
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