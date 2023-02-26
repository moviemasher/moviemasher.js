import { isPopulatedString, isString, ValueRecord, Value, isNumber } from "@moviemasher/moviemasher.js"

export enum Config {
  SUPABASE_PROJECT_URL = 'MOVIEMASHER_SUPABASE_PROJECT_URL',
  SUPABASE_ANON_KEY = 'MOVIEMASHER_SUPABASE_ANON_KEY',
  SUPABASE_BUCKET = 'MOVIEMASHER_SUPABASE_BUCKET',
  SUPABASE_EXPIRES = 'MOVIEMASHER_SUPABASE_EXPIRES',
  SUPABASE_TABLE = 'MOVIEMASHER_SUPABASE_TABLE',
}

const ConfigDefaults: ValueRecord = {
  [Config.SUPABASE_PROJECT_URL]: '',
  [Config.SUPABASE_BUCKET]: 'media',
  [Config.SUPABASE_TABLE]: 'media',
  [Config.SUPABASE_ANON_KEY]: '',
  [Config.SUPABASE_EXPIRES]: 60,
}

export const config = (key: Config, value?: Value): Value => {
  if (isString(value) || isNumber(value)) ConfigDefaults[key] = value
  return ConfigDefaults[key] || ''
}