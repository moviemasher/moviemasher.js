import { Duration, Sizing, Timing } from "../../../../Setup/Enums"
import { isUndefined } from "../../../../Utility/Is"
import { Clip, ClipObject } from "./Clip"
import { ClipClass } from "./ClipClass"
import { DefaultContentId } from "../../../../Media/Content/Content"
import { DefaultContainerId } from "../../../../Media/Container/Container"

export const clipInstance = (object: ClipObject = {}): Clip => {
  // if (isUndefined())
  // object.contentId ||= DefaultContentId
  // object.containerId ||= DefaultContainerId
  // object.sizing ||= Sizing.Content
  // object.timing ||= Timing.Content
  // object.frame ||= Duration.None
  // object.frames ||= Duration.Unknown


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
  console.log('clipInstance', object)
  return new ClipClass(object)
}
