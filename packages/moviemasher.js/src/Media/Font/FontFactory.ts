import { Definitions } from "../../Definitions"
import { DefinitionType } from "../../Setup/Enums"
import { FontDefinitionClass } from "./FontDefinition"
import { Font, FontDefinition, FontDefinitionObject, FontObject } from "./Font"
import { Factories } from "../../Definitions/Factories"
import { Is } from "../../Utility/Is"
import fontDefaultJson from "../../Definitions/DefinitionObjects/font/default.json"

const fontDefaultId = "com.moviemasher.font.default"

const fontDefinition = (object : FontDefinitionObject) : FontDefinition => {
  const { id } = object
  const idString = id && Is.populatedString(id) ? id : fontDefaultId
  if (!Definitions.installed(idString)) {
    return new FontDefinitionClass({ ...object, type: DefinitionType.Font, id: idString })
  }
  return Definitions.fromId(idString) as FontDefinition
}
const fontDefinitionFromId = (id : string) : FontDefinition => {
  return fontDefinition({ id })
}

const fontInstance = (object : FontObject) : Font => {
  return fontDefinition(object).instanceFromObject(object)
}

const fontFromId = (id : string) : Font => {
  return fontInstance({ id })
}

const fontInitialize = () : void => {
  fontInstall(fontDefaultJson)
}
const fontInstall = (object : FontDefinitionObject) : FontDefinition => {
  const { id } = object
  const idString = id && Is.populatedString(id) ? id : fontDefaultId
  Definitions.uninstall(idString)
  const instance = fontDefinition(object)
  Definitions.install(instance)
  return instance
}

const FontFactoryImplementation = {
  install: fontInstall,
  definition: fontDefinition,
  definitionFromId: fontDefinitionFromId,
  fromId: fontFromId,
  initialize: fontInitialize,
  instance: fontInstance,
}

Factories[DefinitionType.Font] = FontFactoryImplementation

export {
  fontInstall,
  fontDefinition,
  fontDefinitionFromId,
  FontFactoryImplementation,
  fontFromId,
  fontInitialize,
  fontInstance,
}
