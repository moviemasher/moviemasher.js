import { isCustomEvent, UnknownObject } from "../../../declarations"
import { Errors } from "../../../Setup/Errors"
import { ActionType } from "../../../Setup/Enums"

import { assertMash, isMash, Mash } from "../../../Edited/Mash/Mash"
import { EditorSelectionObject } from "../../EditorSelection"
import { Cast } from "../../../Edited/Cast/Cast"
import { assertCast, isCast } from "../../../Edited/Cast/CastFactory"


export interface ActionOptions extends UnknownObject {
  redoSelection: EditorSelectionObject
  type : ActionType
  undoSelection: EditorSelectionObject
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
  get cast(): Cast { 
    const { cast } = this.redoSelection
    if (isCast(cast)) return cast

    const { cast: undoCast } = this.undoSelection
    assertCast(undoCast) 
    return undoCast
  }
  done =  false

  get mash(): Mash { 
    const { mash } = this.redoSelection
    if (isMash(mash)) return mash

    const { mash: undoMash } = this.undoSelection
    assertMash(undoMash) 
    return undoMash
  }

  redo() : void {
    this.redoAction()
    this.done = true
  }

  redoAction() : void { throw Errors.unimplemented + 'redoAction' }

  redoSelection: EditorSelectionObject

  get selection(): EditorSelectionObject {
    if (this.done) return this.redoSelection

    return this.undoSelection
  }

  type : string

  undo() : void {
    this.undoAction()
    this.done = false
  }

  undoAction() : void { throw Errors.unimplemented + 'undoAction'}

  undoSelection: EditorSelectionObject
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
