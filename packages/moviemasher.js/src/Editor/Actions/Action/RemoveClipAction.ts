import { Track } from "../../../Edited/Mash/Track/Track"
import { Clip, Clips } from "../../../Edited/Mash/Track/Clip/Clip"
import { Action, ActionOptions } from "./Action"

export interface RemoveClipActionObject extends ActionOptions {
  clip : Clip
  index : number
  track : Track
}

/**
 * @category Action
 */
export class RemoveClipAction extends Action {
  constructor(object : RemoveClipActionObject) {
    super(object)
    const { clip, index, track } = object
    this.clip = clip
    this.index = index
    this.track = track
  }

  track : Track

  clip : Clip

  index : number

  get trackIndex() : number { return this.track.index }

  redoAction() : void {
    this.mash.removeClipFromTrack(this.clip)
  }

  undoAction() : void {
    this.mash.addClipToTrack(this.clip, this.trackIndex, this.index)
  }
}
