import type { Clips } from '../../../../Media/Mash/Track/Clip/Clip.js'
import type { Track } from '../../../../Media/Mash/Track/Track.js'
import type { AddClipActionObject } from './Action.js'

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

  clips: Clips


  insertIndex?: number

  trackIndex: number

  get track(): Track { return this.mash.tracks[this.trackIndex] }

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
