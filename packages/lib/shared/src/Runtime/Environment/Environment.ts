import type { 
  BooleanDataType, NumberDataType, Scalar, ScalarType, Scalars, StringDataType, 
  Strings 
} from '@moviemasher/runtime-shared'

import { TypeString } from "@moviemasher/runtime-shared"
import { scalar, scalars } from '../../Utility/ScalarFunctions.js'

export interface Environment {
  get: EnvironmentGetter
  getArray: EnvironmentArrayGetter
  set: EnvironmentSetter
}

export type EnvironmentKey = `MOVIEMASHER_${string}`

export const EnvironmentKeyPrefix = 'MOVIEMASHER_'
export const EnvironmentKeyUrlBase: EnvironmentKey = `${EnvironmentKeyPrefix}URL_BASE`
export const EnvironmentKeyLanguages: EnvironmentKey = `${EnvironmentKeyPrefix}LANGUAGES`

export type EnvironmentRecord = Record<EnvironmentKey, Scalar>
export const EnvironmentRecord: EnvironmentRecord = {}

function EnvironmentGet(key: EnvironmentKey, type?: StringDataType): string
function EnvironmentGet(key: EnvironmentKey, type?: BooleanDataType): boolean
function EnvironmentGet(key: EnvironmentKey, type?: NumberDataType): number
function EnvironmentGet(key: EnvironmentKey, type: ScalarType = TypeString): Scalar {
  return scalar(EnvironmentRecord[key] || '', type)
}

export function EnvironmentGetArray(key: EnvironmentKey, type?: StringDataType): Strings
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
