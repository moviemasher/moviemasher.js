import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { assertPopulatedString } from "../../Utility/Is"
import { Factories } from "../../Definitions/Factories"
import { ColorContentDefinitionClass } from "./ColorContentDefinitionClass"
import { ColorContent, ColorContentDefinition, ColorContentDefinitionObject, ColorContentObject } from "./ColorContent"

import defaultColorContentJson from "../../Definitions/DefinitionObjects/colorcontent/default.json"

export const colorContentDefault = new ColorContentDefinitionClass(defaultColorContentJson)
export const colorContentDefaults = [colorContentDefault]

export const colorContentDefinition = (object : ColorContentDefinitionObject) : ColorContentDefinition => {
  const { id } = object
  assertPopulatedString(id, 'colorContentDefinition id')
  
  return new ColorContentDefinitionClass({ ...object, type: DefinitionType.ColorContent })
}

export const colorContentDefinitionFromId = (id: string): ColorContentDefinition => {
  const definition = colorContentDefaults.find(definition => definition.id === id)
  if (definition) return definition

  return colorContentDefinition({ id })
}

export const colorContentInstance = (object: ColorContentObject): ColorContent => {
  const { definitionId } = object
  if (!definitionId) throw Errors.id

  const definition = colorContentDefinitionFromId(definitionId)
  const instance = definition.instanceFromObject(object)
  return instance
}

export const colorContentFromId = (id: string): ColorContent => {
  const definition = colorContentDefinitionFromId(id)
  const instance = definition.instanceFromObject({ definitionId: id })
  return instance
}

Factories[DefinitionType.ColorContent] = {
  definition: colorContentDefinition,
  definitionFromId: colorContentDefinitionFromId,
  fromId: colorContentFromId,
  instance: colorContentInstance,
  defaults: colorContentDefaults,
}
