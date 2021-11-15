import { Mash, MashDefinition, MashDefinitionObject, MashOptions } from "./Mash"
import { Factories } from "../Factories/Factories"
import { Errors } from "../../Setup/Errors"
import { Is } from "../../Utilities/Is"
import { Definitions } from "../Definitions/Definitions"
import { MashDefinitionClass } from "./MashDefinition"
import { DefinitionType } from "../../Setup/Enums"

const MashDefaultId = "com.moviemasher.mash.default"

const mashDefinition = (object : MashDefinitionObject) : MashDefinition => {
  const { id } = object
  const idString = id && Is.populatedString(id) && Definitions.installed(id) ? id : MashDefaultId
  return <MashDefinition> Definitions.fromId(idString)
}

const mashDefinitionFromId = (id : string) : MashDefinition => {
  return mashDefinition({ id })
}

const mashInstance = (object : MashOptions) : Mash => {
  const definition = mashDefinition(object)
  const instance = definition.instanceFromObject(object)
  return instance
}

const mashFromId = (id : string) : Mash => {
  return mashInstance({ id })
}

const mashInitialize = () : void => {
  new MashDefinitionClass({ id: MashDefaultId })
}

const mashDefine = (object : MashDefinitionObject) : MashDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id

  Definitions.uninstall(id)
  return mashDefinition(object)
}

/**
 * @internal
 */
const mashInstall = (object: MashDefinitionObject): MashDefinition => {
  const instance = mashDefine(object)
  instance.retain = true
  return instance
}

const MashFactoryImplementation = {
  define: mashDefine,
  install: mashInstall,
  definition: mashDefinition,
  definitionFromId: mashDefinitionFromId,
  fromId: mashFromId,
  initialize: mashInitialize,
  instance: mashInstance,
}

Factories[DefinitionType.Mash] = MashFactoryImplementation

export {
  mashInstall,
  mashDefine,
  mashDefinition,
  mashDefinitionFromId,
  MashFactoryImplementation,
  mashFromId,
  mashInitialize,
  mashInstance,
}
