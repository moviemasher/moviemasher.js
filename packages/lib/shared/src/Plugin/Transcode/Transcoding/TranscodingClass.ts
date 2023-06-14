import {UnknownRecord} from '@moviemasher/runtime-shared'
import {RequestableClass} from '../../../Base/Requestable/RequestableClass.js'
import {Transcoding, TranscodingObject, TranscodingType} from '@moviemasher/runtime-shared'


export class TranscodingClass extends RequestableClass implements Transcoding {
  constructor(object: TranscodingObject) {
    super(object)
    
    const { purpose } = object 
    if (purpose) this.purpose = purpose
  }

  kind = ''

  purpose = ''

  toJSON(): UnknownRecord {
    const { type, kind } = this
    return { ...super.toJSON(), type, kind }
  }

  declare type: TranscodingType

  unload() {
    delete this.request.response
  }
}