import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Is } from "../../Utility/Is"
import { Definitions } from "../../Definitions/Definitions"
import { Factories } from "../../Definitions/Factories"
import { ThemeDefinitionClass } from "./ThemeDefinitionClass"
import { Theme, ThemeDefinition, ThemeDefinitionObject, ThemeObject } from "./Theme"

import themeColorJson from "../../Definitions/DefinitionObjects/theme/color.json"
import themeTextJson from "../../Definitions/DefinitionObjects/theme/text.json"

const themeDefinition = (object : ThemeDefinitionObject) : ThemeDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id + JSON.stringify(object)

  if (Definitions.installed(id)) return <ThemeDefinition> Definitions.fromId(id)

  return new ThemeDefinitionClass({...object, type: DefinitionType.Theme })
}

const themeDefinitionFromId = (id : string) : ThemeDefinition => {
  return themeDefinition({ id })
}

const themeInstance = (object : ThemeObject) : Theme => {
  const definition = themeDefinition(object)
  const instance = definition.instanceFromObject(object)
  return instance
}

const themeFromId = (id : string) : Theme => {
  return themeInstance({ id })
}

const themeInitialize = (): void => {
  [
    themeColorJson,
    themeTextJson,
  ].forEach(object => themeInstall(object))
}

const themeInstall = (object : ThemeDefinitionObject) : ThemeDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id + JSON.stringify(object)

  Definitions.uninstall(id)
  const instance = themeDefinition(object)
  Definitions.install(instance)
  return instance
}

const ThemeFactoryImplementation = {
  install: themeInstall,
  definition: themeDefinition,
  definitionFromId: themeDefinitionFromId,
  fromId: themeFromId,
  initialize: themeInitialize,
  instance: themeInstance,
}

Factories[DefinitionType.Theme] = ThemeFactoryImplementation

export {
  themeInstall,
  themeDefinition,
  themeDefinitionFromId,
  ThemeFactoryImplementation,
  themeFromId,
  themeInitialize,
  themeInstance,
}
