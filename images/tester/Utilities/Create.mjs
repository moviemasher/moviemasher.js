import { clipInstance } from "@moviemasher/lib-core"

import { audioDefinitionObject } from './Audio.mjs'
import { imageDefinitionObject } from './Image.mjs'


export const createClipObject = (object) => {
  object ||= {}
  object.frames ||= 10
  return object
}

export const createClip = () => (
  clipInstance(createClipObject()) 
)

const createClipObjectWithImage = (media, object) => {
  object ||= {}
  const definitionObject = imageDefinitionObject()
  media.define(definitionObject)
  return { ...createClipObject(object), contentId: definitionObject.id }
}

const createClipObjectWithAudio = (media, object) => {
  object ||= {}
  const definitionObject = audioDefinitionObject()
  media.define(definitionObject)
  return { ...createClipObject(object), contentId: definitionObject.id, containerId: "" }
}

export const createClipWithImage = (media, object) => (
  createClip(createClipObjectWithImage(media, object))
)

export const createClipWithAudio = (media, object) => (
  createClip(createClipObjectWithAudio(media, object))
)


