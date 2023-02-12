import { UnknownRecord } from "../../declarations";
import { LoadedInfo } from "../../Load/Loader";
import { Requestable, RequestableObject } from "../../Base/Requestable/Requestable";


export interface DecodingObject {
  info?: LoadedInfo
}

export type DecodingObjects = DecodingObject[]

export interface Decoding {
  info?: LoadedInfo
}

export type Decodings = Decoding[]
