import { RequestableClass } from "../../../Media/Requestable/RequestableClass";
import { Encoding, EncodingObject } from "./Encoding";


export class EncodingClass extends RequestableClass implements Encoding {
  constructor(object: EncodingObject) {
    super(object)
  }
}