import { ChangeAction } from "./ChangeAction"

class ChangeTrimAction extends ChangeAction {
  redoAction() {
    this.mash.changeClipTrim(this.target, this.redoValue, this.frames + this.undoValue)
  }

  undoAction() {
    this.mash.changeClipTrim(this.target, this.undoValue, this.frames + this.undoValue)
  }
}

export { ChangeTrimAction }
