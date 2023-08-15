import type { Encoding, EncodingObject } from '@moviemasher/runtime-client'

import { RequestableClass } from '../../../Base/Requestable/RequestableClass.js'

export class EncodingClass extends RequestableClass implements Encoding {
  constructor(object: EncodingObject) {
    super(object)
  }
}
