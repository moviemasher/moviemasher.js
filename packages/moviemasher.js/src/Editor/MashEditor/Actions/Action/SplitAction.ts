import { Clip, Clips } from "../../../../Mixin/Clip/Clip"
import { Action, ActionOptions } from "./Action"

interface SplitActionObject extends ActionOptions {
  index : number
  insertClip : Clip
  redoFrames : number
  splitClip : Clip
  trackClips : Clips
  undoFrames : number
}


/**
 * @category Action
 */
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

  trackClips : Clips

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

export { SplitAction, SplitActionObject }
