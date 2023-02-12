import { Clips } from "../../../Media/Mash/Track/Clip/Clip"
import { Track } from "../../../Media/Mash/Track/Track"
import { AddTrackAction, AddTrackActionObject } from "./AddTrackAction"

export interface AddClipToTrackActionObject extends AddTrackActionObject {
  clips: Clips
  insertIndex: number
  trackIndex: number
  redoFrame?: number
  undoFrame: number
}

/**
 * @category Action
 */
export class AddClipToTrackAction extends AddTrackAction {
  constructor(object: AddClipToTrackActionObject) {
    super(object)
    const { 
      clips, insertIndex, trackIndex, redoFrame, undoFrame 
    } = object
    this.clips = clips
    this.insertIndex = insertIndex
    this.trackIndex = trackIndex
    this.redoFrame = redoFrame
    this.undoFrame = undoFrame
  }

  clips: Clips


  insertIndex: number

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

  undoFrame: number
}
