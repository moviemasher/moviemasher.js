import { UnknownRecord } from "../../../Types/Core"
import { Decoding, DecodingObject, DecodingType } from "./Decoding"


export class DecodingClass implements Decoding {
  constructor(object: DecodingObject) {
    const { data, type } = object
    this.type = type
    this.data = data
  }

  data?: UnknownRecord

  type: DecodingType
}