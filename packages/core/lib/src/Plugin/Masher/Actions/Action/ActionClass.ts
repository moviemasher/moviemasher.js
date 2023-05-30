import type { EditorSelectionObject } from '../../EditorSelection/EditorSelection.js'
import { errorThrow } from '../../../../Helpers/Error/ErrorFunctions.js'
import { ErrorName } from '../../../../Helpers/Error/ErrorName.js'
import { Action, ActionObject } from './Action.js'
import { MashClientAsset } from '../../../../Client/Mash/MashClientTypes.js'
import { assertMashClientAsset, isMashClientAsset } from '../../../../Client/Mash/MashClientGuards.js'


export class ActionClass implements Action {
  constructor(object: ActionObject) {
    const { redoSelection, type, undoSelection } = object
    this.redoSelection = redoSelection
    this.type = type
    this.undoSelection = undoSelection
  }

  done = false

  protected get mash(): MashClientAsset {
    const { mash } = this.redoSelection
    if (isMashClientAsset(mash))
      return mash

    const { mash: undoMash } = this.undoSelection
    assertMashClientAsset(undoMash)
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
