import type { AddClipActionObject } from './ActionTypes.js'
import type { ClientClips, ClientMashAsset, ClientTrack } from '@moviemasher/runtime-client'

import { AddTrackActionClass } from './AddTrackActionClass.js'

/**
 * @category Action
 */
export class AddClipActionClass extends AddTrackActionClass {
  constructor(object: AddClipActionObject) {
    super(object)
    const { 
      clips, insertIndex, trackIndex, redoFrame 
    } = object
    this.clips = clips
    this.insertIndex = insertIndex
    this.trackIndex = trackIndex
    this.redoFrame = redoFrame
  }

  clips: ClientClips

  insertIndex?: number

  trackIndex: number

  get track(): ClientTrack { return this.mashAsset.tracks[this.trackIndex] }

  redoAction(): void {
    super.redoAction()
    const { mashAsset, redoFrame, trackIndex, insertIndex, clips } = this
    mashAsset.addClipToTrack(clips, trackIndex, insertIndex, redoFrame)
  }

  redoFrame?: number

  undoAction(): void {
    const { mashAsset, clips} = this
    mashAsset.removeClipFromTrack(clips)
    super.undoAction() 
  }
}
