import type { MediaRequest } from './Media.js'

import { isIdentified, errorThrow, isObject} from '@moviemasher/lib-shared'


export const isMediaRequest = (value: any): value is MediaRequest => {
  return isIdentified(value) && 'input' in value && isObject(value.input)
}

export function assertMediaRequest(value: any): asserts value is MediaRequest {
  if (!isMediaRequest(value)) errorThrow(value, 'MediaRequest')
}
