import { Sizing, Timing } from "../../../../Setup/Enums"
import { isUndefined } from "../../../../Utility/Is"
import { Clip, ClipArgs, ClipObject } from "./Clip"
import { ClipClass } from "./ClipClass"
import { DefaultContentId } from "../../../Content/Content"
import { DefaultContainerId } from "../../../Container/Container"

export const clipInstance = (object: ClipArgs): Clip => {
  const { containerId, contentId } = object
  const defaultContent = isUndefined(contentId) || contentId === DefaultContentId
  const defaultContainer = isUndefined(containerId) || containerId === DefaultContainerId
  if (object.sizing === Sizing.Content && defaultContent) {
    // console.log("instanceArgs setting sizing to container", object)
    object.sizing = Sizing.Container
  }
  if (object.sizing === Sizing.Container && defaultContainer) {
    // console.log("instanceArgs setting sizing to preview", object)
    object.sizing = Sizing.Preview
  }
  if (object.timing === Timing.Content && defaultContent) {
    object.timing = Timing.Container
  }
  if (object.timing === Timing.Container && defaultContainer) {
    object.timing = Timing.Custom
  }
  
  return new ClipClass(object)
}
