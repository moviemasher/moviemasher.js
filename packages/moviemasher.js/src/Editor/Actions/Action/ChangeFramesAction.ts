import { Clip, Clips } from "../../../Edited/Mash/Track/Clip/Clip"
import { ChangeAction, ChangeActionObject } from "./ChangeAction"

/**
 * @category Action
 */
export class ChangeFramesAction extends ChangeAction {
  constructor(object : ChangeActionObject) {
    super(object)
    this.clip = <Clip> this.target
  }

  clip : Clip

  redoAction() : void {
    this.mash.changeClipFrames(this.clip, this.redoValueNumeric)
  }

  undoAction() : void {
    this.mash.changeClipFrames(this.clip, this.undoValueNumeric)
  }
}
