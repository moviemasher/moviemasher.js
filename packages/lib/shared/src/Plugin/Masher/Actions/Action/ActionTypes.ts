import type { Propertied } from '@moviemasher/runtime-shared'
import type { Scalar, ScalarRecord } from '@moviemasher/runtime-shared'
import type { ClientClip, ClientClips, ClientTrack } from '../../../../Client/Mash/ClientMashTypes.js'
import { Action, ActionObject } from '@moviemasher/runtime-client'


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

export interface ChangeActionObject extends ActionObject {
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

export interface AddTrackActionObject extends ActionObject {
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

export interface RemoveClipActionObject extends ActionObject {
  clip: ClientClip
  index: number
  track: ClientTrack
}

export interface MoveActionObject extends ActionObject {
  objects: any[]
  redoObjects: any[]
  undoObjects: any[]
}


