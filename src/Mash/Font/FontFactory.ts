import fontDefaultJson from "./DefinitionObjects/default.json"
import { Definitions } from "../Definitions"
import { DefinitionType } from "../../Setup/Enums"
import { FontDefinitionClass } from "./FontDefinition"
import { Font, FontDefinition, FontDefinitionObject, FontObject } from "./Font"
import { Factories } from "../Factories"
import { Is } from "../../Utilities/Is"

const fontDefaultId = "com.moviemasher.font.default"

const fontDefinition = (object : FontDefinitionObject) : FontDefinition => {
  const { id } = object
  const idString = id && Is.populatedString(id) ? id : fontDefaultId
  if (!Definitions.installed(idString)) {
    new FontDefinitionClass({ ...object, type: DefinitionType.Font, id: idString })
  }
  return <FontDefinition> Definitions.fromId(idString)
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
  fontDefinition(fontDefaultJson)
}
const fontDefine = (object : FontDefinitionObject) : FontDefinition => {
  const { id } = object
  const idString = id && Is.populatedString(id) ? id : fontDefaultId
  Definitions.uninstall(idString)
  return fontDefinition(object)
}

const FontFactoryImplementation = {
  define: fontDefine,
  install: fontDefine,
  definition: fontDefinition,
  definitionFromId: fontDefinitionFromId,
  fromId: fontFromId,
  initialize: fontInitialize,
  instance: fontInstance,
}

Factories.font = FontFactoryImplementation

export {
  fontDefine,
  fontDefine as fontInstall,
  fontDefinition,
  fontDefinitionFromId,
  FontFactoryImplementation,
  fontFromId,
  fontInitialize,
  fontInstance,
}
