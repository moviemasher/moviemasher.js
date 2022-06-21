import { DefinitionType } from "../../Setup/Enums"
import { FontDefinitionClass } from "./FontDefinition"
import { Font, FontDefinition, FontDefinitionObject, FontObject } from "./Font"
import { Factories } from "../../Definitions/Factories"
import { isPopulatedString } from "../../Utility/Is"

import fontDefaultJson from "../../Definitions/DefinitionObjects/font/default.json"

const fontDefaultId = fontDefaultJson.id

export const fontDefinition = (object : FontDefinitionObject) : FontDefinition => {
  const { id: idString } = object
  const id = idString && isPopulatedString(idString) ? idString : fontDefaultId

  return new FontDefinitionClass({ ...object, type: DefinitionType.Font, id })
}

export const fontDefault = fontDefinition(fontDefaultJson)
export const fontDefaults = [fontDefault]

export const fontDefinitionFromId = (id: string): FontDefinition => {
  const definition = fontDefaults.find(definition => definition.id === id)
  if (definition) return definition

  return fontDefinition({ id })
}

export const fontInstance = (object: FontObject): Font => {
  const { definitionId = '' } = object
  const definition = fontDefinitionFromId(definitionId)
  return definition.instanceFromObject(object)
}

export const fontFromId = (definitionId: string): Font => {
  const definition = fontDefinitionFromId(definitionId)
  return definition.instanceFromObject()
}

Factories[DefinitionType.Font] = {
  definition: fontDefinition,
  definitionFromId: fontDefinitionFromId,
  fromId: fontFromId,
  instance: fontInstance,
  defaults: fontDefaults,
}
