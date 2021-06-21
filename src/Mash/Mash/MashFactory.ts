import { Mash, MashDefinition, MashDefinitionObject, MashOptions } from "./Mash"
import { Factories } from "../Factories/Factories"
import { Errors } from "../../Setup/Errors"
import { Is } from "../../Utilities/Is"
import { Definitions } from "../Definitions/Definitions"
import { MashDefinitionClass } from "./MashDefinition"

const mashDefinition = (object : MashDefinitionObject) : MashDefinition => {
  const { id } = object
  if (!id) throw Errors.id + JSON.stringify(object)

  if (Definitions.installed(id)) return <MashDefinition> Definitions.fromId(id)

  return new MashDefinitionClass(object)
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

const mashInitialize = () : void => {}

const mashDefine = (object : MashDefinitionObject) : MashDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id

  Definitions.uninstall(id)
  return mashDefinition(object)
}

const MashFactoryImplementation = {
  define: mashDefine,
  definition: mashDefinition,
  definitionFromId: mashDefinitionFromId,
  fromId: mashFromId,
  initialize: mashInitialize,
  instance: mashInstance,
}

Factories.mash = MashFactoryImplementation

export {
  mashDefine,
  mashDefinition,
  mashDefinitionFromId,
  MashFactoryImplementation,
  mashFromId,
  mashInitialize,
  mashInstance,
}
