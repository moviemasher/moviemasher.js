import { DefinitionType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { assertPopulatedString } from "../Utility/Is"
import { Factories } from "../Definitions/Factories"
import { Container, DefaultContainerId, ContainerDefinition, ContainerDefinitionObject, ContainerObject } from "./Container"
import { ShapeContainerDefinitionClass } from "./ShapeContainer/ShapeContainerDefinitionClass"
import { TextContainerDefinitionClass } from "./TextContainer/TextContainerDefinitionClass"

import defaultContainer from "../Definitions/DefinitionObjects/container/default.json"
import heartContainer from "../Definitions/DefinitionObjects/container/heart.json"
import cloudContainer from "../Definitions/DefinitionObjects/container/cloud.json"
import appleContainer from "../Definitions/DefinitionObjects/container/apple.json"
import starburstContainer from "../Definitions/DefinitionObjects/container/starburst.json"
import roundedRectContainer from "../Definitions/DefinitionObjects/container/rounded-rect.json"
import textContainer from "../Definitions/DefinitionObjects/container/text.json"
import fireContainer from "../Definitions/DefinitionObjects/container/fire.json"
import flagContainer from "../Definitions/DefinitionObjects/container/flag.json"
import ovalContainer from "../Definitions/DefinitionObjects/container/oval.json"
import mmContainer from "../Definitions/DefinitionObjects/container/mm.json"

export const containerDefaults = [
  new TextContainerDefinitionClass(textContainer),
  new ShapeContainerDefinitionClass({ id: DefaultContainerId, ...defaultContainer }),
  new ShapeContainerDefinitionClass(roundedRectContainer),
  new ShapeContainerDefinitionClass(ovalContainer),
  new ShapeContainerDefinitionClass(starburstContainer),
  new ShapeContainerDefinitionClass(heartContainer),
  new ShapeContainerDefinitionClass(cloudContainer),
  new ShapeContainerDefinitionClass(fireContainer),
  new ShapeContainerDefinitionClass(flagContainer),
  new ShapeContainerDefinitionClass(mmContainer),
  new ShapeContainerDefinitionClass(appleContainer),
]

export const containerDefinition = (object : ContainerDefinitionObject) : ContainerDefinition => {
  const { id } = object
  assertPopulatedString(id, 'containerDefinition id')

  // console.log("containerDefinition", id, object, containerDefaults)
  return new ShapeContainerDefinitionClass({ ...object, type: DefinitionType.Container })
}

export const containerDefinitionFromId = (id: string): ContainerDefinition => {
  const definition = containerDefaults.find(definition => definition.id === id)
  if (definition) return definition

  return containerDefinition({ id })
}

export const containerInstance = (object: ContainerObject): Container => {
  const { definitionId } = object
  if (!definitionId) throw Errors.id

  const definition = containerDefinitionFromId(definitionId)
  const instance = definition.instanceFromObject(object) as Container
  return instance
}

export const containerFromId = (id: string): Container => {
  const definition = containerDefinitionFromId(id)
  const instance = definition.instanceFromObject({ definitionId: id }) as Container
  return instance
}

Factories[DefinitionType.Container] = {
  definition: containerDefinition,
  definitionFromId: containerDefinitionFromId,
  fromId: containerFromId,
  instance: containerInstance,
  defaults: containerDefaults,
}
