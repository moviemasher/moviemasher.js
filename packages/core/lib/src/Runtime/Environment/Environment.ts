import type { 
   ScalarType, StringType, BooleanType, NumberType,
} from '../../Utility/Scalar.js'
import type {Scalar, Scalars, Strings} from '../../Types/Core.js'

import { 
  scalar, scalars, TypeString 
} from '../../Utility/Scalar.js'

export interface Environment {
  get: EnvironmentGetter
  getArray: EnvironmentArrayGetter
  set: EnvironmentSetter
}
export type EnvironmentKey = `MOVIEMASHER_${string}`

export const EnvironmentKeyPrefix = 'MOVIEMASHER_'
export const EnvironmentKeyUrlBase: EnvironmentKey = `${EnvironmentKeyPrefix}URL_BASE`
export const EnvironmentKeySupportsLoadSvg: EnvironmentKey = `${EnvironmentKeyPrefix}SUPPORTS_SVG_LOAD`
export const EnvironmentKeyLanguages: EnvironmentKey = `${EnvironmentKeyPrefix}LANGUAGES`

export type EnvironmentRecord = Record<EnvironmentKey, Scalar>
export const EnvironmentRecord: EnvironmentRecord = {}

function EnvironmentGet(key: EnvironmentKey, type?: StringType): string
function EnvironmentGet(key: EnvironmentKey, type?: BooleanType): boolean
function EnvironmentGet(key: EnvironmentKey, type?: NumberType): number
function EnvironmentGet(key: EnvironmentKey, type: ScalarType = TypeString): Scalar {
  return scalar(EnvironmentRecord[key] || '', type)
}

export function EnvironmentGetArray(key: EnvironmentKey, type?: StringType): Strings
export function EnvironmentGetArray(key: EnvironmentKey, type: ScalarType = TypeString): Scalars {
  return scalars(EnvironmentRecord[key] || '', type)
}

export const EnvironmentSet = (key: EnvironmentKey, value: Scalar): Scalar => { 
  return EnvironmentRecord[key] = value 
}

export const DefaultEnvironment: Environment = { 
  get: EnvironmentGet, getArray: EnvironmentGetArray, set: EnvironmentSet
}

export type EnvironmentArrayGetter = typeof EnvironmentGetArray

export type EnvironmentGetter = typeof EnvironmentGet

export type EnvironmentSetter = typeof EnvironmentSet

