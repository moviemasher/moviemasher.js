import { isRequest, Request } from "../../Helpers/Request/Request"
import { UnknownRecord } from "../../Types/Core"
import { LoadType } from "../../Setup/LoadType"
import { isObject } from "../../Utility/Is"
import { Identified, isIdentified } from "../Identified"
import { Propertied } from "../Propertied"
import { Typed } from "../Typed"

export interface RequestableObject extends UnknownRecord, Identified, Partial<Typed> {
  createdAt?: string
  request?: Request
  kind?: string
}
export const isRequestableObject = (value: any): value is RequestableObject => {
  return isIdentified(value)
}

export interface Requestable extends Propertied, Identified, Typed {
  request: Request
  createdAt: string
  loadType: LoadType
  kind: string
}

export const isRequestable = (value: any): value is Requestable => {
  return isObject(value) && "request" in value && isRequest(value.request) 
}


