import type { EditorSelectionObject } from "@moviemasher/runtime-client"
import { errorThrow } from '@moviemasher/runtime-shared'
import { ErrorName } from '@moviemasher/runtime-shared'
import { Action, ActionObject } from "@moviemasher/runtime-client"
import { ClientMashAsset } from '../../../../Client/Mash/ClientMashTypes.js'
import { assertClientMashAsset, isClientMashAsset } from '../../../../Client/Mash/ClientMashGuards.js'


export class ActionClass implements Action {
  constructor(object: ActionObject) {
    const { redoSelection, type, undoSelection } = object
    this.redoSelection = redoSelection
    this.type = type
    this.undoSelection = undoSelection
  }

  done = false

  protected get mash(): ClientMashAsset {
    const { mash } = this.redoSelection
    if (isClientMashAsset(mash))
      return mash

    const { mash: undoMash } = this.undoSelection
    assertClientMashAsset(undoMash)
    return undoMash
  }

  redo(): void {
    this.redoAction()
    this.done = true
  }

  protected redoAction(): void {
    return errorThrow(ErrorName.Unimplemented)
  }

  protected redoSelection: EditorSelectionObject

  get selection(): EditorSelectionObject {
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

  protected undoSelection: EditorSelectionObject
}
