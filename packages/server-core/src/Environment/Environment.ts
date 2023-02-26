import { isPopulatedString, StringRecord } from "@moviemasher/moviemasher.js"

export enum Environment {
  API_PORT = 'MOVIEMASHER_API_PORT',
  API_HOST = 'MOVIEMASHER_API_HOST',
  API_KEYPATH_TYPE = 'MOVIEMASHER_API_KEYPATH_TYPE',
  API_KEYPATH_JOB = 'MOVIEMASHER_API_KEYPATH_JOB',
  API_DIR_CACHE = 'MOVIEMASHER_API_DIR_CACHE',
  API_DIR_VALID = 'MOVIEMASHER_API_DIR_VALID',
  API_DIR_FILE_PREFIX = 'MOVIEMASHER_API_DIR_FILE_PREFIX',
  API_DIR_TEMPORARY = 'MOVIEMASHER_API_DIR_TEMPORARY',
  APP_COLUMN_OWNER = 'MOVIEMASHER_APP_COLUMN_OWNER',
  APP_COLUMN_SOURCE = 'MOVIEMASHER_APP_COLUMN_SOURCE',
}

const EnvironmentDefaults: StringRecord = {
  [Environment.API_PORT]: '3000',
  [Environment.API_HOST]: 'localhost',
  [Environment.API_KEYPATH_TYPE]: 'type',
  [Environment.API_KEYPATH_JOB]: 'job',

  [Environment.API_DIR_TEMPORARY]: './temporary',
  [Environment.API_DIR_CACHE]: './temporary/cache',
  [Environment.API_DIR_VALID]: 'shared',
  [Environment.API_DIR_FILE_PREFIX]: './workspaces/example-standalone/public/media',
  [Environment.APP_COLUMN_OWNER]: 'user_id',
  [Environment.APP_COLUMN_SOURCE]: 'object_id',
}

export const environment = (key: Environment): string => {
  const { env } = process
  const { [key]: value } = env
  if (isPopulatedString(value)) return value

  const { [key]: defaultValue } = EnvironmentDefaults
  return isPopulatedString(defaultValue) ? defaultValue : ''
}