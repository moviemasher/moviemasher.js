import { SelectionValue } from "../../../../Base/Propertied"
import { Effect } from "../../../../Media/Effect/Effect"
import { Clip } from "../../../../Mixin/Clip/Clip"
import { Action, ActionOptions } from "./Action"

interface ChangeActionObject extends ActionOptions {
  property : string
  redoValue : SelectionValue
  target : Clip | Effect
  undoValue : SelectionValue
}


/**
 * @category Action
 */
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

  target : Clip | Effect

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
