import type { Property, PropertyId, Scalar, SelectorType, TimeRange } from '@moviemasher/runtime-shared'

export interface PropertiedChangeHandler {
  (property: string, value?: Scalar): void
}

export interface SelectedProperty {
  propertyId: PropertyId
  property: Property
  changeHandler: PropertiedChangeHandler
  value?: Scalar
  frame?: number
}

export type SelectedProperties = SelectedProperty[]

export type SelectedPropertyRecord = Record<string, SelectedProperty>
