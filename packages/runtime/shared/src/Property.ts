import { Ordered } from './Base.js'
import type { Scalar, Scalars } from './Core.js'
import type { TargetId } from './Select.js'
import type { Typed } from './Typed.js'

export interface Property extends Typed, Ordered {
  name: string
  targetId: TargetId
  defaultValue?: Scalar
  max?: number
  min?: number
  options?: Scalars
  step?: number
  undefinedAllowed?: boolean
  tweens?: boolean
}

export interface Properties extends Array<Property>{}

export type PropertyRecord = Record<string, Property>
