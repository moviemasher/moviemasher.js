import type { BooleanType, NumberType, Scalar, ScalarType, Scalars, StringDataType, StringType, Strings, } from '@moviemasher/runtime-shared'
import type { EnvironmentKey, EnvironmentRecord, ServerEnvironment } from './EnvironmentTypes.js'

import { scalar, scalars } from '@moviemasher/lib-shared'
import { STRING } from '@moviemasher/runtime-shared'

export const ENV = {
  ApiPort: 'MOVIEMASHER_API_PORT',
  ApiHost: 'MOVIEMASHER_API_HOST',
  ApiKeypathType: 'MOVIEMASHER_API_KEYPATH_TYPE',
  ApiKeypathJob: 'MOVIEMASHER_API_KEYPATH_JOB',
  ApiDirCache: 'MOVIEMASHER_API_DIR_CACHE',
  ApiDirValid: 'MOVIEMASHER_API_DIR_VALID',
  ApiDirFilePrefix: 'MOVIEMASHER_API_DIR_FILE_PREFIX',
  ApiDirTemporary: 'MOVIEMASHER_API_DIR_TEMPORARY',
  AppColumnOwner: 'MOVIEMASHER_APP_COLUMN_OWNER',
  AppColumnSource: 'MOVIEMASHER_APP_COLUMN_SOURCE',
  UrlBase: 'MOVIEMASHER_URL_BASE',
  Languages: 'MOVIEMASHER_LANGUAGES',
  DirRoot: 'MOVIEMASHER_DIR_ROOT',
} as const

const ENVIRONMENT_DEFAULTS: EnvironmentRecord = {
  [ENV.ApiPort]: '3000',
  [ENV.ApiHost]: 'localhost',
  [ENV.ApiKeypathType]: 'type',
  [ENV.ApiKeypathJob]: 'job',
  [ENV.ApiDirTemporary]: '/app/temporary',
  [ENV.ApiDirCache]: '/app/temporary/cache',
  [ENV.ApiDirValid]: 'shared',
  [ENV.ApiDirFilePrefix]: '/app/examples/express/public/assets',
  [ENV.AppColumnOwner]: 'user_id',
  [ENV.AppColumnSource]: 'object_id',
  [ENV.DirRoot]: '/app/',
}

const ENVIRONMENT_RECORD: EnvironmentRecord = {}

function environmentGetArray(key: EnvironmentKey, type?: StringDataType): Strings
function environmentGetArray(key: EnvironmentKey, type: ScalarType = STRING): Scalars {
  return scalars(ENVIRONMENT_RECORD[key] || '', type)
}

function environmentGet(key: EnvironmentKey, type?: StringType): string
function environmentGet(key: EnvironmentKey, type?: BooleanType): boolean
function environmentGet(key: EnvironmentKey, type?: NumberType): number
function environmentGet(key: EnvironmentKey, type?: ScalarType): Scalar {
  const { [key]: overrideScalar } = ENVIRONMENT_RECORD
  if (overrideScalar) return scalar(overrideScalar, type)

  const { [key]: environmentScalar } = process.env
  if (environmentScalar) return scalar(environmentScalar, type)

  return scalar(ENVIRONMENT_DEFAULTS[key] || '', type)
}

const environmentSet = (key: EnvironmentKey, value: Scalar): Scalar => {
  return ENVIRONMENT_RECORD[key] = value
}

export const ENVIRONMENT: ServerEnvironment = {
  get: environmentGet, 
  getArray: environmentGetArray, 
  set: environmentSet
}
