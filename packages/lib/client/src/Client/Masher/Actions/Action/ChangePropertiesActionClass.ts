import type { ChangePropertiesAction, ChangePropertiesActionObject } from '@moviemasher/runtime-client'
import type { PropertyIds, ScalarsById } from '@moviemasher/runtime-shared'

import { isPropertyId } from '@moviemasher/lib-shared'
import { ChangeActionClass } from './ChangeActionClass.js'

export class ChangePropertiesActionClass extends ChangeActionClass implements ChangePropertiesAction {
  constructor(object: ChangePropertiesActionObject) {
    const { redoValues, undoValues } = object
    super(object)
    this.undoValues = undoValues
    this.redoValues = redoValues
  }

  override get affects(): PropertyIds { 
    const names = Object.keys(this.done ? this.redoValues : this.undoValues)
    return names.filter(isPropertyId)
  }
  
  override redoAction() : void {
    const { target, redoValues } = this
    Object.entries(redoValues).forEach(([property, value]) => {
      target.setValue(property, value)
    })
  }

  redoValues: ScalarsById

  override undoAction() : void {
    const { target, undoValues } = this
    Object.entries(undoValues).forEach(([property, value]) => {
      target.setValue(property, value)
    })
  } 

  undoValues: ScalarsById

  override updateAction(object: ChangePropertiesActionObject) : void {
    const { redoValues } = object
    this.redoValues = redoValues
    this.redo()
  }
}
