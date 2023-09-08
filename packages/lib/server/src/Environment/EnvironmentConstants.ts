import type { BooleanDataType, NumberDataType, Scalar, ScalarType, Scalars, StringDataType, Strings } from '@moviemasher/runtime-shared'
import type { Environment, EnvironmentKey, EnvironmentRecord } from './EnvironmentTypes.js'


import { scalar, scalars } from '@moviemasher/lib-shared'
import { STRING } from '@moviemasher/runtime-shared'

export const EnvironmentKeyPrefix = 'MOVIEMASHER_'
export const EnvironmentKeyUrlBase: EnvironmentKey = `${EnvironmentKeyPrefix}URL_BASE`
export const EnvironmentKeyLanguages: EnvironmentKey = `${EnvironmentKeyPrefix}LANGUAGES`


export const EnvRecord: EnvironmentRecord = {}
function EnvironmentGet(key: EnvironmentKey, type?: StringDataType): string
function EnvironmentGet(key: EnvironmentKey, type?: BooleanDataType): boolean
function EnvironmentGet(key: EnvironmentKey, type?: NumberDataType): number
function EnvironmentGet(key: EnvironmentKey, type: ScalarType = STRING): Scalar {
  return scalar(EnvRecord[key] || '', type)
}

export function EnvironmentGetArray(key: EnvironmentKey, type?: StringDataType): Strings
export function EnvironmentGetArray(key: EnvironmentKey, type: ScalarType = STRING): Scalars {
  return scalars(EnvRecord[key] || '', type)
}

export const EnvironmentSet = (key: EnvironmentKey, value: Scalar): Scalar => {
  return EnvRecord[key] = value
}

export const DefaultEnvironment: Environment = {
  get: EnvironmentGet, getArray: EnvironmentGetArray, set: EnvironmentSet
}
