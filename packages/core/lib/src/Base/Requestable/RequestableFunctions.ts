import { isObject } from "../../Utility/Is"
import { isIdentified } from "../Identified"
import { Requestable, RequestableObject } from "./Requestable"

export const isRequestableObject = (value: any): value is RequestableObject => {
  return isIdentified(value)
}

export const isRequestable = (value: any): value is Requestable => {
  return isObject(value) && "request" in value 
}

