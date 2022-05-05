import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Is } from "../../Utility/Is"
import { Factories } from "../../Definitions/Factories"
import { ThemeDefinitionClass } from "./ThemeDefinitionClass"
import { Theme, ThemeDefinition, ThemeDefinitionObject, ThemeObject } from "./Theme"

import themeColorJson from "../../Definitions/DefinitionObjects/theme/color.json"
import themeTextJson from "../../Definitions/DefinitionObjects/theme/text.json"

const ThemeDefinitions = {
  [themeColorJson.id]: new ThemeDefinitionClass(themeColorJson),
  [themeTextJson.id]: new ThemeDefinitionClass(themeTextJson),
}
export const themeDefinition = (object : ThemeDefinitionObject) : ThemeDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id + JSON.stringify(object)

  return new ThemeDefinitionClass({...object, type: DefinitionType.Theme })
}

export const themeDefinitionFromId = (id: string): ThemeDefinition => {
  const definition = ThemeDefinitions[id]
  if (definition) return definition

  return themeDefinition({ id })
}

export const themeInstance = (object: ThemeObject): Theme => {
  const { id } = object
  if (!id) throw Errors.id

  const definition = themeDefinitionFromId(id)
  const instance = definition.instanceFromObject(object)
  return instance
}

export const themeFromId = (id: string): Theme => {
  const definition = themeDefinitionFromId(id)
  const instance = definition.instanceFromObject({ definitionId: id })
  return instance
}

export const ThemeFactoryImplementation = {
  definition: themeDefinition,
  definitionFromId: themeDefinitionFromId,
  fromId: themeFromId,
  instance: themeInstance,
}

Factories[DefinitionType.Theme] = ThemeFactoryImplementation
