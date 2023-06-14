import type { ActionObject, Action } from './Action.js'
import type { EditorSelectionObject } from './EditorSelectionObject.js'

export interface Actions {
  canRedo: boolean
  canSave: boolean
  canUndo: boolean
  create(object: ActionObject): void
  instances: Action[]
  redo(): Action
  save(): void
  selection: EditorSelectionObject
  undo(): Action
}
