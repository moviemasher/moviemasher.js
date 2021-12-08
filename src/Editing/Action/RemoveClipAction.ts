import { Track } from "../../Mash"
import { Clip } from "../../Mixin/Clip/Clip"
import { Action, ActionObject } from "./Action"

interface RemoveClipActionObject extends ActionObject {
  clip : Clip
  index : number
  track : Track
}
class RemoveClipAction extends Action {
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

  get trackIndex() : number { return this.track.layer }

  redoAction() : void {
    this.mash.removeClipFromTrack(this.clip)
  }

  undoAction() : void {
    this.mash.addClipToTrack(this.clip, this.trackIndex, this.index)
  }
}

export { RemoveClipAction }
