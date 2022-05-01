import { DefinitionType } from "../../Setup/Enums"
import { Is } from "../../Utility/Is"
import { Definitions } from "../../Definitions"
import { Factories } from "../../Definitions/Factories"
import { ScalerDefinitionClass } from "./ScalerDefinition"
import { Scaler, ScalerDefinition, ScalerDefinitionObject, ScalerObject } from "./Scaler"

import scalerDefaultJson from "../../Definitions/DefinitionObjects/scaler/default.json"
import scalerPanJson from "../../Definitions/DefinitionObjects/scaler/pan.json"
import scalerStretchJson from "../../Definitions/DefinitionObjects/scaler/stretch.json"

export const scalerDefaultId = "com.moviemasher.scaler.default"

export const scalerDefinition = (object : ScalerDefinitionObject) : ScalerDefinition => {
  const { id } = object
  const idString = id && Is.populatedString(id) ? id : scalerDefaultId
  if (Definitions.installed(idString)) return <ScalerDefinition> Definitions.fromId(idString)

  return new ScalerDefinitionClass({ ...object, type: DefinitionType.Scaler, id: idString })
}

export const scalerDefinitionFromId = (id : string) : ScalerDefinition => {
  return scalerDefinition({ id })
}

export const scalerInstance = (object: ScalerObject): Scaler => {
  const { definitionId = scalerDefaultId } = object
  const definition = scalerDefinition({ id: definitionId })

  const args = { ...object, definitionId }
  return definition.instanceFromObject(args)
}

export const scalerFromId = (definitionId : string) : Scaler => {
  return scalerInstance({ definitionId })
}

export const scalerInitialize = (): void => {
  [
    scalerDefaultJson,
    scalerPanJson,
    scalerStretchJson,
  ].forEach(object => scalerInstall(object))
}

export const scalerInstall = (object : ScalerDefinitionObject) : ScalerDefinition => {
  const { id = scalerDefaultId } = object
  Definitions.uninstall(id)
  const args = { ...object, id }
  const instance = scalerDefinition(args)
  Definitions.install(instance)
  return instance
}

export const ScalerFactoryImplementation = {
  install: scalerInstall,
  definitionFromId: scalerDefinitionFromId,
  definition: scalerDefinition,
  instance: scalerInstance,
  fromId: scalerFromId,
  initialize: scalerInitialize,
}

Factories[DefinitionType.Scaler] = ScalerFactoryImplementation
