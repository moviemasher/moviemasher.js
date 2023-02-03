import { errorsThrow } from "../../../Utility/Errors"
import { Action, ActionOptions, ActionObject } from "./Action"

export interface MoveActionObject extends ActionObject {
  objects: any[]
  redoObjects: any[]
  undoObjects: any[]
}

export interface MoveActionOptions extends Partial<MoveActionObject> {}

/**
 * @category Action
 */
export class MoveAction extends Action {
  constructor(object: MoveActionObject) {
    super(object)
    const { objects, redoObjects, undoObjects } = object
    this.objects = objects
    this.redoObjects = redoObjects
    this.undoObjects = undoObjects
  }

  objects: any[]

  redoObjects: any[]


  redoAction(): void {
    this.objects.splice(0, this.objects.length, ...this.redoObjects)
  }

  undoAction(): void {
    this.objects.splice(0, this.objects.length, ...this.undoObjects)
  }

  undoObjects: any[]
}

export const isMoveAction = (value: any): value is MoveAction => (
  value instanceof MoveAction
)
export function assertMoveAction(value: any, name?: string): asserts value is MoveAction {
  if (!isMoveAction(value)) errorsThrow(value, 'MoveAction', name)
}

