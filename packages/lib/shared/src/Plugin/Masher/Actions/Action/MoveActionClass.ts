import type { MoveActionObject } from './Action.js'
import { ActionClass } from "./ActionClass.js"


/**
 * @category Action
 */
export class MoveActionClass extends ActionClass {
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
