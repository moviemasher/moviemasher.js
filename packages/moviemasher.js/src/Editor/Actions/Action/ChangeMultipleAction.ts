import { ScalarObject } from "../../../declarations"
import { ChangeAction, ChangeActionObject } from "./ChangeAction"

export interface ChangeMultipleActionObject extends ChangeActionObject {
  undoValues: ScalarObject
  redoValues: ScalarObject
}

/**
 * @category Action
 */
export class ChangeMultipleAction extends ChangeAction {
  constructor(object : ChangeMultipleActionObject) {
    const { redoValues, undoValues } = object
    super(object)
    this.undoValues = undoValues
    this.redoValues = redoValues
  }

  redoAction() : void {
    const { target, redoValues } = this
    Object.entries(redoValues).forEach(([property, value]) => {
      target.setValue(value, property)
    })
  }

  redoValues: ScalarObject

  undoAction() : void {
    const { target, undoValues } = this
    Object.entries(undoValues).forEach(([property, value]) => {
      target.setValue(value, property)
    })
  }  
  updateAction(object: ChangeMultipleActionObject) : void {
    const { redoValues } = object
    this.redoValues = redoValues
    this.redo()
  }
  
  undoValues: ScalarObject
}
