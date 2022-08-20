import { ChangeAction, ChangeActionObject } from "./ChangeAction"

/**
 * @category Action
 */
export class ChangeFramesAction extends ChangeAction {
  constructor(object : ChangeActionObject) {
    super(object)
  }

  redoAction() : void {
    this.mash.changeTiming(this.target, this.property, this.redoValueNumeric)
  }

  undoAction() : void {
    this.mash.changeTiming(this.target, this.property, this.undoValueNumeric)
  }
}
