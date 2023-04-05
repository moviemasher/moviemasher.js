import { UnknownRecord } from '../../../../Types/Core.js'
import { ActionType } from '../../../../Setup/Enums.js'

import { assertMashMedia, isMashMedia, MashMedia } from '../../../../Media/Mash/Mash.js'
import { EditorSelectionObject } from '../../EditorSelection/EditorSelection.js'
import { errorThrow } from '../../../../Helpers/Error/ErrorFunctions.js'
import { ErrorName } from '../../../../Helpers/Error/ErrorName.js'


export interface ActionObject extends UnknownRecord {
  redoSelection: EditorSelectionObject
  type: ActionType
  undoSelection: EditorSelectionObject
}

export interface ActionOptions extends Partial<ActionObject> {
  // redoValue: Scalar
  // undoValue: Scalar
  // undoValues: ScalarRecord
  // redoValues: ScalarRecord
}

export type ActionMethod = (object: ActionOptions) => void

export class Action {
  constructor(object: ActionObject) {
    const { redoSelection, type, undoSelection } = object
    this.redoSelection = redoSelection
    this.type = type
    this.undoSelection = undoSelection
  }
  
  done =  false

  protected get mash(): MashMedia { 
    const { mash } = this.redoSelection
    if (isMashMedia(mash)) return mash

    const { mash: undoMash } = this.undoSelection
    assertMashMedia(undoMash) 
    return undoMash
  }

  redo() : void {
    this.redoAction()
    this.done = true
  }

  protected redoAction() : void { 
    return errorThrow(ErrorName.Unimplemented)
   }

  protected redoSelection: EditorSelectionObject

  get selection(): EditorSelectionObject {
    if (this.done) return this.redoSelection

    return this.undoSelection
  }

  type : string

  undo() : void {
    this.undoAction()
    this.done = false
  }

  protected undoAction() : void { 
    return errorThrow(ErrorName.Unimplemented)
  }

  protected undoSelection: EditorSelectionObject
}

export const isAction = (value: any): value is Action => value instanceof Action
export function assertAction(value: any): asserts value is Action {
  if (!isAction(value)) throw new Error('expected Action')
}

export interface ActionInit {
  action: Action
}
export const isActionInit = (value: any): value is ActionInit => isAction(value.action)

export interface ActionEvent extends CustomEvent<ActionInit> { }
export const isActionEvent = (value: any): value is ActionEvent => {
  return value instanceof CustomEvent && value.detail
}
