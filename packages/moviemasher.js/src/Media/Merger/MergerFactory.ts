import { DefinitionType } from "../../Setup/Enums"
import { MergerDefinitionClass } from "./MergerDefinition"
import { Definitions } from "../../Definitions"
import mergerBlendJson from "../../Definitions/DefinitionObjects/merger/blend.json"
import mergerCenterJson from "../../Definitions/DefinitionObjects/merger/center.json"
import mergerAbsoluteJson from "../../Definitions/DefinitionObjects/merger/absolute.json"
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
import { isPopulatedString } from "../../Utility/Is"

export const mergerDefaultId = "com.moviemasher.merger.default"

export const mergerDefinition = (object : MergerDefinitionObject) : MergerDefinition => {
  const { id } = object
  const idString = id && isPopulatedString(id) ? id : mergerDefaultId
  if (Definitions.installed(idString)) return <MergerDefinition> Definitions.fromId(idString)

  return new MergerDefinitionClass({ ...object, type: DefinitionType.Merger, id: idString })
}

export const mergerDefinitionFromId = (id : string) : MergerDefinition => {
  return mergerDefinition({ id })
}

export const mergerInstance = (object: MergerObject): Merger => {
  const { definitionId = mergerDefaultId } = object

  const definition = mergerDefinition({ id: definitionId })
  return definition.instanceFromObject(object)
}

export const mergerFromId = (definitionId : string) : Merger => {
  return mergerInstance({ definitionId })
}

export const mergerInitialize = () : void => {
  [
    mergerBlendJson,
    mergerCenterJson,
    mergerAbsoluteJson,
    mergerDefaultJson,
    mergerOverlayJson,
  ].forEach(object => mergerInstall(object))
}

export const mergerInstall = (object : MergerDefinitionObject) : MergerDefinition => {
  const { id } = object
  const idString = id && isPopulatedString(id) ? id : mergerDefaultId
  Definitions.uninstall(idString)
  const instance = mergerDefinition(object)
  Definitions.install(instance)
  return instance
}

export const MergerFactoryImplementation : MergerFactory = {
  install: mergerInstall,
  definition: mergerDefinition,
  definitionFromId: mergerDefinitionFromId,
  fromId: mergerFromId,
  initialize: mergerInitialize,
  instance: mergerInstance,
}

Factories[DefinitionType.Merger] = MergerFactoryImplementation
