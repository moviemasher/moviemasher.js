import { DefinitionType } from "../../Setup/Enums"
import { Is } from "../../Utility/Is"
import { Factories } from "../../Definitions/Factories"
import { ScalerDefinitionClass } from "./ScalerDefinition"
import { Scaler, ScalerDefinition, ScalerDefinitionObject, ScalerObject } from "./Scaler"

import scalerDefaultJson from "../../Definitions/DefinitionObjects/scaler/default.json"
import scalerPanJson from "../../Definitions/DefinitionObjects/scaler/pan.json"
import scalerStretchJson from "../../Definitions/DefinitionObjects/scaler/stretch.json"

export const scalerDefaultId = "com.moviemasher.scaler.default"

export const scalerDefinition = (object : ScalerDefinitionObject) : ScalerDefinition => {
  const { id: idString } = object
  const id = idString && Is.populatedString(idString) ? idString : scalerDefaultId

  return new ScalerDefinitionClass({ ...object, type: DefinitionType.Scaler, id })
}

export const scalerDefaults = [
  scalerDefinition(scalerDefaultJson),
  scalerDefinition(scalerPanJson),
  scalerDefinition(scalerStretchJson),
]

export const scalerDefinitionFromId = (id: string): ScalerDefinition => {
  const definition = scalerDefaults.find(definition => definition.id === id)
  if (definition) return definition

  return scalerDefinition({ id })
}

export const scalerInstance = (object: ScalerObject): Scaler => {
  const { definitionId = scalerDefaultId } = object
  const definition = scalerDefinitionFromId(definitionId)
  return definition.instanceFromObject(object)
}

export const scalerFromId = (definitionId : string) : Scaler => {
  return scalerInstance({ definitionId })
}

Factories[DefinitionType.Scaler] = {
  definitionFromId: scalerDefinitionFromId,
  definition: scalerDefinition,
  instance: scalerInstance,
  fromId: scalerFromId,
  defaults: scalerDefaults,
}
