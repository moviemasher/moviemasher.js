import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Is } from "../../Utilities/Is"
import { Definitions } from "../../Definitions"
import { Factories } from "../../Definitions/Factories"
import { ImageDefinitionClass } from "./ImageDefinition"
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

const imageDefine = (object : ImageDefinitionObject) : ImageDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id

  Definitions.uninstall(id)
  return imageDefinition(object)
}


/**
 * @internal
 */
const imageInstall = (object: ImageDefinitionObject): ImageDefinition => {
  const instance = imageDefine(object)
  instance.retain = true
  return instance
}


const ImageFactoryImplementation = {
  define: imageDefine,
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
  imageDefine,
  imageDefinition,
  imageDefinitionFromId,
  ImageFactoryImplementation,
  imageFromId,
  imageInitialize,
  imageInstance,
}
