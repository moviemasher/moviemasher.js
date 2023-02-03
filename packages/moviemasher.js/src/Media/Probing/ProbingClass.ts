import { LoadedInfo } from "../../Loader/Loader";
import { RequestableClass } from "../Requestable/RequestableClass";
import { Probing, ProbingObject } from "./Probing";


export class ProbingClass extends RequestableClass implements Probing {
  constructor(object: ProbingObject) {
    super(object)
    const { info } = object

    if (info) this.info = info
  }
  info?: LoadedInfo;
}