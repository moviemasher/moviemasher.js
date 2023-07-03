import type { ClientClip, ClientMashAsset } from '@moviemasher/runtime-client'
import type { MoveClipActionObject } from './ActionTypes.js'

import { AddTrackActionClass } from './AddTrackActionClass.js'

/**
 * @category Action
 */
export class MoveClipActionClass extends AddTrackActionClass {
  constructor(object : MoveClipActionObject) {
    super(object)
    const {
      clip,
      insertIndex,
      redoFrame,
      trackIndex,
      undoFrame,
      undoInsertIndex,
      undoTrackIndex
    } = object
    this.clip = clip
    this.insertIndex = insertIndex
    this.redoFrame = redoFrame
    this.trackIndex = trackIndex
    this.undoFrame = undoFrame
    this.undoInsertIndex = undoInsertIndex
    this.undoTrackIndex = undoTrackIndex
  }

  clip: ClientClip

  insertIndex : number

  trackIndex : number

  undoTrackIndex : number

  undoInsertIndex : number

  undoFrame? : number

  redoFrame? : number
  
  private get mash(): ClientMashAsset { return this.clip.track.mash }

  addClip(trackIndex : number, insertIndex : number, frame?: number) : void {
    this.mash.addClipToTrack(this.clip, trackIndex, insertIndex, frame)
  }

  redoAction() : void {
    super.redoAction()
    this.addClip(this.trackIndex, this.insertIndex, this.redoFrame)
  }

  undoAction() : void {
    this.addClip(this.undoTrackIndex, this.undoInsertIndex, this.undoFrame)
    super.undoAction()
  }
}
