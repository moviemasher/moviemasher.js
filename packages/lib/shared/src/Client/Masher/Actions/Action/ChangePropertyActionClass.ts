import type { Scalar, PropertyIds } from '@moviemasher/runtime-shared'
import type { ChangePropertyActionObject, ChangePropertyAction, ChangeTarget } from './ActionTypes.js'

import { DotChar, isDefined } from '@moviemasher/runtime-shared'
import { ActionClass } from "./ActionClass.js"
import { isPropertyId } from '@moviemasher/runtime-client'

/**
 * @category Action
 */
export class ChangePropertyActionClass extends ActionClass implements ChangePropertyAction {
  constructor(object: ChangePropertyActionObject) {
    super(object)
    const { property, redoValue, target, undoValue } = object
    this.property = property
    this.redoValue = redoValue
    this.target = target
    this.undoValue = undoValue
  }
  override get affects(): PropertyIds { 
    const { target, property } = this
    const propertyType = [target.targetId, property].join(DotChar)
    const types: PropertyIds = []
    if (isPropertyId(propertyType)) types.push(propertyType)
    return types
  }

  property: string

  redoAction(): void {
    this.target.setValue(this.property, this.redoValue)
  }

  redoValue?: Scalar

  protected get redoValueNumber(): number { return Number(this.redoValue) }

  target: ChangeTarget

  undoValue?: Scalar

  protected get undoValueNumber(): number { return Number(this.undoValue) }

  undoAction(): void {
    this.target.setValue(this.property, this.undoValue)
  }

  updateAction(object: ChangePropertyActionObject): void {
    // console.log(this.constructor.name, 'updateAction', object)
    const { redoValue } = object
    this.redoValue = redoValue
    this.redo()
  }

  get value(): Scalar | undefined { return this.done ? this.redoValue : this.undoValue }

  get valueNumber(): number | undefined { 
    const { value } = this
    return isDefined(value) ? Number(value) : undefined
  }
}
