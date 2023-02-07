import { UnknownObject } from "../../declarations";
import { LoadedInfo } from "../../Loader/Loader";
import { Requestable, RequestableObject } from "../../Base/Requestable/Requestable";


export interface DecodingObject {
  info?: LoadedInfo
}

export type DecodingObjects = DecodingObject[]

export interface Decoding {
  info?: LoadedInfo
}

export type Decodings = Decoding[]
