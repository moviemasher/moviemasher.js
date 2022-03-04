import { DefinitionType } from "../../Setup/Enums"
import { MergerDefinitionClass } from "./MergerDefinition"
import { Definitions } from "../../Definitions"
import mergerBlendJson from "../../Definitions/DefinitionObjects/merger/blend.json"
import mergerCenterJson from "../../Definitions/DefinitionObjects/merger/center.json"
import mergerConstrainedJson from "../../Definitions/DefinitionObjects/merger/constrained.json"
import mergerDefaultJson from "../../Definitions/DefinitionObjects/merger/default.json"
import mergerOverlayJson from "../../Definitions/DefinitionObjects/merger/overlay.json"
import {
  Merger,
  MergerObject,
  MergerDefinition,
  MergerDefinitionObject,
  MergerFactory
} from "./Merger"
import { Factories } from "../../Definitions/Factories"
import { Is } from "../../Utility/Is"

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

const mergerInstance = (object: MergerObject): Merger => {
  const { definitionId = mergerDefaultId } = object

  const definition = mergerDefinition({ id: definitionId })
  return definition.instanceFromObject(object)
}

const mergerFromId = (definitionId : string) : Merger => {
  return mergerInstance({ definitionId })
}

const mergerInitialize = () : void => {
  [
    mergerBlendJson,
    mergerCenterJson,
    mergerConstrainedJson,
    mergerDefaultJson,
    mergerOverlayJson,
  ].forEach(object => mergerInstall(object))
}

const mergerInstall = (object : MergerDefinitionObject) : MergerDefinition => {
  const { id } = object
  const idString = id && Is.populatedString(id) ? id : mergerDefaultId
  Definitions.uninstall(idString)
  const instance = mergerDefinition(object)
  Definitions.install(instance)
  return instance
}

const MergerFactoryImplementation : MergerFactory = {
  install: mergerInstall,
  definition: mergerDefinition,
  definitionFromId: mergerDefinitionFromId,
  fromId: mergerFromId,
  initialize: mergerInitialize,
  instance: mergerInstance,
}

Factories[DefinitionType.Merger] = MergerFactoryImplementation

export {
  mergerInstall,
  mergerDefaultId,
  mergerDefinition,
  mergerDefinitionFromId,
  MergerFactoryImplementation,
  mergerFromId,
  mergerInitialize,
  mergerInstance,
}
