import type { BooleanType, NumberType, Scalar, ScalarType, Scalars, StringDataType, StringType, Strings } from '@moviemasher/runtime-shared'
import type { EnvironmentKey, EnvironmentRecord, ServerEnvironment } from './EnvironmentTypes.js'

import { BOOLEAN, COMMA, NUMBER, STRING } from '@moviemasher/runtime-shared'

export const ENV_KEY = {
  ApiDirCache: 'MOVIEMASHER_API_DIR_CACHE',
  ApiDirTemporary: 'MOVIEMASHER_API_DIR_TEMPORARY',
  ApiDirValid: 'MOVIEMASHER_API_DIR_VALID',
  ApiKeypathJob: 'MOVIEMASHER_API_KEYPATH_JOB',
  ApiKeypathType: 'MOVIEMASHER_API_KEYPATH_TYPE',
  AppColumnOwner: 'MOVIEMASHER_APP_COLUMN_OWNER',
  AppColumnSource: 'MOVIEMASHER_APP_COLUMN_SOURCE',
  Debug: 'MOVIEMASHER_DEBUG',
  DirRoot: 'MOVIEMASHER_DIR_ROOT',
  ExampleHost: 'MOVIEMASHER_EXAMPLE_HOST',
  ExamplePort: 'MOVIEMASHER_EXAMPLE_PORT',
  ExampleRoot: 'MOVIEMASHER_EXAMPLE_ROOT',
  Languages: 'MOVIEMASHER_LANGUAGES',
  OutputRoot: 'MOVIEMASHER_OUTPUT_ROOT',
  RelativeRequestRoot: 'MOVIEMASHER_RELATIVE_REQUEST_ROOT',
  SharedAssets: 'MOVIEMASHER_SHARED_ASSETS',
  SharedUser: 'MOVIEMASHER_SHARED_USER',
  Version: 'MOVIEMASHER_VERSION',
} as const

const ENV_DEFAULTS: EnvironmentRecord = {
  [ENV_KEY.ApiDirCache]: '/app/temporary/cache',
  [ENV_KEY.ApiDirTemporary]: '/app/temporary',
  [ENV_KEY.ApiDirValid]: '/app',
  [ENV_KEY.ApiKeypathJob]: 'job',
  [ENV_KEY.ApiKeypathType]: 'type',
  [ENV_KEY.AppColumnOwner]: 'user_id',
  [ENV_KEY.AppColumnSource]: 'object_id',
  [ENV_KEY.DirRoot]: '/app/',
  [ENV_KEY.ExampleHost]: 'localhost',
  [ENV_KEY.ExamplePort]: '3000',
  [ENV_KEY.ExampleRoot]: '/app/examples/express/public',
  [ENV_KEY.OutputRoot]: '/app/examples/express/public/assets',
  [ENV_KEY.RelativeRequestRoot]: '/app/examples/express/public/assets',
  [ENV_KEY.SharedAssets]: '',
  [ENV_KEY.SharedUser]: 'shared-user',
  [ENV_KEY.Version]: '5.2.0',
} as const

const ENV_RECORD: EnvironmentRecord = {}

function scalar(value: Scalar, type: BooleanType): boolean
function scalar(value: Scalar, type: NumberType): number
function scalar(value: Scalar, type: StringType): string
function scalar(value: Scalar, type?: ScalarType): Scalar
function scalar(value: Scalar, type?: ScalarType) {
  switch (type) {
    case BOOLEAN: return Boolean(value)
    case NUMBER: return Number(value)
    case STRING: return String(value)
  }
  return value
}

function scalars(value: Scalar, type: StringType): Strings
function scalars(value: Scalar, type: ScalarType): Scalars
function scalars(value: Scalar, _?: ScalarType): Scalars {
  const stringValue = String(value)
  const split = stringValue.split(COMMA)
  return split.filter(Boolean)
}

function environmentGetArray(key: EnvironmentKey, type?: StringDataType): Strings
function environmentGetArray(key: EnvironmentKey, type: ScalarType = STRING): Scalars {
  return scalars(environmentGet(key) || '', type)
}

function environmentGet(key: EnvironmentKey, type?: StringType): string
function environmentGet(key: EnvironmentKey, type?: BooleanType): boolean
function environmentGet(key: EnvironmentKey, type?: NumberType): number
function environmentGet(key: EnvironmentKey, type?: ScalarType): Scalar {
  const { [key]: overrideScalar } = ENV_RECORD
  if (overrideScalar) return scalar(overrideScalar, type)

  const { [key]: environmentScalar } = process.env
  if (environmentScalar) return scalar(environmentScalar, type)

  return scalar(ENV_DEFAULTS[key] || '', type)
}

const environmentSet = (key: EnvironmentKey, value: Scalar): Scalar => {
  return ENV_RECORD[key] = value
}

export const ENV: ServerEnvironment = {
  get: environmentGet, 
  getArray: environmentGetArray, 
  set: environmentSet
}
