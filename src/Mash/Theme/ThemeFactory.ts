import { DefinitionType } from "../../Setup/Enums"
import { UnknownObject } from "../../Setup/declarations"
import { Errors } from "../../Setup/Errors"
import { Is } from "../../Utilities"
import { ThemeDefinitionClass } from "./ThemeDefinition"
import { Theme, ThemeDefinition, ThemeDefinitionObject, ThemeObject } from "./Theme"
import { Definitions } from "../Definitions/Definitions"
import themeColorJson from "./DefinitionObjects/color.json"
import themeTextJson from "./DefinitionObjects/text.json"
import { Factories } from "../Factories"

const Objects : {[index : string] : UnknownObject } = {
  "com.moviemasher.theme.color": themeColorJson,
  "com.moviemasher.theme.text": themeTextJson,
}

const themeDefinition = (object : ThemeDefinitionObject) : ThemeDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id

  if (!Definitions.installed(id)) {
    const options = {}
    if (Objects[id]) Object.assign(options, Objects[id])
    Object.assign(options, object)
    Object.assign(options, { type: DefinitionType.Theme, id: id })
    new ThemeDefinitionClass(options)
  }
  return <ThemeDefinition> Definitions.fromId(id)
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

const themeInitialize = () : void => {}

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
