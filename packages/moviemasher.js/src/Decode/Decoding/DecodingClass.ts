import { LoadedInfo } from "../../Load/Loader";
import { RequestableClass } from "../../Base/Requestable/RequestableClass";
import { Decoding, DecodingObject } from "./Decoding";


export class DecodingClass implements Decoding {
  constructor(object: DecodingObject) {
  
    const { info } = object

    if (info) this.info = info
  }
  info?: LoadedInfo;
}