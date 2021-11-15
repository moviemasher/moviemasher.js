import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Is } from "../../Utilities/Is"
import { Definitions } from "../Definitions/Definitions"
import { Factories } from "../Factories"
import { ThemeDefinitionClass } from "./ThemeDefinition"
import { Theme, ThemeDefinition, ThemeDefinitionObject, ThemeObject } from "./Theme"

import themeColorJson from "../../DefinitionObjects/theme/color.json"
import themeTextJson from "../../DefinitionObjects/theme/text.json"

const themeDefinition = (object : ThemeDefinitionObject) : ThemeDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id

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
  if (!(id && Is.populatedString(id))) throw Errors.id

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
