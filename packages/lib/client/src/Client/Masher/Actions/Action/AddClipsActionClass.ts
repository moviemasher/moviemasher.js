import type { AddClipsActionObject, ClientClips, ClientTrack } from '@moviemasher/runtime-client'

import { EventChangeClipId, MovieMasher } from '@moviemasher/runtime-client'
import { AddTrackActionClass } from './AddTrackActionClass.js'

/**
 * @category Action
 */
export class AddClipsActionClass extends AddTrackActionClass {
  constructor(object: AddClipsActionObject) {
    super(object)
    const { clips, insertIndex, trackIndex, redoFrame } = object
    this.clips = clips
    this.insertIndex = insertIndex
    this.trackIndex = trackIndex
    this.redoFrame = redoFrame
  }

  clips: ClientClips

  insertIndex?: number

  override redoAction(): void {
    super.redoAction()
    const { mashAsset, redoFrame, trackIndex, insertIndex, clips } = this
    mashAsset.addClipToTrack(clips, trackIndex, insertIndex, redoFrame)
  }

  redoFrame?: number

  get track(): ClientTrack { return this.mashAsset.tracks[this.trackIndex] }

  trackIndex: number

  override undoAction(): void {
    const { mashAsset, clips} = this
    mashAsset.removeClipFromTrack(clips)
    super.undoAction() 
  }

  override updateSelection(): void {
    const { done } = this
    const id = done ? this.clips[0].id : undefined
    // console.debug(this.constructor.name, 'updateSelection', id)
    MovieMasher.eventDispatcher.dispatch(new EventChangeClipId(id))
  }
}
