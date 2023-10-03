import type { Transcoding, TranscodingObject, TranscodingType, UnknownRecord } from '@moviemasher/runtime-shared'

import { RequestableClass } from '../Base/Requestable/RequestableClass.js'

export class TranscodingClass extends RequestableClass implements Transcoding {
  declare type: TranscodingType

  unload() {
    delete this.request.response
  }
}