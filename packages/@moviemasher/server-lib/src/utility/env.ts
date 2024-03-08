import type { BooleanType, NumberType, Scalar, ScalarType, Scalars, StringDataType, StringType, Strings } from '@moviemasher/shared-lib/types.js'
import type { EnvironmentKey, EnvironmentRecord, ServerEnvironment } from '../type/EnvironmentTypes.js'

import { $BOOLEAN, COMMA, $NUMBER, $STRING } from '@moviemasher/shared-lib/runtime.js'

export const $AppColumnOwner = 'MOVIEMASHER_APP_COLUMN_OWNER' as const
export const $AppColumnSource = 'MOVIEMASHER_APP_COLUMN_SOURCE' as const
export const $ApiKeypathJob = 'MOVIEMASHER_API_KEYPATH_JOB' as const
export const $ApiKeypathType = 'MOVIEMASHER_API_KEYPATH_TYPE' as const


export const $ApiDirCache = 'MOVIEMASHER_API_DIR_CACHE' as const
export const $ApiDirTemporary = 'MOVIEMASHER_API_DIR_TEMPORARY' as const
export const $ApiDirValid = 'MOVIEMASHER_API_DIR_VALID' as const
export const $Debug = 'MOVIEMASHER_DEBUG' as const
export const $DirRoot = 'MOVIEMASHER_DIR_ROOT' as const
export const $ExampleDataDir = 'MOVIEMASHER_EXAMPLE_DATA_DIR' as const
export const $ExampleDataFile = 'MOVIEMASHER_EXAMPLE_DATA_FILE' as const
export const $ExampleHost = 'MOVIEMASHER_EXAMPLE_HOST' as const
export const $ExamplePort = 'MOVIEMASHER_EXAMPLE_PORT' as const
export const $ExampleRoot = 'MOVIEMASHER_EXAMPLE_ROOT' as const
export const $FontDir = 'MOVIEMASHER_FONT_DIR' as const
export const $OutputRoot = 'MOVIEMASHER_OUTPUT_ROOT' as const
export const $RelativeRequestRoot = 'MOVIEMASHER_RELATIVE_REQUEST_ROOT' as const
export const $SharedAssets = 'MOVIEMASHER_SHARED_ASSETS' as const
export const $SharedUser = 'MOVIEMASHER_SHARED_USER' as const
export const $Version = 'MOVIEMASHER_VERSION' as const

const ENV_DEFAULTS: EnvironmentRecord = {
  [$ApiDirCache]: '/moviemasher/temporary/server-express/cache',
  [$ApiDirTemporary]: '/moviemasher/temporary/server-express/temporary',
  [$ApiDirValid]: '/moviemasher',
  [$ApiKeypathJob]: 'job',
  [$ApiKeypathType]: 'type',
  [$AppColumnOwner]: 'user_id',
  [$AppColumnSource]: 'object_id',
  [$DirRoot]: '/moviemasher',
  [$ExampleHost]: '0.0.0.0',
  [$ExamplePort]: '5775',
  [$ExampleRoot]: '/moviemasher/dist/public',
  [$ExampleDataFile]: '/moviemasher/temporary/server-express/sqlite.db',
  [$ExampleDataDir]: '/moviemasher/dist/sql',
  [$FontDir]: '/usr/share/fonts',
  [$OutputRoot]: '/moviemasher/temporary/server-express/assets',
  [$RelativeRequestRoot]: '/moviemasher/temporary/server-express',
  [$SharedAssets]: '/moviemasher/node_modules/@moviemasher/client-lib/dist/json/asset-objects.json',
  [$SharedUser]: 'shared-user',
  [$Version]: '5.2.0',
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
