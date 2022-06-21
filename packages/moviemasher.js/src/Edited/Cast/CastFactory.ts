import { Cast, CastArgs, CastObject } from "./Cast"
import { CastClass } from "./CastClass"
import { Loader } from "../../Loader/Loader"

export const castInstance = (object: CastObject = {}, preloader?: Loader): Cast => {
  const castArgs: CastArgs = {  ...object, preloader }
  return new CastClass(castArgs)
}

export const isCast = (value: any): value is Cast => value instanceof CastClass

export function assertCast(value: any): asserts value is Cast {
  if (!isCast(value)) throw new Error("expected Cast")
}
