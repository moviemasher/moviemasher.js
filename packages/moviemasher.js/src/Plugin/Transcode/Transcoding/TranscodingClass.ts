import { UnknownRecord } from "../../../Types/Core"
import { RequestableClass } from "../../../Base/Requestable/RequestableClass"
import { Transcoding, TranscodingObject, TranscodingType } from "./Transcoding"


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