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
  MergerDefinitionObject
} from "../Merger/Merger"
import { Factories } from "../Factories"
import { Is } from "../../Utilities/Is"
import { GenericFactory } from "../../Setup/declarations"

const mergerDefaultId = "com.moviemasher.merger.default"

const mergerDefinition = (object : MergerDefinitionObject) : MergerDefinition => {
  const { id } = object
  const idString = id && Is.populatedString(id) ? id : mergerDefaultId
  if (!Definitions.installed(idString)) {
    new MergerDefinitionClass({ ...object, type: DefinitionType.Merger, id: idString })
  }
  return <MergerDefinition> Definitions.fromId(idString)
}

const mergerDefinitionFromId = (id : string) : MergerDefinition => {
  return mergerDefinition({ id })
}

const mergerInstance = (object : MergerDefinitionObject) : Merger => {
  const definition = mergerDefinition(object)
  const instance = definition.instanceFromObject(object)
  return instance
}

const mergerFromId = (id : string) : Merger => {
  return mergerInstance({ id })
}

const mergerInitialize = () : void => {
  mergerDefinition(mergerBlendJson)
  mergerDefinition(mergerCenterJson)
  mergerDefinition(mergerConstrainedJson)
  mergerDefinition(mergerDefaultJson)
  mergerDefinition(mergerOverlayJson)
}

const mergerDefine = (object : MergerDefinitionObject) : MergerDefinition => {
  const { id } = object
  const idString = id && Is.populatedString(id) ? id : mergerDefaultId
  Definitions.uninstall(idString)
  return mergerDefinition(object)
}

type MergerFactory = GenericFactory<Merger, MergerObject, MergerDefinition, MergerDefinitionObject>

const MergerFactoryImplementation : MergerFactory = {
  define: mergerDefine,
  definition: mergerDefinition,
  definitionFromId: mergerDefinitionFromId,
  fromId: mergerFromId,
  initialize: mergerInitialize,
  instance: mergerInstance,
}

Factories.merger = MergerFactoryImplementation

export {
  mergerDefine,
  mergerDefaultId,
  mergerDefinition,
  mergerDefinitionFromId,
  MergerFactoryImplementation,
  mergerFromId,
  mergerInitialize,
  mergerInstance,
}
