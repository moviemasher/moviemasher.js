import { ActionType } from "../../Setup/Enums"
import { isPositive } from "../../Utility/Is"
import { Editor } from "../Editor"
import { EditorSelectionObject } from "../EditorSelection"
import { Action, ActionOptions, ActionObject, assertAction } from "./Action/Action"
import { actionInstance } from "./Action/ActionFactory"
import { ChangeAction, isChangeAction, isChangeActionObject } from "./Action/ChangeAction"

export class Actions  {
  constructor(public editor: Editor) { }

  add(action : Action) : void {
    const remove = this.instances.length - (this.index + 1)
    if (isPositive(remove)) this.instances.splice(this.index + 1, remove)

    this.instances.push(action)
  }

  get canRedo() : boolean { return this.index < this.instances.length - 1 }

  get canSave() : boolean { return this.canUndo }

  get canUndo() : boolean { return this.index > -1 }

  create(object: ActionOptions): void {
    const { editor } = this
    const { undoSelection, redoSelection, type = ActionType.Change, ...rest } = object

    const clone: ActionObject = {
      ...rest,
      type,
      undoSelection: undoSelection || { ...editor.selection.object },
      redoSelection: redoSelection || { ...editor.selection.object },
    }
    if (isChangeActionObject(object) && this.currentActionLast) {
      const { currentAction } = this
      if (isChangeAction(currentAction)) {
        const { target, property } = object
        if (currentAction.target === target && currentAction.property === property) {
          currentAction.updateAction(object)
          editor.handleAction(currentAction)
          return
        }
      }
    }
    const action = actionInstance(clone)
    this.add(action)
    editor.handleAction(this.redo())
  }


  get currentAction() : Action | undefined { return this.instances[this.index] }

  get currentActionLast() : boolean { return this.canUndo && !this.canRedo }

  destroy() : void {
    this.index = -1
    this.instances.splice(0, this.instances.length)
  }

  index = -1

  instances : Action[] = []

  redo() : Action {
    this.index += 1
    const action = this.currentAction
    assertAction(action)
    action.redo()
    return action
  }

  private reusableChangeAction(target: unknown, property: string): ChangeAction | undefined {
    if (!this.currentActionLast) return

    const action = this.currentAction
    if (isChangeAction(action) && action.target === target && action.property === property) {
      return action
    }
  }


  save() : void {
    this.instances.splice(0, this.index + 1)
    this.index = -1
  }

  get selection(): EditorSelectionObject { return this.editor.selection }

  undo() : Action {
    const action = this.currentAction
    assertAction(action)
    this.index -= 1
    action.undo()
    return action
  }
}
