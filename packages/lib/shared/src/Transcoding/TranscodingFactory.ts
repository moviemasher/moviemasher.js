import type { Transcoding, TranscodingObject } from '@moviemasher/runtime-shared'

import { TranscodingClass } from './TranscodingClass.js'

export const transcodingInstance = (object: TranscodingObject): Transcoding => {
  // console.log('transcodingInstance', object)
  return { id: '', ...object } // new TranscodingClass(object)
}