import { isRequestObject, RequestObject } from "../../Api/Api"
import { UnknownRecord } from "../../declarations"
import { ClientMediaOrError, LoadedMedia } from "../../Load/Loaded"
import { LoadType } from "../../Setup/Enums"
import { isObject } from "../../Utility/Is"
import { Identified, isIdentified } from "../Identified"
import { Propertied } from "../Propertied"
import { Typed } from "../Typed"

export interface RequestableObject extends UnknownRecord, Identified, Partial<Typed> {
  createdAt?: string
  request?: RequestObject
  kind?: string
}
export const isRequestableObject = (value: any): value is RequestableObject => {
  return isIdentified(value)
}

export interface Requestable extends Propertied, Identified, Typed {
  request: RequestObject
  createdAt: string
  loadType: LoadType
  loadedMediaPromise: Promise<ClientMediaOrError>
  loadedMedia?: LoadedMedia
  kind: string
}

export const isRequestable = (value: any): value is Requestable => {
  return isObject(value) && "request" in value && isRequestObject(value.request) 
}


