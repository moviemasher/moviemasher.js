import type { ChangePropertyAction, ChangePropertyActionObject } from '@moviemasher/runtime-client'
import type { PropertyId, PropertyIds, Scalar } from '@moviemasher/runtime-shared'

import { isDefined } from '@moviemasher/runtime-shared'
import { ChangeActionClass } from './ChangeActionClass.js'

export class ChangePropertyActionClass extends ChangeActionClass implements ChangePropertyAction {
  constructor(object: ChangePropertyActionObject) {
    const { property, redoValue, undoValue } = object

    super(object)
    this.redoValue = redoValue
    this.undoValue = undoValue
    this.property = property
  }

  override get affects(): PropertyIds { 
    return [this.property]
  }

  property: PropertyId

  override redoAction() : void {
    const { target, redoValue, property } = this
    target.setValue(property, redoValue)
  }

  redoValue?: Scalar

  protected get redoValueNumber(): number { return Number(this.redoValue) }

  override undoAction() : void {
    const { target, undoValue, property } = this
    target.setValue(property, undoValue)
  } 

  undoValue?: Scalar

  protected get undoValueNumber(): number { return Number(this.undoValue) }

  override updateAction(object: ChangePropertyActionObject) : void {
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
