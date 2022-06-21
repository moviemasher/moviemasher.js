import { Defined } from "../../../packages/moviemasher.js/src/Base/Defined"
import { VisibleClipObject } from "../../../packages/moviemasher.js/src/Media/VisibleClip/VisibleClip"
import { visibleClipDefault, visibleClipInstance } from "../../../packages/moviemasher.js/src/Media/VisibleClip/VisibleClipFactory"
import { imageDefinitionObject } from "./Image"

export const visibleClipObject = (): VisibleClipObject => (
   { definitionId: visibleClipDefault.id }
)

export const visibleClip = (object?: VisibleClipObject) => (
  visibleClipInstance(object || visibleClipObject()) 
)

export const visibleClipObjectWithImage = (): VisibleClipObject => {
  const object = imageDefinitionObject()
  Defined.define(object)
  return { ...visibleClipObject(), contentId: object.id }
}

export const visibleClipWithImage = () => (
  visibleClip(visibleClipObjectWithImage())
)