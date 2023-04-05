import {Transcoding, TranscodingObject} from './Transcoding.js'
import {TranscodingClass} from './TranscodingClass.js'

export const transcodingInstance = (object: TranscodingObject): Transcoding => {
  // console.log('transcodingInstance', object)
  return new TranscodingClass(object)
}