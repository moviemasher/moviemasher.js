import type { Encoding, EncodingObject } from '@moviemasher/runtime-shared'

import { EncodingClass } from './EncodingClass.js'

export const encodingInstance = (object: EncodingObject): Encoding => {
  return new EncodingClass(object)
}
