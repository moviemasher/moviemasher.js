import { VisibleClip } from "../../../Media/VisibleClip/VisibleClip"
import { ChangeAction, ChangeActionObject } from "./ChangeAction"

export interface ChangeTrimActionObject extends ChangeActionObject {
  frames : number
}

/**
 * @category Action
 */
export class ChangeTrimAction extends ChangeAction {
  constructor(object : ChangeTrimActionObject) {
    super(object)
    const { frames, target } = object
    this.frames = frames
    this.clip = target as VisibleClip
  }
  clip: VisibleClip

  frames : number

  redoAction() : void {
    this.mash.changeClipTrimAndFrames(this.clip, this.redoValueNumeric, this.frames)
  }

  undoAction() : void {
    this.mash.changeClipTrimAndFrames(this.clip, this.undoValueNumeric, this.frames)
  }
}
