import { DefinitionType } from "../../Setup/Enums"
import { UnknownObject } from "../../declarations"
import { Errors } from "../../Setup/Errors"
import { Is } from "../../Utilities"
import { ThemeDefinitionClass } from "./ThemeDefinition"
import { Theme, ThemeDefinition, ThemeDefinitionObject, ThemeObject } from "./Theme"
import { Definitions } from "../Definitions/Definitions"
import themeColorJson from "./DefinitionObjects/color.json"
import themeTextJson from "./DefinitionObjects/text.json"
import themeTitleJson from "./DefinitionObjects/title.json"
import { Factories } from "../Factories"

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
  new ThemeDefinitionClass(themeTitleJson)
}

const themeDefine = (object : ThemeDefinitionObject) : ThemeDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id

  Definitions.uninstall(id)
  return themeDefinition(object)
}

const ThemeFactoryImplementation = {
  define: themeDefine,
  definition: themeDefinition,
  definitionFromId: themeDefinitionFromId,
  fromId: themeFromId,
  initialize: themeInitialize,
  instance: themeInstance,
}

Factories.theme = ThemeFactoryImplementation

export {
  themeDefine,
  themeDefinition,
  themeDefinitionFromId,
  ThemeFactoryImplementation,
  themeFromId,
  themeInitialize,
  themeInstance,
}
