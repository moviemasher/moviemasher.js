import type { ClientClip, ClientMashAsset, ClientTrack } from '@moviemasher/runtime-client'
import type { RemoveClipActionObject } from './ActionTypes.js'

import { ActionClass } from "./ActionClass.js"

/**
 * @category Action
 */
export class RemoveClipActionClass extends ActionClass {
  constructor(object: RemoveClipActionObject) {
    super(object)
    const { clip, index, track } = object
    this.clip = clip
    this.index = index
    this.track = track
  }

  track: ClientTrack

  clip: ClientClip

  index: number

  private get mash(): ClientMashAsset { return this.clip.track.mash }

  get trackIndex(): number { return this.track.index }

  redoAction(): void {
    this.mash.removeClipFromTrack(this.clip)
  }

  undoAction(): void {
    this.mash.addClipToTrack(this.clip, this.trackIndex, this.index)
  }
}
