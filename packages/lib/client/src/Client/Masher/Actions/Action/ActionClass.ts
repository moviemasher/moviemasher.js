import type { Action, ActionArgs } from '@moviemasher/runtime-client'
import type { PropertyIds } from '@moviemasher/runtime-shared'

import { ERROR, errorThrow } from '@moviemasher/runtime-shared'

export class ActionClass implements Action {
  constructor(object: ActionArgs) {
    this.type = object.type
  }

  get affects(): PropertyIds { return [] }

  done = false

  redo(): void {
    this.redoAction()
    this.done = true
  }

  protected redoAction(): void {
    return errorThrow(ERROR.Unimplemented)
  }

  type: string

  undo(): void {
    this.undoAction()
    this.done = false
  }

  protected undoAction(): void {
    return errorThrow(ERROR.Unimplemented)
  }

  updateSelection(): void {}
}
