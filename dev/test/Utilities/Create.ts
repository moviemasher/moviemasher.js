import { Defined } from "../../../packages/moviemasher.js/src/Base/Defined"
import { ClipObject } from "../../../packages/moviemasher.js/src/Edited/Mash/Track/Clip/Clip"
import { clipDefault, clipInstance } from "../../../packages/moviemasher.js/src/Edited/Mash/Track/Clip/ClipFactory"
import { imageDefinitionObject } from "./Image"
import { audioDefinitionObject } from "./Audio"

export const createClipObject = (object: ClipObject = {}): ClipObject => {
  object.definitionId ||= clipDefault.id
  object.frames ||= 10
  return object
}

export const createClip = (object?: ClipObject) => (
  clipInstance(object || createClipObject()) 
)

export const createClipObjectWithImage = (object?: ClipObject): ClipObject => {
  const definitionObject = imageDefinitionObject()
  Defined.define(definitionObject)
  return { ...createClipObject(object), contentId: definitionObject.id }
}

export const createClipObjectWithAudio = (object?: ClipObject): ClipObject => {
  const definitionObject = audioDefinitionObject()
  Defined.define(definitionObject)
  return { ...createClipObject(object), contentId: definitionObject.id, containerId: "" }
}

export const createClipWithImage = (object?: ClipObject) => (
  createClip(createClipObjectWithImage(object))
)

export const createClipWithAudio = (object?: ClipObject) => (
  createClip(createClipObjectWithAudio(object))
)


