import { Transcoding, TranscodingObject } from "./Transcoding"
import { TranscodingClass } from "./TranscodingClass"

export const transcodingInstance = (object: TranscodingObject): Transcoding => {
  console.log('transcodingInstance', object)
  return new TranscodingClass(object)
}