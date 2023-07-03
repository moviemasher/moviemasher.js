import type { ActionType } from './ActionType.js'
import type { ClientClip } from './ClientMashTypes.js'

export interface Action {
  redo(): void
  undo(): void
  selection: ClientClip | false
}

export interface ActionObject {
  redoSelection?: ClientClip | false | undefined
  type: ActionType
  undoSelection?: ClientClip | false | undefined
}

export interface ActionArgs extends Required<ActionObject> {}