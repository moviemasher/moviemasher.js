import { UnknownRecord } from "../../Types/Core"
import { MashType } from "../../Setup/Enums"
import { idTemporary } from "../../Utility/Id"
import { Size } from "../../Utility/Size"
import { MediaFactories } from "../MediaFactories"
import { MashMasherArgs, MashMedia, MashMediaArgs, MashMediaContent, MashMediaObject } from "./Mash"
import { MashMediaClass } from "./MashMediaClass"

export const mashDefault: MashMediaObject = { type: MashType, id: '', request: { response: {} } }


export const mashMedia = (object: MashMediaObject, args?: MashMasherArgs | Size): MashMedia => {
  const mashArgs: MashMediaArgs = { 
    request: { response: {} }, type: MashType, ...object 
  }
  return new MashMediaClass(mashArgs, args)
}

export const mashInstance = (object: MashMediaObject): MashMedia => {
  return new MashMediaClass(object)
}

MediaFactories[MashType] = mashInstance