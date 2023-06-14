import { ChangePropertyActionClass } from './ChangePropertyActionClass.js'
import { ChangePropertyActionObject } from "./ActionTypes.js"

/**
 * @category Action
 */
export class ChangeFramesActionClass extends ChangePropertyActionClass {
  constructor(object : ChangePropertyActionObject) {
    super(object)
  }

  redoAction() : void {
    this.mash.changeTiming(this.target, this.property, this.redoValueNumeric)
  }

  undoAction() : void {
    this.mash.changeTiming(this.target, this.property, this.undoValueNumeric)
  }
}
