import { Propertied } from "../../../Base/Propertied"
import { Scalar } from "../../../declarations"
import { Effect } from "../../../Media/Effect/Effect"
import { Clip } from "../../../Mixin/Clip/Clip"
import { ClipOrEffect } from "../../Editor"
import { Action, ActionOptions } from "./Action"

export interface ChangeActionObject extends ActionOptions {
  property: string
  redoValue: Scalar
  target: Propertied
  undoValue: Scalar
}

/**
 * @category Action
 */
export class ChangeAction extends Action {
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

  target: Propertied

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


export const isChangeAction = (value: any): value is ChangeAction => value instanceof ChangeAction

export function assertChangeAction(value: any): asserts value is ChangeAction {
  if (!isChangeAction(value)) throw new Error('expected ChangeAction')
}
