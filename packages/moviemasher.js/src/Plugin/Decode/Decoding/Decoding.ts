import { JsonRecord } from "../../../declarations"
import { Decoder } from "../../Decode/Decoder"
import { LoadedInfo } from "../Probe/Probe"

export interface DecodingData extends JsonRecord {
  raw: JsonRecord
}


export interface DecodingObject {
  type: Decoder
  info?: LoadedInfo
}

export type DecodingObjects = DecodingObject[]

export interface Decoding {
  type: Decoder
  info?: LoadedInfo
}

export type Decodings = Decoding[]
