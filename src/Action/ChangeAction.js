import { Action } from "./Action";

class ChangeAction extends Action {
  constructor(object) {
    const redoValue = object.redoValue
    delete object.redoValue
    super(object)
    this.__redoValue = redoValue
  }

  get redoValue() { return this.__redoValue }

  redoAction() {
    this.target[this.property] = this.redoValue
  }

  undoAction() {
    this.target[this.property] = this.undoValue
  }

  updateAction(redoValue) {
    this.__redoValue = redoValue
    this.redo()
  }
}

export { ChangeAction }
