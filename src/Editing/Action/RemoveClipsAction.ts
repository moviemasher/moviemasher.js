import { Track } from "../../Mash"
import { Clip } from "../../Mash/Mixin/Clip/Clip"
import { Action, ActionObject } from "./Action"

interface RemoveClipsActionObject extends ActionObject {
  clips : Clip[]
  index : number
  track : Track
}
class RemoveClipsAction extends Action {
  constructor(object : RemoveClipsActionObject) {
    super(object)
    const { clips, index, track } = object
    this.clips = clips
    this.index = index
    this.track = track
  }

  track : Track

  clips : Clip[]

  index : number

  get trackIndex() : number { return this.track.index }

  redoAction() : void {
    this.mash.removeClipsFromTrack(this.clips)
  }

  undoAction() : void {
    this.mash.addClipsToTrack(this.clips, this.trackIndex, this.index)
  }
}

export { RemoveClipsAction }
