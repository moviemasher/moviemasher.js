import type { Scalar, Scalars } from './Core.js'
import type { DataType } from './DataType.js'
import type { DataGroup } from './DataGroup.js'

export interface PropertyBase {
  custom?: boolean
  defaultValue: Scalar
  group?: DataGroup
  max?: number
  min?: number
  name: string
  step?: number
  tweenable?: boolean
  options?: Scalars
}

export interface Property extends PropertyBase {
  type: DataType
}

export type Properties = Property[]

export interface PropertyObject extends Partial<PropertyBase> {
  type? : DataType | string
}
