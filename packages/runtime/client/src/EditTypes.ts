import type { Propertied, PropertyId, PropertyIds, Scalar, ScalarsById, Typed } from '@moviemasher/runtime-shared'

import type { ClientClip, ClientClips, ClientMashAsset, ClientTrack } from './ClientMashTypes.js'

export interface Edits {
  canRedo: boolean
  canSave: boolean
  canUndo: boolean
  create(object: EditObject): void
  redo(): void
  save(): void
  undo(): void
}

export interface Edit {
  redo(): void
  undo(): void
  updateSelection(): void
  affects: PropertyIds
}

export interface EditObject extends Typed {}

export interface EditArgs extends EditObject {}

export interface ChangeEdit extends Edit {
  target: Propertied
  updateEdit(object: ChangeEditObject): void
}

export interface ChangePropertyEdit extends ChangeEdit {
  property: PropertyId
  value?: Scalar
  valueNumber?: number
  updateEdit(object: ChangePropertyEditObject): void
}

export interface ChangePropertiesEdit extends ChangeEdit {
  redoValues: ScalarsById
  undoValues: ScalarsById
  updateEdit(object: ChangePropertiesEditObject): void
}

export interface AddClipsEditObject extends AddTrackEditObject {
  clips: ClientClips
  insertIndex?: number
  trackIndex: number
  redoFrame?: number
}

export interface AddTrackEditObject extends EditArgs {
  mashAsset: ClientMashAsset
  createTracks: number
}

export interface ChangeEditObject extends EditArgs {
  target: Propertied
}

export interface ChangePropertyEditObject extends ChangeEditObject {
  property: PropertyId
  redoValue?: Scalar
  undoValue?: Scalar
}

export interface ChangePropertiesEditObject extends ChangeEditObject {
  redoValues: ScalarsById
  undoValues: ScalarsById
}

export interface MoveClipEditObject extends AddTrackEditObject {
  clip: ClientClip
  insertIndex?: number
  redoFrame?: number
  trackIndex: number
  undoFrame?: number
  undoInsertIndex?: number
  undoTrackIndex: number
}

export interface RemoveClipEditObject extends EditArgs {
  clip: ClientClip
  index: number
  track: ClientTrack
}
