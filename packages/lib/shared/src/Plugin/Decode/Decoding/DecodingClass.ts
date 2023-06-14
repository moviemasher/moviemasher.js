import {UnknownRecord} from '@moviemasher/runtime-shared'
import {Decoding, DecodingObject, DecodingType} from '@moviemasher/runtime-shared'


export class DecodingClass implements Decoding {
  constructor(object: DecodingObject) {
    const { data, type } = object
    this.type = type
    this.data = data
  }

  data?: UnknownRecord

  type: DecodingType
}