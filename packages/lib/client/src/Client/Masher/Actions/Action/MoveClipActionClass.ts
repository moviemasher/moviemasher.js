import type { ClientClip, MoveClipActionObject } from '@moviemasher/runtime-client'
import type { PropertyIds } from '@moviemasher/runtime-shared'

import { DOT } from '@moviemasher/lib-shared'
import { EventChangeClipId, EventChangedScalars, MovieMasher } from '@moviemasher/runtime-client'
import { TypeClip } from '@moviemasher/runtime-shared'
import { AddTrackActionClass } from './AddTrackActionClass.js'

/**
 * @category Action
 */
export class MoveClipActionClass extends AddTrackActionClass {
  constructor(object: MoveClipActionObject) {
    super(object)
    const {
      clip,
      insertIndex,
      redoFrame,
      trackIndex,
      undoFrame,
      undoInsertIndex,
      undoTrackIndex
    } = object
    this.clip = clip
    this.insertIndex = insertIndex
    this.redoFrame = redoFrame
    this.trackIndex = trackIndex
    this.undoFrame = undoFrame
    this.undoInsertIndex = undoInsertIndex
    this.undoTrackIndex = undoTrackIndex
  }

  override get affects(): PropertyIds { return [`${TypeClip}${DOT}frame`] }
  
  clip: ClientClip

  insertIndex?: number

  trackIndex: number

  undoTrackIndex: number

  undoInsertIndex?: number

  undoFrame?: number

  redoFrame?: number
  
  addClip(trackIndex: number, insertIndex?: number, frame?: number): void {
    this.mashAsset.addClipToTrack(this.clip, trackIndex, insertIndex, frame)
  }

  override redoAction(): void {
    super.redoAction()
    this.addClip(this.trackIndex, this.insertIndex, this.redoFrame)
  }

  override undoAction(): void {
    this.addClip(this.undoTrackIndex, this.undoInsertIndex, this.undoFrame)
    super.undoAction()
  }

  override updateSelection(): void {
    MovieMasher.eventDispatcher.dispatch(new EventChangeClipId(this.clip.id ))
    MovieMasher.eventDispatcher.dispatch(new EventChangedScalars(this.affects))
  }
}
