import type { Action, ActionArgs, ClientClip, ClientMashAsset } from "@moviemasher/runtime-client"
import { ErrorName, errorThrow } from '@moviemasher/runtime-shared'
import { assertClientMashAsset, isClientMashAsset } from '../../../Mash/ClientMashGuards.js'


export class ActionClass implements Action {
  constructor(object: ActionArgs) {
    const { redoSelection, type, undoSelection } = object
    this.redoSelection = redoSelection
    this.type = type
    this.undoSelection = undoSelection
  }

  done = false

  redo(): void {
    this.redoAction()
    this.done = true
  }

  protected redoAction(): void {
    return errorThrow(ErrorName.Unimplemented)
  }

  protected redoSelection: ClientClip | false

  get selection(): ClientClip | false {
    if (this.done)
      return this.redoSelection

    return this.undoSelection
  }

  type: string

  undo(): void {
    this.undoAction()
    this.done = false
  }

  protected undoAction(): void {
    return errorThrow(ErrorName.Unimplemented)
  }

  protected undoSelection: ClientClip | false
}
