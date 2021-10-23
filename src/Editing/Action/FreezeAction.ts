import { Clip } from "../../Mash/Mixin/Clip/Clip"
import { Action, ActionObject } from "./Action"

interface FreezeActionObject extends ActionObject {
  frames : number
  freezeClip : Clip
  frozenClip : Clip
  index : number
  insertClip : Clip
  trackClips : Clip[]
}

class FreezeAction extends Action {
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

  index : number

  trackClips : Clip[]

  insertClip : Clip

  freezeClip : Clip

  frozenClip : Clip

  redoAction() : void {
    this.trackClips.splice(this.index, 0, this.insertClip, this.frozenClip)
    this.freezeClip.frames -= this.frames
  }

  undoAction() : void {
    this.freezeClip.frames += this.frames
    this.trackClips.splice(this.index, 2)
  }
}

export { FreezeAction }