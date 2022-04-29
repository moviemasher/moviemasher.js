import { Scalar } from "../../../../declarations"
import { Effect } from "../../../../Media/Effect/Effect"
import { Clip } from "../../../../Mixin/Clip/Clip"
import { Action, ActionOptions } from "./Action"

interface ChangeActionObject extends ActionOptions {
  property : string
  redoValue : Scalar
  target : Clip | Effect
  undoValue : Scalar
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

  redoValue : Scalar

  target : Clip | Effect

  undoValue : Scalar

  get redoValueNumeric() : number { return Number(this.redoValue) }

  get undoValueNumeric() : number { return Number(this.undoValue) }

  redoAction() : void {
    this.target.setValue(this.redoValue, this.property)
  }

  undoAction() : void {
    this.target.setValue(this.undoValue, this.property)
  }

  updateAction(value : Scalar) : void {
    this.redoValue = value
    this.redo()
  }
}

export { ChangeAction, ChangeActionObject }
