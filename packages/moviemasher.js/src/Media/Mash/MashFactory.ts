import { UnknownRecord } from "../../declarations"
import { MashType } from "../../Setup/Enums"
import { idTemporary } from "../../Utility/Id"
import { Size } from "../../Utility/Size"
import { MashEditorArgs, MashMedia, MashMediaArgs, MashMediaContent, MashMediaObject } from "./Mash"
import { MashMediaClass } from "./MashMediaClass"

export const mashDefault: MashMediaObject = { type: MashType, id: '', request: { response: {} } }


export const mashMedia = (object: MashMediaObject, args?: MashEditorArgs | Size): MashMedia => {
  const mashArgs: MashMediaArgs = { 
    request: { response: {} }, type: MashType, ...object 
  }
  return new MashMediaClass(mashArgs, args)
}
