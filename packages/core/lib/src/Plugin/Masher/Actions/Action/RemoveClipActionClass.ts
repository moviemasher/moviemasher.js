import type { ClientClip, ClientTrack } from '../../../../Client/Mash/MashClientTypes.js'
import type { RemoveClipActionObject } from './Action.js'

import { ActionClass } from "./ActionClass.js"

/**
 * @category Action
 */
export class RemoveClipActionClass extends ActionClass {
  constructor(object : RemoveClipActionObject) {
    super(object)
    const { clip, index, track } = object
    this.clip = clip
    this.index = index
    this.track = track
  }

  track : ClientTrack

  clip : ClientClip

  index : number

  get trackIndex() : number { return this.track.index }

  redoAction() : void {
    this.mash.removeClipFromTrack(this.clip)
  }

  undoAction() : void {
    this.mash.addClipToTrack(this.clip, this.trackIndex, this.index)
  }
}
