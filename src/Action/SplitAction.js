import { Action } from "./Action";

class SplitAction extends Action {
  redoAction() {
    this.trackClips.splice(this.index, 0, this.insertClip)
    this.splitClip.frames = this.redoFrames
  }

  undoAction() {
    this.splitClip.frames = this.undoFrames
    this.trackClips.splice(this.index, 1)
  }
}

export { SplitAction }