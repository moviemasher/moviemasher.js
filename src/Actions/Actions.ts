import { Action } from "../Action"
import { Base } from "../Base"
import { Errors } from "../Setup"
import { Is } from "../Utilities"

class Actions extends Base {
  index : number

  instances : Action[]

  constructor(object) {
    super(object)
    this.instances = []
    this.index = -1
  }

  get canRedo() { return this.index < this.instances.length - 1 }

  get canUndo() { return this.index > -1 }

  get currentAction() { return this.instances[this.index] }

  get currentActionLast() { return this.canUndo && !this.canRedo }

  get mash() { return this.object.mash }

  // TODO: remove
  get masher() { return this.object.masher }

  do(action) {
    if (!Is.instanceOf(action, Action)) throw Errors.action

    const remove = this.instances.length - (this.index + 1)
    const removed = remove ? this.instances.splice(this.index + 1, remove) : []

    this.instances.push(action)
    this.redo()
    return removed
  }

  redo() {
    this.index += 1
    const action = this.currentAction
    action.redo()
    return action
  }

  undo() {
    const action = this.currentAction
    this.index -= 1
    action.undo()
    return action
  }
}

export { Actions }
