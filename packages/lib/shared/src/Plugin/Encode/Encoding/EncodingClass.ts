import { RequestableClass } from '../../../Base/Requestable/RequestableClass.js'
import { Encoding, EncodingObject } from '@moviemasher/runtime-shared'


export class EncodingClass extends RequestableClass implements Encoding {
  constructor(object: EncodingObject) {
    super(object)
  }
}