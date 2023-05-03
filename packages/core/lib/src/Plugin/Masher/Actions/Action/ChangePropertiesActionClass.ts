import { Propertied } from '../../../../Base/Propertied.js'
import { ScalarRecord } from '../../../../Types/Core.js'
import { ChangePropertiesAction } from './Action.js'
import { ActionClass } from "./ActionClass.js"
import { ChangePropertiesActionObject } from './Action.js'

/**
 * @category Action
 */
export class ChangePropertiesActionClass extends ActionClass implements ChangePropertiesAction {
  constructor(object: ChangePropertiesActionObject) {
    const { redoValues, undoValues, property, target } = object
    super(object)
    this.undoValues = undoValues
    this.redoValues = redoValues
    this.property = property
    this.target = target
  }

  property: string

  redoAction() : void {
    const { target, redoValues } = this
    Object.entries(redoValues).forEach(([property, value]) => {
      target.setValue(value, property)
    })
  }

  redoValues: ScalarRecord

  target: Propertied

  undoAction() : void {
    const { target, undoValues } = this
    Object.entries(undoValues).forEach(([property, value]) => {
      target.setValue(value, property)
    })
  }  
  updateAction(object: ChangePropertiesActionObject) : void {
    const { redoValues } = object
    this.redoValues = redoValues
    this.redo()
  }
  
  undoValues: ScalarRecord
}
