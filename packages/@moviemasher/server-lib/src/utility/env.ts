import type { BooleanType, NumberType, Scalar, ScalarType, Scalars, StringDataType, StringType, Strings } from '@moviemasher/shared-lib/types.js'
import type { EnvironmentKey, EnvironmentRecord, ServerEnvironment } from '../type/EnvironmentTypes.js'

import { $BOOLEAN, COMMA, $NUMBER, $STRING } from '@moviemasher/shared-lib/runtime.js'

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
  ExampleDataFile: 'MOVIEMASHER_EXAMPLE_DATA_FILE',
  ExampleDataDir: 'MOVIEMASHER_EXAMPLE_DATA_DIR', 
  FontDir: 'MOVIEMASHER_FONT_DIR',
  Languages: 'MOVIEMASHER_LANGUAGES',
  OutputRoot: 'MOVIEMASHER_OUTPUT_ROOT',
  RelativeRequestRoot: 'MOVIEMASHER_RELATIVE_REQUEST_ROOT',
  SharedAssets: 'MOVIEMASHER_SHARED_ASSETS',
  SharedUser: 'MOVIEMASHER_SHARED_USER',
  Version: 'MOVIEMASHER_VERSION',
} as const

const ENV_DEFAULTS: EnvironmentRecord = {
  [ENV_KEY.ApiDirCache]: '/app/temporary/server-express/cache',
  [ENV_KEY.ApiDirTemporary]: '/app/temporary/server-express',
  [ENV_KEY.ApiDirValid]: '/app',
  [ENV_KEY.ApiKeypathJob]: 'job',
  [ENV_KEY.ApiKeypathType]: 'type',
  [ENV_KEY.AppColumnOwner]: 'user_id',
  [ENV_KEY.AppColumnSource]: 'object_id',
  [ENV_KEY.DirRoot]: '/app/',
  [ENV_KEY.ExampleHost]: 'localhost',
  [ENV_KEY.ExamplePort]: '8570',
  [ENV_KEY.ExampleRoot]: '/app/packages/@moviemasher/server-express/dist/public',
  [ENV_KEY.ExampleDataFile]: '/app/temporary/server-express/sqlite.db',
  [ENV_KEY.ExampleDataDir]: '/app/packages/@moviemasher/server-express/dev/data-migrations',
  [ENV_KEY.FontDir]: '/usr/share/fonts',
  [ENV_KEY.OutputRoot]: '/app/temporary/server-express/assets',
  [ENV_KEY.RelativeRequestRoot]: '/app/temporary/server-express',
  [ENV_KEY.SharedAssets]: '/app/packages/@moviemasher/client-lib/dist/json/asset-objects.json',
  [ENV_KEY.SharedUser]: 'shared-user',
  [ENV_KEY.Version]: '5.2.0',
} as const

const ENV_RECORD: EnvironmentRecord = {}

function scalarOfType(value: Scalar, type: BooleanType): boolean
function scalarOfType(value: Scalar, type: NumberType): number
function scalarOfType(value: Scalar, type: StringType): string
function scalarOfType(value: Scalar, type?: ScalarType): Scalar
function scalarOfType(value: Scalar, type?: ScalarType) {
  switch (type) {
    case $BOOLEAN: return Boolean(value)
    case $NUMBER: return Number(value)
    case $STRING: return String(value)
  }
  return value
}

function scalarsOfType(value: Scalar, type: StringType): Strings
function scalarsOfType(value: Scalar, type: ScalarType): Scalars
function scalarsOfType(value: Scalar, _?: ScalarType): Scalars {
  const stringValue = String(value)
  const split = stringValue.split(COMMA)
  return split.filter(Boolean)
}

function environmentGetArray(key: EnvironmentKey, type?: StringDataType): Strings
function environmentGetArray(key: EnvironmentKey, type: ScalarType = $STRING): Scalars {
  return scalarsOfType(environmentGet(key) || '', type)
}

function environmentGet(key: EnvironmentKey, type?: StringType): string
function environmentGet(key: EnvironmentKey, type?: BooleanType): boolean
function environmentGet(key: EnvironmentKey, type?: NumberType): number
function environmentGet(key: EnvironmentKey, type?: ScalarType): Scalar {
  const { [key]: overrideScalar } = ENV_RECORD
  if (overrideScalar) return scalarOfType(overrideScalar, type)

  const { [key]: environmentScalar } = process.env
  if (environmentScalar) return scalarOfType(environmentScalar, type)

  return scalarOfType(ENV_DEFAULTS[key] || '', type)
}

const environmentSet = (key: EnvironmentKey, value: Scalar): Scalar => {
  return ENV_RECORD[key] = value
}

export const ENV: ServerEnvironment = {
  get: environmentGet, 
  getArray: environmentGetArray, 
  set: environmentSet
}
