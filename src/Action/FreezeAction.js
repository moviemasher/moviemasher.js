import { Action } from "./Action";

class FreezeAction extends Action {
  redoAction() {
    this.trackClips.splice(this.index, 0, this.insertClip, this.frozenClip)
    this.freezeClip.frames -= this.frames
  }

  undoAction() {
    this.freezeClip.frames += this.frames
    this.trackClips.splice(this.index, 2)
  }
}

export { FreezeAction }
