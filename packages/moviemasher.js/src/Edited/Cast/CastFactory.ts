
import { Cast, CastArgs, CastObject } from "./Cast"
import { CastClass } from "./CastClass"
import { EditorDefinitions } from "../../Editor/EditorDefinitions"
import { Preloader } from "../../Preloader/Preloader"


export const castInstance = (object: CastObject = {}, definitions?: EditorDefinitions, preloader?: Preloader): Cast => {
  const castArgs: CastArgs = {
    ...object, definitions, preloader
  }
  return new CastClass(castArgs)
}

export const isCast = (value: any): value is Cast => value instanceof CastClass

export function assertCast(value: any): asserts value is Cast {
  if (!isCast(value)) throw new Error("expected Cast")
}
