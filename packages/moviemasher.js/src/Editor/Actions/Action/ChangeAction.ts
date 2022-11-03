import { Propertied } from "../../../Base/Propertied"
import { Scalar } from "../../../declarations"
import { isObject } from "../../../Utility/Is"
import { Action, ActionObject } from "./Action"


export interface ChangeActionObject extends ActionObject {
  property: string
  redoValue?: Scalar
  undoValue?: Scalar
  target: Propertied
}


export const isChangeActionObject = (value: any): value is ChangeActionObject => {
  return isObject(value) && "target" in value && "property" in value
}


/**
 * @category Action
 */
export class ChangeAction extends Action {
  constructor(object: ChangeActionObject) {
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

  updateAction(object: ChangeActionObject) : void {
    // console.log(this.constructor.name, "updateAction", object)
    const { redoValue } = object
    this.redoValue = redoValue
    this.redo()
  }
}
export const isChangeAction = (value: any): value is ChangeAction => (
  value instanceof ChangeAction
)
export function assertChangeAction(value: any): asserts value is ChangeAction {
  if (!isChangeAction(value)) throw new Error('expected ChangeAction')
}
