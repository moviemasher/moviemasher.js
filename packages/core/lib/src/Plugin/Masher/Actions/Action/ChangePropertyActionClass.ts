import type { Propertied } from '../../../../Base/Propertied.js'
import type { Scalar } from '../../../../Types/Core.js'
import type { ChangePropertyActionObject, ChangePropertyAction } from './Action.js'

import { ActionClass } from "./ActionClass.js"

/**
 * @category Action
 */
export class ChangePropertyActionClass extends ActionClass implements ChangePropertyAction {
  constructor(object: ChangePropertyActionObject) {
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

  updateAction(object: ChangePropertyActionObject) : void {
    // console.log(this.constructor.name, 'updateAction', object)
    const { redoValue } = object
    this.redoValue = redoValue
    this.redo()
  }
}



