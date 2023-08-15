import type { ClientClip, ClientMashAsset, ClientTrack, RemoveClipActionObject } from '@moviemasher/runtime-client'

import { EventChangeClipId, MovieMasher } from '@moviemasher/runtime-client'
import { ActionClass } from './ActionClass.js'

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

  clip: ClientClip

  index: number

  private get mash(): ClientMashAsset { return this.track.mash }

  get trackIndex(): number { return this.track.index }

  override redoAction(): void {
    this.mash.removeClipFromTrack(this.clip)
  }

  track: ClientTrack

  override undoAction(): void {
    this.mash.addClipToTrack(this.clip, this.trackIndex, this.index)
  }

  override updateSelection(): void {
    const { done } = this
    const id = done ? undefined : this.clip.id 
    MovieMasher.eventDispatcher.dispatch(new EventChangeClipId(id))
  }
}
