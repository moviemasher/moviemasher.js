import { isPopulatedString, StringObject } from "@moviemasher/moviemasher.js"

export enum Environment {
  API_PORT = 'MOVIEMASHER_API_PORT',
  API_HOST = 'MOVIEMASHER_API_HOST',
  API_KEYPATH_TYPE = 'MOVIEMASHER_API_KEYPATH_TYPE',
  API_KEYPATH_JOB = 'MOVIEMASHER_API_KEYPATH_JOB',
  API_DIR_CACHE = 'MOVIEMASHER_API_DIR_CACHE',
  API_DIR_VALID = 'MOVIEMASHER_API_DIR_VALID',
  API_DIR_FILE_PREFIX = 'MOVIEMASHER_API_DIR_FILE_PREFIX',
  API_DIR_TEMPORARY = 'MOVIEMASHER_API_DIR_TEMPORARY',
}

export const environmentDefaults: StringObject = {
  [Environment.API_PORT]: '3000',
  [Environment.API_HOST]: 'localhost',
  [Environment.API_KEYPATH_TYPE]: 'type',
  [Environment.API_KEYPATH_JOB]: 'job',

  [Environment.API_DIR_TEMPORARY]: './temporary',
  [Environment.API_DIR_CACHE]: './temporary/cache',
  [Environment.API_DIR_VALID]: 'shared',
  [Environment.API_DIR_FILE_PREFIX]: './images/standalone/public/media',
}

export const environment = (key: Environment): string => {
  const { env } = process
  const { [key]: value } = env
  if (isPopulatedString(value)) return value

  const { [key]: defaultValue } = env
  if (isPopulatedString(defaultValue)) return defaultValue

  return ''
}