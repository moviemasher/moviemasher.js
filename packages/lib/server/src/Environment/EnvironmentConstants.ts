import type { BooleanType, NumberType, Scalar, ScalarType, Scalars, StringDataType, StringType, Strings } from '@moviemasher/runtime-shared'
import type { EnvironmentKey, EnvironmentRecord, ServerEnvironment } from './EnvironmentTypes.js'

import { COMMA } from '@moviemasher/lib-shared'
import { BOOLEAN, NUMBER, STRING } from '@moviemasher/runtime-shared'

export const ENV = {
  ExamplePort: 'MOVIEMASHER_EXAMPLE_PORT',
  ExampleHost: 'MOVIEMASHER_EXAMPLE_HOST',
  ExampleRoot: 'MOVIEMASHER_EXAMPLE_ROOT',
  SharedAssets: 'MOVIEMASHER_SHARED_ASSETS',
  SharedUser: 'MOVIEMASHER_SHARED_USER',
  ApiKeypathType: 'MOVIEMASHER_API_KEYPATH_TYPE',
  ApiKeypathJob: 'MOVIEMASHER_API_KEYPATH_JOB',


  ApiDirCache: 'MOVIEMASHER_API_DIR_CACHE',
  ApiDirValid: 'MOVIEMASHER_API_DIR_VALID',
  
  AppColumnOwner: 'MOVIEMASHER_APP_COLUMN_OWNER',
  Debug: 'MOVIEMASHER_DEBUG',
  AppColumnSource: 'MOVIEMASHER_APP_COLUMN_SOURCE',
  Languages: 'MOVIEMASHER_LANGUAGES',
  ApiDirTemporary: 'MOVIEMASHER_API_DIR_TEMPORARY',

  DirRoot: 'MOVIEMASHER_DIR_ROOT',

  RelativeRequestRoot: 'MOVIEMASHER_RELATIVE_REQUEST_ROOT',

  OutputRoot: 'MOVIEMASHER_OUTPUT_ROOT',

  Version: 'MOVIEMASHER_VERSION',

} as const

const ENVIRONMENT_DEFAULTS: EnvironmentRecord = {
  [ENV.ExamplePort]: '3000',
  [ENV.ExampleHost]: 'localhost',
  [ENV.ExampleRoot]: '/app/examples/express/public',
  [ENV.SharedAssets]: '',
  [ENV.ApiKeypathType]: 'type',
  [ENV.ApiKeypathJob]: 'job',
  [ENV.AppColumnOwner]: 'user_id',
  [ENV.AppColumnSource]: 'object_id',
  [ENV.SharedUser]: 'shared-user',

  [ENV.Version]: '5.1.2',
  [ENV.DirRoot]: '/app/',
  [ENV.ApiDirTemporary]: '/app/temporary',

  [ENV.ApiDirCache]: '/app/temporary/cache',
  [ENV.ApiDirValid]: '/app',
  [ENV.RelativeRequestRoot]: '/app/examples/express/public/assets',
  [ENV.OutputRoot]: '/app/examples/express/public/assets',
} as const

const ENVIRONMENT_RECORD: EnvironmentRecord = {}

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
