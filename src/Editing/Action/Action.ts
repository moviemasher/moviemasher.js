import { Errors } from "../../Setup/Errors"
import { Actions } from "../Actions"
import { Mash } from "../../Mash/Mash/Mash"
import { Selection } from "../../Masher/Masher"

interface ActionObject {
  actions : Actions
  mash : Mash
  redoAction() : void
  redoSelection: Selection
  type : string
  undoAction(): void
  undoSelection: Selection
}

class Action {
  constructor(object : ActionObject) {
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

  redoSelection: Selection

  get selection(): Selection {
    if (this.done) return this.redoSelection

    return this.undoSelection
  }

  type : string

  undo() : void {
    this.undoAction()
    this.done = false
  }

  undoAction() : void { throw Errors.unimplemented }

  undoSelection: Selection
}

export { Action, ActionObject }
