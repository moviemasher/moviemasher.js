import { Audible } from "../../Mash/Mixin/Audible/Audible"
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
    this.mash.changeClipTrimAndFrames(this.audibleClip, <number> this.redoValue, this.frames)
  }

  undoAction() : void {
    this.mash.changeClipTrimAndFrames(this.audibleClip, <number> this.undoValue, this.frames)
  }
}

export { ChangeTrimAction }