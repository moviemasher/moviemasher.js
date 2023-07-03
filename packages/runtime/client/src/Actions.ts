import type { ActionObject, Action } from './Action.js'
import type { ClientClip } from './ClientMashTypes.js'

export interface Actions {
  canRedo: boolean
  canSave: boolean
  canUndo: boolean
  create(object: ActionObject): void
  instances: Action[]
  redo(): Action
  save(): void
  selection: ClientClip | false
  undo(): Action
}
