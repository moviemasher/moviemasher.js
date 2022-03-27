import { UnknownObject } from "../../../../declarations"
import { Errors } from "../../../../Setup/Errors"
import { ActionType } from "../../../../Setup/Enums"
import { Actions } from "../Actions"

import { MashEditorSelection } from "../../MashEditor"
import { Mash } from "../../../../Edited/Mash/Mash"

interface ActionOptions extends UnknownObject {
  actions : Actions
  mash : Mash
  redoSelection: MashEditorSelection
  type : ActionType
  undoSelection: MashEditorSelection
}

type ActionObject = Partial<ActionOptions>

class Action {
  constructor(object : ActionOptions) {
    const { actions, mash, redoSelection, type, undoSelection } = object
    this.actions = actions
    this.mash = mash
    this.redoSelection = redoSelection
    this.type = type
    this.undoSelection = undoSelection
  }

  actions : Actions

  done =  false

  mash : Mash

  redo() : void {
    this.redoAction()
    this.done = true
  }

  redoAction() : void { throw Errors.unimplemented }

  redoSelection: MashEditorSelection

  get selection(): MashEditorSelection {
    if (this.done) return this.redoSelection

    return this.undoSelection
  }

  type : string

  undo() : void {
    this.undoAction()
    this.done = false
  }

  undoAction() : void { throw Errors.unimplemented }

  undoSelection: MashEditorSelection
}

export { Action, ActionObject, ActionOptions }
