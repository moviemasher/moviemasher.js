import { LoadedInfo } from "../../Loader/Loader";
import { Requestable, RequestableObject } from "../Requestable/Requestable";


export interface ProbingObject extends RequestableObject {
  info?: LoadedInfo
}

export type ProbingObjects = ProbingObject[]

export interface Probing extends Requestable {
  info?: LoadedInfo
}

export type Probings = Probing[]
