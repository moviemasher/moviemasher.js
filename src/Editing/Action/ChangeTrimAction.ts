import { Audible } from "../../Mixin/Audible/Audible"
import { ChangeAction, ChangeActionObject } from "./ChangeAction"

interface ChangeTrimActionObject extends ChangeActionObject {
  frames : number
}
class ChangeTrimAction extends ChangeAction {
  constructor(object : ChangeTrimActionObject) {
    super(object)
    const { frames, target } = object
    this.frames = frames
    this.audibleClip = <Audible> target
  }
  audibleClip : Audible

  frames : number

  redoAction() : void {
    this.mash.changeClipTrimAndFrames(this.audibleClip, this.redoValueNumeric, this.frames)
  }

  undoAction() : void {
    this.mash.changeClipTrimAndFrames(this.audibleClip, this.undoValueNumeric, this.frames)
  }
}

export { ChangeTrimAction }
