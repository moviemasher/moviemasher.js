import { Clip } from "../../Mash/Mixin/Clip/Clip"
import { Action, ActionObject } from "./Action"

interface SplitActionObject extends ActionObject {
  index : number
  insertClip : Clip
  redoFrames : number
  splitClip : Clip
  trackClips : Clip[]
  undoFrames : number
}

class SplitAction extends Action {
  constructor(object : SplitActionObject) {
    super(object)
    const { index, insertClip, redoFrames, splitClip, trackClips, undoFrames } = object
    this.index = index
    this.insertClip = insertClip
    this.redoFrames = redoFrames
    this.splitClip = splitClip
    this.trackClips = trackClips
    this.undoFrames = undoFrames
  }

  index : number

  insertClip : Clip

  redoFrames : number

  splitClip : Clip

  trackClips : Clip[]

  undoFrames : number

  redoAction() : void {
    this.trackClips.splice(this.index, 0, this.insertClip)
    this.splitClip.frames = this.redoFrames
  }

  undoAction() : void {
    this.splitClip.frames = this.undoFrames
    this.trackClips.splice(this.index, 1)
  }
}

export { SplitAction }
