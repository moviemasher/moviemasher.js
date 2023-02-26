import { UnknownRecord } from "../../../declarations";
import { DecodingType } from "../Decoder";
import { Decoding, DecodingObject } from "./Decoding";


export class DecodingClass implements Decoding {
  constructor(object: DecodingObject) {
    const { data, type } = object
    this.type = type
    this.data = data
  }
  data?: UnknownRecord

  type: DecodingType
}