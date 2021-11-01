import { DefinitionType } from "../../Setup/Enums"
import { MergerDefinitionClass } from "../Merger/MergerDefinition"
import { Definitions } from "../Definitions"
import mergerBlendJson from "../Merger/DefinitionObjects/blend.json"
import mergerCenterJson from "../Merger/DefinitionObjects/center.json"
import mergerConstrainedJson from "../Merger/DefinitionObjects/constrained.json"
import mergerDefaultJson from "../Merger/DefinitionObjects/default.json"
import mergerOverlayJson from "../Merger/DefinitionObjects/overlay.json"
import {
  Merger,
  MergerObject,
  MergerDefinition,
  MergerDefinitionObject,
  MergerFactory
} from "../Merger/Merger"
import { Factories } from "../Factories"
import { Is } from "../../Utilities/Is"

const mergerDefaultId = "com.moviemasher.merger.default"

const mergerDefinition = (object : MergerDefinitionObject) : MergerDefinition => {
  const { id } = object
  const idString = id && Is.populatedString(id) ? id : mergerDefaultId
  if (Definitions.installed(idString)) return <MergerDefinition> Definitions.fromId(idString)

  return new MergerDefinitionClass({ ...object, type: DefinitionType.Merger, id: idString })
}

const mergerDefinitionFromId = (id : string) : MergerDefinition => {
  return mergerDefinition({ id })
}

const mergerInstance = (object : MergerObject) : Merger => {
  const definition = mergerDefinition(object)
  const instance = definition.instanceFromObject(object)
  return instance
}

const mergerFromId = (id : string) : Merger => {
  return mergerInstance({ id })
}

const mergerInitialize = () : void => {
  new MergerDefinitionClass(mergerBlendJson)
  new MergerDefinitionClass(mergerCenterJson)
  new MergerDefinitionClass(mergerConstrainedJson)
  new MergerDefinitionClass(mergerDefaultJson)
  new MergerDefinitionClass(mergerOverlayJson)
}

const mergerDefine = (object : MergerDefinitionObject) : MergerDefinition => {
  const { id } = object
  const idString = id && Is.populatedString(id) ? id : mergerDefaultId
  Definitions.uninstall(idString)
  return mergerDefinition(object)
}


const MergerFactoryImplementation : MergerFactory = {
  define: mergerDefine,
  install: mergerDefine,
  definition: mergerDefinition,
  definitionFromId: mergerDefinitionFromId,
  fromId: mergerFromId,
  initialize: mergerInitialize,
  instance: mergerInstance,
}

Factories.merger = MergerFactoryImplementation

export {
  mergerDefine,
  mergerDefine as mergerInstall,
  mergerDefaultId,
  mergerDefinition,
  mergerDefinitionFromId,
  MergerFactoryImplementation,
  mergerFromId,
  mergerInitialize,
  mergerInstance,
}
