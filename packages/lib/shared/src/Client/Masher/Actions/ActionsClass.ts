import type { Action, ActionArgs, ActionObject, Actions, ClientClip, Masher } from '@moviemasher/runtime-client'

import { ActionTypeChange } from '../../../Setup/ActionTypeConstants.js'
import { assertDefined, isPositive } from '../../../Shared/SharedGuards.js'
import { actionInstance } from './Action/ActionFactory.js'
import { isChangePropertiesAction, isChangePropertiesActionObject, isChangePropertyAction, isChangePropertyActionObject } from "./Action/ActionFunctions.js"


export class ActionsClass implements Actions {
  constructor(public editor: Masher) { }

  add(action: Action): void {
    const remove = this.instances.length - (this.index + 1)
    if (isPositive(remove)) this.instances.splice(this.index + 1, remove)

    this.instances.push(action)
  }

  get canRedo(): boolean { return this.index < this.instances.length - 1 }

  get canSave(): boolean { return this.canUndo }

  get canUndo(): boolean { return this.index > -1 }

  create(object: ActionObject): void {
    const { editor } = this
    const { undoSelection, redoSelection, type = ActionTypeChange, ...rest } = object

    const clone: ActionArgs = {
      ...rest,
      type,
      undoSelection: (typeof undoSelection === 'undefined') ? editor.selection : undoSelection,
      redoSelection: (typeof redoSelection === 'undefined') ? editor.selection : redoSelection,
    }
    if (this.currentActionLast) {
      const { currentAction } = this
      if (isChangePropertyActionObject(object)) {
        if (isChangePropertyAction(currentAction)) {
          const { target, property } = object
          if (currentAction.target === target && currentAction.property === property) {
            currentAction.updateAction(object)
            editor.dispatchChanged(currentAction)
            return
          }
        }
      } else if (isChangePropertiesActionObject(object)) {
        if (isChangePropertiesAction(currentAction)) {
          const { target, property } = object
          if (currentAction.target === target && currentAction.property === property) {
            currentAction.updateAction(object)
            editor.dispatchChanged(currentAction)
            return
          }
        }
      }
    }
   
    const action = actionInstance(clone)
    this.add(action)
    editor.dispatchChanged(this.redo())
  }

  get currentAction(): Action | undefined { return this.instances[this.index] }

  get currentActionLast(): boolean { return this.canUndo && !this.canRedo }

  destroy(): void {
    this.index = -1
    this.instances.splice(0, this.instances.length)
  }

  index = -1

  instances: Action[] = []

  redo(): Action {
    this.index += 1
    const action = this.currentAction
    assertDefined(action)

    action.redo()
    return action
  }

  save(): void {
    this.instances.splice(0, this.index + 1)
    this.index = -1
  }

  get selection(): ClientClip | false { return this.editor.selection }

  undo(): Action {
    const action = this.currentAction
    assertDefined(action)
    
    this.index -= 1
    action.undo()
    return action
  }
}
