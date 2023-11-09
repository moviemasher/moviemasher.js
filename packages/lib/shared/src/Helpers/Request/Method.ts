import { errorThrow } from '@moviemasher/runtime-shared'

export type Method = 'GET' | 'POST' | 'PUT' | 'LIST'
export interface Methods extends Array<Method>{}

export const GET: Method = 'GET'
export const POST: Method = 'POST'
export const PUT: Method = 'PUT'
export const LIST: Method = 'LIST'

export const isMethod = (value: any): value is Method => {
  return [GET, POST, PUT, LIST].includes(value)
}
export function assertMethod(value: any, name?: string): asserts value is Method {
  if (!isMethod(value))
    errorThrow(value, 'Method', name)
}
