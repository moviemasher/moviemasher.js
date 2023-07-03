import type { Action, ActionArgs, ActionObject, ClientClip, ClientClips, ClientMashAsset, ClientTrack } from '@moviemasher/runtime-client'
import type { Propertied, Scalar, ScalarRecord } from '@moviemasher/runtime-shared'

export interface ChangeAction extends Action {
  property: string
  target: Propertied
  updateAction(object: ChangeActionObject): void
}

export interface ChangePropertyAction extends ChangeAction {
  redoValue: Scalar
  undoValue: Scalar
  updateAction(object: ChangePropertyActionObject): void
}

export interface ChangePropertiesAction extends ChangeAction {
  redoValues: ScalarRecord
  undoValues: ScalarRecord
  updateAction(object: ChangePropertiesActionObject): void
}

export interface ChangeActionObject extends ActionArgs {
  property: string
  target: Propertied
}

export interface ChangePropertyActionObject extends ChangeActionObject {
  redoValue: Scalar
  undoValue: Scalar
}

export interface ChangePropertiesActionObject extends ChangeActionObject {
  redoValues: ScalarRecord
  undoValues: ScalarRecord
}

export interface AddClipActionObject extends AddTrackActionObject {
  clips: ClientClips
  insertIndex?: number
  trackIndex: number
  redoFrame?: number
}

export interface AddTrackActionObject extends ActionArgs {
  mashAsset: ClientMashAsset
  createTracks: number
}

export interface MoveClipActionObject extends AddTrackActionObject {
  clip: ClientClip
  insertIndex: number
  redoFrame?: number
  trackIndex: number
  undoFrame?: number
  undoInsertIndex: number
  undoTrackIndex: number
}

export interface RemoveClipActionObject extends ActionArgs {
  clip: ClientClip
  index: number
  track: ClientTrack
}

export interface MoveActionObject extends ActionArgs {
  objects: any[]
  redoObjects: any[]
  undoObjects: any[]
}


