import { Clip, Clips } from "../../../Mixin/Clip/Clip"
import { Action, ActionOptions } from "./Action"

export interface FreezeActionObject extends ActionOptions {
  frames : number
  freezeClip : Clip
  frozenClip : Clip
  index : number
  insertClip : Clip
  trackClips : Clips
}

/**
 * @category Action
 */
export class FreezeAction extends Action {
  constructor(object : FreezeActionObject) {
    super(object)
    const { frames,freezeClip, frozenClip, index, insertClip, trackClips } = object
    this.frames = frames
    this.freezeClip = freezeClip
    this.frozenClip = frozenClip
    this.index = index
    this.insertClip = insertClip
    this.trackClips = trackClips
  }

  frames : number

  freezeClip : Clip

  frozenClip : Clip

  index : number

  insertClip : Clip

  redoAction() : void {
    this.trackClips.splice(this.index, 0, this.insertClip, this.frozenClip)
    this.freezeClip.frames -= this.frames
  }

  trackClips : Clips

  undoAction() : void {
    this.freezeClip.frames += this.frames
    this.trackClips.splice(this.index, 2)
  }
}
