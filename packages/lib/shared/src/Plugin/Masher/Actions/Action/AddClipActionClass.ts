import type { AddClipActionObject } from './ActionTypes.js'
import type { ClientClips, ClientTrack } from '../../../../Client/Mash/ClientMashTypes.js'

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

  get track(): ClientTrack { return this.mash.tracks[this.trackIndex] }

  redoAction(): void {
    super.redoAction()
    const { mash, redoFrame, trackIndex, insertIndex, clips } = this
    mash.addClipToTrack(clips, trackIndex, insertIndex, redoFrame)
  }

  redoFrame?: number

  undoAction(): void {
    const { mash, clips} = this
    mash.removeClipFromTrack(clips)
    super.undoAction() 
  }
}
