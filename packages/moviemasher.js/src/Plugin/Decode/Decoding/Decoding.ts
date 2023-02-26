import { Identified } from "../../../Base/Identified"
import { UnknownRecord } from "../../../declarations"
import { DecodingType } from "../../Decode/Decoder"

export interface DecodingObject {
  type: DecodingType
  data?: UnknownRecord
}

export type DecodingObjects = DecodingObject[]

export interface Decoding extends Partial<Identified> {
  type: DecodingType
  data?: UnknownRecord
}

export type Decodings = Decoding[]
