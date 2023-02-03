import { isRequestObject, RequestObject } from "../../Api/Api"
import { UnknownObject } from "../../declarations"
import { isObject } from "../../Utility/Is"

export interface RequestableObject extends UnknownObject {
  id?: string
  request?: RequestObject
}

export interface Requestable {
  request: RequestObject
  id: string
}

export const isRequestable = (value: any): value is Requestable => {
  return isObject(value) && "request" in value && isRequestObject(value.request) 
}