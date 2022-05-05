import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Factories } from "../../Definitions/Factories"
import { ImageDefinitionClass } from "./ImageDefinitionClass"
import { Image, ImageDefinition, ImageDefinitionObject, ImageObject } from "./Image"

export const imageDefinition = (object : ImageDefinitionObject) : ImageDefinition => {
  const { id } = object
  if (!id) throw Errors.id + JSON.stringify(object)

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

export const ImageFactoryImplementation = {
  definition: imageDefinition,
  definitionFromId: imageDefinitionFromId,
  fromId: imageFromId,
  instance: imageInstance,
}

Factories[DefinitionType.Image] = ImageFactoryImplementation
