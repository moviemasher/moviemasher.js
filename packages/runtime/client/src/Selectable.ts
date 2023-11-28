import type { Propertied, PropertyId, Scalar, ScalarsById, SelectorType } from '@moviemasher/runtime-shared'
import type { ChangeEditObject } from './EditTypes.js'

export interface Selectable extends Propertied { 
  changeScalar(propertyId: PropertyId, scalar?: Scalar): ChangeEditObject
  changeScalars(scalars: ScalarsById): ChangeEditObject
}

export interface Selectables extends Array<Selectable>{}

export interface SelectorTypesObject extends Record<string, SelectorType[]> {}
