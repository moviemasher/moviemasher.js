import { Scalar, Scalars, Strings } from "../../Types/Core"
import { 
  BooleanType, NumberType, scalar, scalars, ScalarType, StringType 
} from "../../Utility/Scalar"

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
function EnvironmentGet(key: EnvironmentKey, type: ScalarType = StringType): Scalar {
  return scalar(EnvironmentRecord[key] || '', type)
}

export function EnvironmentGetArray(key: EnvironmentKey, type?: StringType): Strings
export function EnvironmentGetArray(key: EnvironmentKey, type: ScalarType = StringType): Scalars {
  return scalars(EnvironmentRecord[key] || '', type)
}

const EnvironmentSet = (key: EnvironmentKey, value: Scalar): Scalar => { 
  return EnvironmentRecord[key] = value 
}

export const DefaultEnvironment: Environment = { 
  get: EnvironmentGet, getArray: EnvironmentGetArray, set: EnvironmentSet
}

export type EnvironmentArrayGetter = typeof EnvironmentGetArray

export type EnvironmentGetter = typeof EnvironmentGet

export type EnvironmentSetter = typeof EnvironmentSet

