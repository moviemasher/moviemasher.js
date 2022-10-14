import { DefinitionType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { assertPopulatedString } from "../Utility/Is"
import { Factories } from "../Definitions/Factories"
import { Content, DefaultContentId, ContentDefinition, ContentDefinitionObject, ContentObject } from "./Content"

import defaultContent from "../Definitions/DefinitionObjects/content/default.json"
import { ColorContentDefinitionClass } from "./ColorContent/ColorContentDefinitionClass"

export const contentDefaults = [
  new ColorContentDefinitionClass({...defaultContent, id: DefaultContentId})
]

export const contentDefinition = (object : ContentDefinitionObject) : ContentDefinition => {
  const { id } = object
  assertPopulatedString(id, 'contentDefinition id')
  throw 'contentDefinition'
  // return new ContentDefinitionClass({ ...object, type: DefinitionType.Content })
}

export const contentDefinitionFromId = (id: string): ContentDefinition => {
  const definition = contentDefaults.find(definition => definition.id === id)
  if (definition) return definition

  return contentDefinition({ id })
}

export const contentInstance = (object: ContentObject): Content => {
  const { definitionId } = object
  if (!definitionId) throw Errors.id

  const definition = contentDefinitionFromId(definitionId)
  const instance = definition.instanceFromObject(object) as Content
  return instance
}

export const contentFromId = (id: string): Content => {
  const definition = contentDefinitionFromId(id)
  const instance = definition.instanceFromObject({ definitionId: id }) as Content
  return instance
}

Factories[DefinitionType.Content] = {
  definition: contentDefinition,
  definitionFromId: contentDefinitionFromId,
  fromId: contentFromId,
  instance: contentInstance,
  defaults: contentDefaults,
}
