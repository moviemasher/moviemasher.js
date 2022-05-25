import { DefinitionType } from "../../Setup/Enums"
import { MergerDefinitionClass } from "./MergerDefinition"
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
} from "./Merger"
import { Factories } from "../../Definitions/Factories"
import { isPopulatedString } from "../../Utility/Is"

export const mergerDefaultId = "com.moviemasher.merger.default"

export const mergerDefinition = (object : MergerDefinitionObject) : MergerDefinition => {
  const { id } = object
  const idString = id && isPopulatedString(id) ? id : mergerDefaultId

  return new MergerDefinitionClass({ ...object, type: DefinitionType.Merger, id: idString })
}

export const mergerDefaults = [
  mergerDefinition(mergerBlendJson),
  mergerDefinition(mergerCenterJson),
  mergerDefinition(mergerAbsoluteJson),
  mergerDefinition(mergerDefaultJson),
  mergerDefinition(mergerOverlayJson),
]
export const mergerDefinitionFromId = (id: string): MergerDefinition => {
  const definition = mergerDefaults.find(definition => definition.id === id)
  if (definition) return definition

  return mergerDefinition({ id })
}

export const mergerInstance = (object: MergerObject): Merger => {
  const { definitionId = mergerDefaultId } = object
  const definition = mergerDefinitionFromId(definitionId)
  return definition.instanceFromObject(object)
}

export const mergerFromId = (definitionId: string): Merger => {
  return mergerInstance({ definitionId })
}

Factories[DefinitionType.Merger] = {
  definition: mergerDefinition,
  definitionFromId: mergerDefinitionFromId,
  fromId: mergerFromId,
  instance: mergerInstance,
  defaults: mergerDefaults,
}
