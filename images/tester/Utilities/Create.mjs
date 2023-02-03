import { 
  Defined, clipInstance
   
} from "@moviemasher/moviemasher.js"

import { audioDefinitionObject } from './Audio.mjs'
import { imageDefinitionObject } from './Image.mjs'


export const createClipObject = (object) => {
  object ||= {}
  object.frames ||= 10
  return object
}

export const createClip = (object) => (
  clipInstance(object || createClipObject()) 
)

export const createClipObjectWithImage = (object) => {
  object ||= {}
  const definitionObject = imageDefinitionObject()
  Defined.define(definitionObject)
  return { ...createClipObject(object), contentId: definitionObject.id }
}

export const createClipObjectWithAudio = (object) => {
  object ||= {}
  const definitionObject = audioDefinitionObject()
  Defined.define(definitionObject)
  return { ...createClipObject(object), contentId: definitionObject.id, containerId: "" }
}

export const createClipWithImage = (object) => (
  createClip(createClipObjectWithImage(object))
)

export const createClipWithAudio = (object) => (
  createClip(createClipObjectWithAudio(object))
)


