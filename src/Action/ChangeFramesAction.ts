import { ChangeAction } from "./ChangeAction"

class ChangeFramesAction extends ChangeAction {
  redoAction() {
    this.mash.changeClipFrames(this.target, this.redoValue)
  }

  undoAction() {
    this.mash.changeClipFrames(this.target, this.undoValue)
  }
}

export { ChangeFramesAction }
