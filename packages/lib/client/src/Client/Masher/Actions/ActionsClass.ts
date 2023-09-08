import type { Action, ActionArgs, ActionObject, Actions, ClientMashAsset } from '@moviemasher/runtime-client'

import { ActionTypeChange, assertDefined, isPositive } from '@moviemasher/lib-shared'
import { ClientActionRedo, ClientActionUndo, EventChangedClientAction, MovieMasher } from '@moviemasher/runtime-client'
import { actionInstance } from './Action/ActionFactory.js'
import { isChangeAction, isChangeActionObject, isChangePropertiesAction, isChangePropertiesActionObject, isChangePropertyAction, isChangePropertyActionObject } from './Action/ActionFunctions.js'


export class ActionsClass implements Actions {
  constructor(public mashAsset: ClientMashAsset) { }

  add(action: Action): void {
    const remove = this.instances.length - (this.index + 1)
    if (isPositive(remove)) this.instances.splice(this.index + 1, remove)

    this.instances.push(action)
  }

  get canRedo(): boolean { return this.index < this.instances.length - 1 }

  get canSave(): boolean { return this.canUndo }

  get canUndo(): boolean { return this.index > -1 }

  create(object: ActionObject): void {
    const { type = ActionTypeChange, ...rest } = object
    const clone: ActionArgs = { ...rest, type }
    if (this.currentActionLast) {
      const { currentAction: action } = this
      if (isChangeActionObject(object) && isChangeAction(action)) {
        const { target } = object
        if (action.target === target) {
          if (isChangePropertyActionObject(object)) {
            if (isChangePropertyAction(action) && action.property === object.property) {
              action.updateAction(object)
              this.dispatchChanged(action)
              return
            }
          } else if (isChangePropertiesActionObject(object)) {
            if (isChangePropertiesAction(action)) {
              const { redoValues } = object
              const { undoValues } = action
              const objectKeys = Object.keys(redoValues)
              const actionKeys = Object.keys(undoValues)
              if (objectKeys.some(key => actionKeys.includes(key))) {
                action.updateAction(object)
                this.dispatchChanged(action)
                return
              }
            }
          }          
        }
      }
    }
    const action = actionInstance(clone)
    this.add(action)
    this.redo()
  }

  get currentAction(): Action | undefined { return this.instances[this.index] }

  get currentActionLast(): boolean { return this.canUndo && !this.canRedo }

  destroy(): void {
    this.index = -1
    this.instances.splice(0, this.instances.length)
  }

  private dispatchChangedAction(): void {
    MovieMasher.eventDispatcher.dispatch(new EventChangedClientAction(ClientActionUndo))
    MovieMasher.eventDispatcher.dispatch(new EventChangedClientAction(ClientActionRedo))
  }

  protected dispatchChanged(action: Action): void {
    const { mashAsset } = this
    action.updateSelection()
    this.dispatchChangedAction()
    mashAsset.dispatchChanged(action)
  }

  index = -1

  instances: Action[] = []

  redo(): void {
    this.index += 1
    const action = this.currentAction
    assertDefined(action)

    action.redo()
    this.dispatchChanged(action)
  }

  save(): void {
    this.instances.splice(0, this.index + 1)
    this.index = -1
    this.dispatchChangedAction()
  }

  undo(): void {
    const action = this.currentAction
    assertDefined(action)
    
    this.index -= 1
    action.undo()
    this.dispatchChanged(action)
  }
}
