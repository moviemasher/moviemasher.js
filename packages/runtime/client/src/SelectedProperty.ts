import type { SelectorType } from "./SelectorType.js"
import type { Property, Scalar } from '@moviemasher/runtime-shared'

export interface PropertiedChangeHandler {
  (property: string, value: Scalar): void
}

export interface Selected {
  selectType: SelectorType
  name?: string
}

export interface SelectedProperty extends Selected {
  property: Property
  changeHandler: PropertiedChangeHandler
  value: Scalar
}

export type SelectedProperties = SelectedProperty[]

export type SelectedPropertyObject = Record<string, SelectedProperty>
