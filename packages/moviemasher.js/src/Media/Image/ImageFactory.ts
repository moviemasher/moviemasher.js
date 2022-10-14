import { DefinitionType } from "../../Setup/Enums"
import { Factories } from "../../Definitions/Factories"
import { ImageDefinitionClass } from "./ImageDefinitionClass"
import { Image, ImageDefinition, ImageDefinitionObject, ImageObject } from "./Image"
import { assertPopulatedString } from "../../Utility/Is"

export const imageDefinition = (object : ImageDefinitionObject) : ImageDefinition => {
  const { id } = object
  assertPopulatedString(id, 'imageDefinition id')
  return new ImageDefinitionClass(object)
}

export const imageDefinitionFromId = (id : string) : ImageDefinition => {
  return imageDefinition({ id })
}

export const imageInstance = (object : ImageObject) : Image => {
  const definition = imageDefinition(object)
  const instance = definition.instanceFromObject(object)
  return instance
}

export const imageFromId = (id : string) : Image => {
  return imageInstance({ id })
}

Factories[DefinitionType.Image] = {
  definition: imageDefinition,
  definitionFromId: imageDefinitionFromId,
  fromId: imageFromId,
  instance: imageInstance,
}
