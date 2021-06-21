import { Clip } from "../../Mash/Mixin/Clip/Clip"
import { ChangeAction, ChangeActionObject } from "./ChangeAction"

class ChangeFramesAction extends ChangeAction {
  constructor(object : ChangeActionObject) {
    super(object)
    this.clip = <Clip> this.target
  }

  clip : Clip

  redoAction() : void {
    this.mash.changeClipFrames(this.clip, <number> this.redoValue)
  }

  undoAction() : void {
    this.mash.changeClipFrames(this.clip, <number> this.undoValue)
  }
}

export { ChangeFramesAction }
