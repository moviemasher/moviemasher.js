import { Defined } from "../../../packages/moviemasher.js/src/Base/Defined"
import { VisibleClipObject } from "../../../packages/moviemasher.js/src/Media/VisibleClip/VisibleClip"
import { visibleClipDefault, visibleClipInstance } from "../../../packages/moviemasher.js/src/Media/VisibleClip/VisibleClipFactory"
import { imageDefinitionObject } from "./Image"

export const visibleClipObject = (object: VisibleClipObject = {}): VisibleClipObject => {
  object.definitionId ||= visibleClipDefault.id
  object.frames ||= 10
  return object
}

export const visibleClip = (object?: VisibleClipObject) => (
  visibleClipInstance(object || visibleClipObject()) 
)

export const visibleClipObjectWithImage = (object?: VisibleClipObject): VisibleClipObject => {
  const definitionObject = imageDefinitionObject()
  Defined.define(definitionObject)
  return { ...visibleClipObject(object), contentId: definitionObject.id }
}

export const visibleClipWithImage = (object?: VisibleClipObject) => (
  visibleClip(visibleClipObjectWithImage(object))
)