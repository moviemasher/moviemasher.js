import type { BooleanType, NumberType, Scalar, ScalarType, StringType, } from '@moviemasher/runtime-shared'
import type { EnvironmentKey, EnvironmentRecord } from './EnvironmentTypes.js'

import { scalar } from '@moviemasher/lib-shared'
import { EnvironmentGetArray, EnvironmentKeyPrefix, EnvRecord } from './EnvironmentConstants.js'

export const EnvironmentKeyApiPort: EnvironmentKey = `${EnvironmentKeyPrefix}API_PORT`
export const EnvironmentKeyApiHost: EnvironmentKey = `${EnvironmentKeyPrefix}API_HOST`
export const EnvironmentKeyApiKeypathType: EnvironmentKey = `${EnvironmentKeyPrefix}API_KEYPATH_TYPE`
export const EnvironmentKeyApiKeypathJob: EnvironmentKey = `${EnvironmentKeyPrefix}API_KEYPATH_JOB`
export const EnvironmentKeyApiDirCache: EnvironmentKey = `${EnvironmentKeyPrefix}API_DIR_CACHE`
export const EnvironmentKeyApiDirValid: EnvironmentKey = `${EnvironmentKeyPrefix}API_DIR_VALID`
export const EnvironmentKeyApiDirFilePrefix: EnvironmentKey = `${EnvironmentKeyPrefix}API_DIR_FILE_PREFIX`
export const EnvironmentKeyApiDirTemporary: EnvironmentKey = `${EnvironmentKeyPrefix}API_DIR_TEMPORARY`
export const EnvironmentKeyAppColumnOwner: EnvironmentKey = `${EnvironmentKeyPrefix}APP_COLUMN_OWNER`
export const EnvironmentKeyAppColumnSource: EnvironmentKey = `${EnvironmentKeyPrefix}APP_COLUMN_SOURCE`

const ServerEnvironmentDefaults: EnvironmentRecord = {
  [EnvironmentKeyApiPort]: '3000',
  [EnvironmentKeyApiHost]: 'localhost',
  [EnvironmentKeyApiKeypathType]: 'type',
  [EnvironmentKeyApiKeypathJob]: 'job',
  [EnvironmentKeyApiDirTemporary]: '/app/temporary',
  [EnvironmentKeyApiDirCache]: '/app/temporary/cache',
  [EnvironmentKeyApiDirValid]: 'shared',
  [EnvironmentKeyApiDirFilePrefix]: '/app/examples/express/public/assets',
  [EnvironmentKeyAppColumnOwner]: 'user_id',
  [EnvironmentKeyAppColumnSource]: 'object_id',
}

export function ServerEnvironmentGet(key: EnvironmentKey, type?: StringType): string
export function ServerEnvironmentGet(key: EnvironmentKey, type?: BooleanType): boolean
export function ServerEnvironmentGet(key: EnvironmentKey, type?: NumberType): number
export function ServerEnvironmentGet(key: EnvironmentKey, type?: ScalarType): Scalar {
  const { [key]: overrideScalar } = EnvRecord
  if (overrideScalar) return scalar(overrideScalar, type)

  const { [key]: environmentScalar } = process.env
  if (environmentScalar) return scalar(environmentScalar, type)

  return scalar(ServerEnvironmentDefaults[key] || '', type)
}

const ServerEnvironmentSet = (key: EnvironmentKey, value: Scalar): Scalar => {
  return EnvRecord[key] = value
}

export const RuntimeEnvironment = {
  get: ServerEnvironmentGet, 
  getArray: EnvironmentGetArray, 
  set: ServerEnvironmentSet
}
