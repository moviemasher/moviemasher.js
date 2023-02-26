import { UnknownRecord } from "../../declarations";
import { TranscodingType, assertTranscodingType } from "../../Setup/Enums";
import { RequestableClass } from "../../Base/Requestable/RequestableClass";
import { Transcoding, TranscodingObject } from "./Transcoding";


export class TranscodingClass extends RequestableClass implements Transcoding {
  constructor(object: TranscodingObject) {
    super(object)
    
    const { purpose } = object 
    if (purpose) this.purpose = purpose
    assertTranscodingType(this.type)
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