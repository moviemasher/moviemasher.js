
import { Effect } from "../../Mash/Effect/Effect"
import { Mash } from "../../Mash/Mash"
import { Clip } from "../../Mash/Mixin/Clip/Clip"
import { Action, ActionObject } from "./Action"

interface ChangeActionObject extends ActionObject {
  property : string
  redoValue : string | number
  target : Mash | Clip | Effect
  undoValue : string | number
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

  redoValue : string | number

  target : Mash | Clip | Effect

  undoValue : string | number

  get redoValueNumeric() : number { return Number(this.redoValue) }

  get undoValueNumeric() : number { return Number(this.undoValue) }

  redoAction() : void {
    this.target[this.property] = this.redoValue
  }

  undoAction() : void {
    this.target[this.property] = this.undoValue
  }

  updateAction(value : string | number) : void {
    this.redoValue = value
    this.redo()
  }
}

export { ChangeAction, ChangeActionObject }
