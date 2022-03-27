import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Is } from "../../Utility/Is"
import { Definitions } from "../../Definitions"
import { Factories } from "../../Definitions/Factories"
import { ImageDefinitionClass } from "./ImageDefinitionClass"
import { Image, ImageDefinition, ImageDefinitionObject, ImageObject } from "./Image"

const imageDefinition = (object : ImageDefinitionObject) : ImageDefinition => {
  const { id } = object
  if (!id) throw Errors.id + JSON.stringify(object)

  if (Definitions.installed(id)) return <ImageDefinition> Definitions.fromId(id)

  return new ImageDefinitionClass(object)
}

const imageDefinitionFromId = (id : string) : ImageDefinition => {
  return imageDefinition({ id })
}

const imageInstance = (object : ImageObject) : Image => {
  const definition = imageDefinition(object)
  const instance = definition.instanceFromObject(object)
  return instance
}

const imageFromId = (id : string) : Image => {
  return imageInstance({ id })
}

const imageInitialize = () : void => {}

/**
 * @internal
 */
const imageInstall = (object: ImageDefinitionObject): ImageDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id

  Definitions.uninstall(id)
  const instance = imageDefinition(object)
  instance.retain = true
  Definitions.install(instance)
  return instance
}


const ImageFactoryImplementation = {
  install: imageInstall,
  definition: imageDefinition,
  definitionFromId: imageDefinitionFromId,
  fromId: imageFromId,
  initialize: imageInitialize,
  instance: imageInstance,
}

Factories[DefinitionType.Image] = ImageFactoryImplementation

export {
  imageInstall,
  imageDefinition,
  imageDefinitionFromId,
  ImageFactoryImplementation,
  imageFromId,
  imageInitialize,
  imageInstance,
}
