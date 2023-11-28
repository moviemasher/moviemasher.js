import type { Ordered } from './Base.js'
import type { Scalar, Scalars } from './Core.js'
import type { TargetId } from './Select.js'
import type { Typed } from './Typed.js'

export interface Property extends Typed, Ordered {
  defaultValue?: Scalar
  max?: number
  min?: number
  name: string
  options?: Scalars
  step?: number
  targetId: TargetId
  tweens?: boolean
  undefinedAllowed?: boolean
}

export interface Properties extends Array<Property>{}

export interface PropertyRecord extends Record<string, Property>{}
