import { isCustomEvent, UnknownObject } from "../../../declarations"
import { Errors } from "../../../Setup/Errors"
import { ActionType } from "../../../Setup/Enums"

import { Mash } from "../../../Edited/Mash/Mash"
import { EditorSelection } from "../../Selectable"
import { Cast } from "../../../Edited/Cast/Cast"


export interface ActionOptions extends UnknownObject {
  redoSelection: EditorSelection
  type : ActionType
  undoSelection: EditorSelection
}

export type ActionObject = Partial<ActionOptions>
export type ActionMethod = (object: ActionObject) => void

export class Action {
  constructor(object : ActionOptions) {
    const { redoSelection, type, undoSelection } = object
    this.redoSelection = redoSelection
    this.type = type
    this.undoSelection = undoSelection
  }
  get cast(): Cast { return this.redoSelection.cast || this.undoSelection.cast! }

  done =  false

  get mash(): Mash { return this.redoSelection.mash || this.undoSelection.mash! }

  redo() : void {
    this.redoAction()
    this.done = true
  }

  redoAction() : void { throw Errors.unimplemented + 'redoAction' }

  redoSelection: EditorSelection

  get selection(): EditorSelection {
    if (this.done) return this.redoSelection

    return this.undoSelection
  }

  type : string

  undo() : void {
    this.undoAction()
    this.done = false
  }

  undoAction() : void { throw Errors.unimplemented + 'undoAction'}

  undoSelection: EditorSelection
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
  return isCustomEvent(value) && value.detail
}
