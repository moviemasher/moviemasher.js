import { DefinitionType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { assertPopulatedString } from "../Utility/Is"
import { Factories } from "../Definitions/Factories"
import { Container, DefaultContainerId, ContainerDefinition, ContainerDefinitionObject, ContainerObject } from "./Container"
import { ShapeContainerDefinitionClass } from "./ShapeContainer/ShapeContainerDefinitionClass"
import { TextContainerDefinitionClass } from "./TextContainer/TextContainerDefinitionClass"

import defaultContainer from "../Definitions/DefinitionObjects/container/default.json"
import chatContainer from "../Definitions/DefinitionObjects/container/chat.json"
import broadcastContainer from "../Definitions/DefinitionObjects/container/broadcast.json"
import musicContainer from "../Definitions/DefinitionObjects/container/music.json"
import testContainer from "../Definitions/DefinitionObjects/container/test.json"
import textContainer from "../Definitions/DefinitionObjects/container/text.json"

export const containerDefaults = [
  new ShapeContainerDefinitionClass({ id: DefaultContainerId, ...defaultContainer }),
  new TextContainerDefinitionClass(textContainer),
  new ShapeContainerDefinitionClass(chatContainer),
  new ShapeContainerDefinitionClass(broadcastContainer),
  new ShapeContainerDefinitionClass(musicContainer),
  new ShapeContainerDefinitionClass(testContainer),
]

export const containerDefinition = (object : ContainerDefinitionObject) : ContainerDefinition => {
  const { id } = object
  assertPopulatedString(id, 'containerDefinition id')

  throw 'containerDefinition'
  // return new ContainerDefinitionClass({ ...object, type: DefinitionType.Container })
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
