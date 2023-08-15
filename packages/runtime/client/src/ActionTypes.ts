import type { Propertied, PropertyId, PropertyIds, Scalar, ScalarsById, Typed } from '@moviemasher/runtime-shared'

import type { ClientClip, ClientClips, ClientMashAsset, ClientTrack } from './ClientMashTypes.js'

export interface Actions {
  canRedo: boolean
  canSave: boolean
  canUndo: boolean
  create(object: ActionObject): void
  instances: Action[]
  redo(): Action
  save(): void
  undo(): Action
}

export interface Action {
  redo(): void
  undo(): void
  updateSelection(): void
  affects: PropertyIds
}

export interface ActionObject extends Typed {}

export interface ActionArgs extends ActionObject {}

export interface ChangeAction extends Action {
  target: Propertied
  updateAction(object: ChangeActionObject): void
}

export interface ChangePropertyAction extends ChangeAction {
  property: PropertyId
  value?: Scalar
  valueNumber?: number
  updateAction(object: ChangePropertyActionObject): void
}

export interface ChangePropertiesAction extends ChangeAction {
  redoValues: ScalarsById
  undoValues: ScalarsById
  updateAction(object: ChangePropertiesActionObject): void
}

export interface AddClipsActionObject extends AddTrackActionObject {
  clips: ClientClips
  insertIndex?: number
  trackIndex: number
  redoFrame?: number
}

export interface AddTrackActionObject extends ActionArgs {
  mashAsset: ClientMashAsset
  createTracks: number
}

export interface ChangeActionObject extends ActionArgs {
  target: Propertied
}

export interface ChangePropertyActionObject extends ChangeActionObject {
  property: PropertyId
  redoValue?: Scalar
  undoValue?: Scalar
}

export interface ChangePropertiesActionObject extends ChangeActionObject {
  redoValues: ScalarsById
  undoValues: ScalarsById
}

export interface MoveClipActionObject extends AddTrackActionObject {
  clip: ClientClip
  insertIndex?: number
  redoFrame?: number
  trackIndex: number
  undoFrame?: number
  undoInsertIndex?: number
  undoTrackIndex: number
}

export interface RemoveClipActionObject extends ActionArgs {
  clip: ClientClip
  index: number
  track: ClientTrack
}
