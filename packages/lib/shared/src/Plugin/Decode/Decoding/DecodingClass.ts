import {UnknownRecord} from '@moviemasher/runtime-shared'
import {Decoding, DecodingObject, DecodingType} from './Decoding.js'


export class DecodingClass implements Decoding {
  constructor(object: DecodingObject) {
    const { data, type } = object
    this.type = type
    this.data = data
  }

  data?: UnknownRecord

  type: DecodingType
}