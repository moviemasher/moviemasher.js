import type { ActionType } from './ActionType.js'
import type { EditorSelectionObject } from './EditorSelectionObject.js'

export interface Action {
  redo(): void
  undo(): void
  selection: EditorSelectionObject
}

export interface ActionObject {
  redoSelection: EditorSelectionObject
  type: ActionType
  undoSelection: EditorSelectionObject
}
