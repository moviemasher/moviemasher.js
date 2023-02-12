import { UnknownRecord } from "../../declarations"
import { MashType } from "../../Setup/Enums"
import { idTemporary } from "../../Utility/Id"
import { MashMedia, MashMediaArgs, MashMediaObject } from "./Mash"
import { MashMediaClass } from "./MashMediaClass"

export const mashMedia = (object?: MashMediaArgs): MashMedia => {
  const copy: UnknownRecord = object ? { ...object } : {}
  copy.id ||= idTemporary()
  copy.type ||= MashType
  return new MashMediaClass(copy as MashMediaArgs)
}
