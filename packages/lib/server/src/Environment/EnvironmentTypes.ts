import type { BooleanDataType, NumberDataType, Scalar, StringDataType, Strings } from '@moviemasher/runtime-shared'

export interface EnvironmentArrayGetter {
  (key: EnvironmentKey, type?: StringDataType): Strings
}

export interface EnvironmentGetter {
  (key: EnvironmentKey, type?: StringDataType): string
  (key: EnvironmentKey, type?: BooleanDataType): boolean
  (key: EnvironmentKey, type?: NumberDataType): number
}

export interface EnvironmentSetter {
  (key: EnvironmentKey, value: Scalar): Scalar
}

export interface ServerEnvironment {
  get: EnvironmentGetter
  getArray: EnvironmentArrayGetter
  set: EnvironmentSetter
}

export type EnvironmentKey = `MOVIEMASHER_${string}`

export type EnvironmentRecord = Record<EnvironmentKey, Scalar>
