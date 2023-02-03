import { errorsThrow } from "../../Utility/Errors"
import { Cast, CastObject } from "./Cast"
import { CastClass } from "./CastClass"

export const castInstance = (object: CastObject = {}): Cast => {
  return new CastClass(object)
}

export const isCast = (value: any): value is Cast => value instanceof CastClass

export function assertCast(value: any): asserts value is Cast {
  if (!isCast(value)) errorsThrow(value, 'Cast') 
}
