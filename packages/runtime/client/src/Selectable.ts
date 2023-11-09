import type { Propertied, PropertyId, Scalar, ScalarsById, SelectorType } from '@moviemasher/runtime-shared'
import type { ChangeActionObject } from './ActionTypes.js'

export interface Selectable extends Propertied { 
  changeScalar(propertyId: PropertyId, scalar?: Scalar): ChangeActionObject
  changeScalars(scalars: ScalarsById): ChangeActionObject
}

export interface Selectables extends Array<Selectable>{}

export interface SelectorTypesObject extends Record<string, SelectorType[]> {}
