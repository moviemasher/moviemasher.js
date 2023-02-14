import { Decoder } from "../Decoder";
import { LoadedInfo } from "../Probe/Probe";
import { Decoding, DecodingObject } from "./Decoding";


export class DecodingClass implements Decoding {
  constructor(object: DecodingObject) {
  
    const { info, type } = object
    this.type = type
    if (info) this.info = info
  }
  declare type: Decoder
  
  info?: LoadedInfo
}