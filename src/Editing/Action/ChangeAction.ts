import { Effect } from "../../Mash/Effect/Effect"
import { Mash } from "../../Mash/Mash"
import { Clip } from "../../Mash/Mixin/Clip/Clip"
import { SelectionValue } from "../../declarations"
import { Action, ActionObject } from "./Action"

interface ChangeActionObject extends ActionObject {
  property : string
  redoValue : SelectionValue
  target : Mash | Clip | Effect
  undoValue : SelectionValue
}

class ChangeAction extends Action {
  constructor(object : ChangeActionObject) {
    super(object)
    const { property, redoValue, target, undoValue } = object
    this.property = property
    this.redoValue = redoValue
    this.target = target
    this.undoValue = undoValue
  }

  property : string

  redoValue : SelectionValue

  target : Mash | Clip | Effect

  undoValue : SelectionValue

  get redoValueNumeric() : number { return Number(this.redoValue) }

  get undoValueNumeric() : number { return Number(this.undoValue) }

  redoAction() : void {
    this.target.setValue(this.property, this.redoValue)
  }

  undoAction() : void {
    this.target.setValue(this.property, this.undoValue)
  }

  updateAction(value : SelectionValue) : void {
    this.redoValue = value
    this.redo()
  }
}

export { ChangeAction, ChangeActionObject }
