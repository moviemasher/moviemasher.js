import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { assertPopulatedString } from "../../Utility/Is"
import { Factories } from "../../Definitions/Factories"
import { TextContainerDefinitionClass } from "./TextContainerDefinitionClass"
import { TextContainer, TextContainerDefinition, TextContainerDefinitionObject, TextContainerObject } from "./TextContainer"

import defaultTextContainerJson from "../../Definitions/DefinitionObjects/textcontainer/default.json"

export const textContainerDefaults = [
  new TextContainerDefinitionClass(defaultTextContainerJson),
]

export const textContainerDefinition = (object : TextContainerDefinitionObject) : TextContainerDefinition => {
  const { id } = object
  assertPopulatedString(id, 'textContainerDefinition id')

  return new TextContainerDefinitionClass({ ...object, type: DefinitionType.TextContainer })
}

export const textContainerDefinitionFromId = (id: string): TextContainerDefinition => {
  const definition = textContainerDefaults.find(definition => definition.id === id)
  if (definition) return definition

  return textContainerDefinition({ id })
}

export const textContainerInstance = (object: TextContainerObject): TextContainer => {
  const { definitionId } = object
  if (!definitionId) throw Errors.id

  const definition = textContainerDefinitionFromId(definitionId)
  const instance = definition.instanceFromObject(object)
  return instance
}

export const textContainerFromId = (id: string): TextContainer => {
  const definition = textContainerDefinitionFromId(id)
  const instance = definition.instanceFromObject({ definitionId: id })
  return instance
}

Factories[DefinitionType.TextContainer] = {
  definition: textContainerDefinition,
  definitionFromId: textContainerDefinitionFromId,
  fromId: textContainerFromId,
  instance: textContainerInstance,
  defaults: textContainerDefaults,
}
