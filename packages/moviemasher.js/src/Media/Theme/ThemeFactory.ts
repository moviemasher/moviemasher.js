import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Is } from "../../Utility/Is"
import { Definitions } from "../../Definitions/Definitions"
import { Factories } from "../../Definitions/Factories"
import { ThemeDefinitionClass } from "./ThemeDefinition"
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

const themeInitialize = () : void => {
  new ThemeDefinitionClass(themeColorJson)
  new ThemeDefinitionClass(themeTextJson)
}

const themeDefine = (object : ThemeDefinitionObject) : ThemeDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id + JSON.stringify(object)

  Definitions.uninstall(id)
  return themeDefinition(object)
}

const ThemeFactoryImplementation = {
  define: themeDefine,
  install: themeDefine,
  definition: themeDefinition,
  definitionFromId: themeDefinitionFromId,
  fromId: themeFromId,
  initialize: themeInitialize,
  instance: themeInstance,
}

Factories[DefinitionType.Theme] = ThemeFactoryImplementation

export {
  themeDefine,
  themeDefine as themeInstall,
  themeDefinition,
  themeDefinitionFromId,
  ThemeFactoryImplementation,
  themeFromId,
  themeInitialize,
  themeInstance,
}
