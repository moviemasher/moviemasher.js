import { DotChar, PropertyIds, ScalarRecord } from '@moviemasher/runtime-shared'
import { ChangePropertiesAction, ChangeTarget } from './ActionTypes.js'
import { ActionClass } from "./ActionClass.js"
import { ChangePropertiesActionObject } from './ActionTypes.js'
import { isPropertyId } from '@moviemasher/runtime-client'

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

  get affects(): PropertyIds { 
    const { target } = this
    const { targetId } = target  
    const values = this.done ? this.redoValues : this.undoValues
    const properties = Object.keys(values)
    const propertyIds = properties.map(property => [targetId, property].join(DotChar))
    return propertyIds.filter(isPropertyId)
  }
  
  property: string

  redoAction() : void {
    const { target, redoValues } = this
    Object.entries(redoValues).forEach(([property, value]) => {
      target.setValue(property, value)
    })
  }

  redoValues: ScalarRecord

  target: ChangeTarget

  undoAction() : void {
    const { target, undoValues } = this
    Object.entries(undoValues).forEach(([property, value]) => {
      target.setValue(property, value)
    })
  } 
   
  updateAction(object: ChangePropertiesActionObject) : void {
    const { redoValues } = object
    this.redoValues = redoValues
    this.redo()
  }
  
  undoValues: ScalarRecord
}
