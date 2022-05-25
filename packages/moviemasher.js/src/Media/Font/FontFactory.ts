import { DefinitionType } from "../../Setup/Enums"
import { FontDefinitionClass } from "./FontDefinition"
import { Font, FontDefinition, FontDefinitionObject, FontObject } from "./Font"
import { Factories } from "../../Definitions/Factories"
import { Is } from "../../Utility/Is"

import fontDefaultJson from "../../Definitions/DefinitionObjects/font/default.json"

const fontDefaultId = fontDefaultJson.id

export const fontDefinition = (object : FontDefinitionObject) : FontDefinition => {
  const { id: idString } = object
  const id = idString && Is.populatedString(idString) ? idString : fontDefaultId

  return new FontDefinitionClass({ ...object, type: DefinitionType.Font, id })
}

export const fontDefaults = [fontDefinition(fontDefaultJson)]

export const fontDefinitionFromId = (id: string): FontDefinition => {
  const definition = fontDefaults.find(definition => definition.id === id)
  if (definition) return definition

  return fontDefinition({ id })
}

export const fontInstance = (object: FontObject): Font => {
  console.trace("fontInstance", object)
  throw 'fontInstance'
}

export const fontFromId = (id: string): Font => {
  const definition = fontDefinitionFromId(id)
  const instance = definition.instanceFromObject({ definitionid: id })
  return instance
}

Factories[DefinitionType.Font] = {
  definition: fontDefinition,
  definitionFromId: fontDefinitionFromId,
  fromId: fontFromId,
  instance: fontInstance,
  defaults: fontDefaults,
}
