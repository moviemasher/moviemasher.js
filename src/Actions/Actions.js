import { Action } from "../Action"
import { Base } from "../Base"
import { Errors } from "../Setup"
import { Is } from "../Utilities"

class Actions extends Base {
  constructor(object) {
    super(object)
    
    this.actions = []
    this.index = -1
  }

  get canRedo() { return this.index < this.actions.length - 1 }

  get canUndo() { return this.index > -1 }

  get currentAction() { return this.actions[this.index] }

  get currentActionLast() { return this.canUndo && !this.canRedo }

  get mash() { return this.object.mash }

  // TODO: remove
  get masher() { return this.object.masher }

  do(action) {
    if (!Is.instanceOf(action, Action)) throw(Errors.action)

    action.actions = this
    const remove = this.actions.length - (this.index + 1)
    const removed = remove ? this.actions.splice(this.index + 1, remove) : []
    
    this.actions.push(action)
    this.redo()
    return removed
  }

  redo() {
    this.index ++
    const action = this.currentAction
    action.redo()
    return action
  }

  undo(){
    const action = this.currentAction
    this.index--
    action.undo()
    return action
  }
}

export { Actions }