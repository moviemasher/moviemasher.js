import { DefinitionType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { assertPopulatedString } from "../Utility/Is"
import { Factories } from "../Definitions/Factories"
// import { ContentDefinitionClass } from "./ContentDefinitionClass"
import { Content, ContentDefinition, ContentDefinitionObject, ContentObject } from "./Content"

import defaultContentJson from "../Definitions/DefinitionObjects/colorcontent/default.json"
import { ColorContentClass } from "./ColorContent"
import { ColorContentDefinitionClass } from "./ColorContent/ColorContentDefinitionClass"

export const contentDefault = new ColorContentDefinitionClass(defaultContentJson)
export const contentDefaults = [contentDefault]

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
  const instance = definition.instanceFromObject(object)

  throw 'contentInstance'
  // return instance
}

export const contentFromId = (id: string): Content => {
  const definition = contentDefinitionFromId(id)
  const instance = definition.instanceFromObject({ definitionId: id })
  throw 'contentFromId'
  // return instance
}

Factories[DefinitionType.Content] = {
  definition: contentDefinition,
  definitionFromId: contentDefinitionFromId,
  fromId: contentFromId,
  instance: contentInstance,
  defaults: contentDefaults,
}
