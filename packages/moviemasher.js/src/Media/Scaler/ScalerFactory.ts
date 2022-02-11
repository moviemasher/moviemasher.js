import { DefinitionType } from "../../Setup/Enums"
import { Is } from "../../Utility/Is"
import { Definitions } from "../../Definitions"
import { Factories } from "../../Definitions/Factories"
import { ScalerDefinitionClass } from "./ScalerDefinition"
import {
  Scaler, ScalerDefinition, ScalerDefinitionObject, ScalerObject
} from "./Scaler"

import scalerDefaultJson from "../../Definitions/DefinitionObjects/scaler/default.json"
import scalerPanJson from "../../Definitions/DefinitionObjects/scaler/pan.json"
import scalerScaleJson from "../../Definitions/DefinitionObjects/scaler/scale.json"

const scalerDefaultId = "com.moviemasher.scaler.default"

const scalerDefinition = (object : ScalerDefinitionObject) : ScalerDefinition => {
  const { id } = object
  const idString = id && Is.populatedString(id) ? id : scalerDefaultId
  if (Definitions.installed(idString)) return <ScalerDefinition> Definitions.fromId(idString)

  return new ScalerDefinitionClass({ ...object, type: DefinitionType.Scaler, id: idString })
}

const scalerDefinitionFromId = (id : string) : ScalerDefinition => {
  return scalerDefinition({ id })
}

const scalerInstance = (object: ScalerObject): Scaler => {
  const { definitionId } = object

  const definition = scalerDefinition({ id: definitionId })
  return definition.instanceFromObject(object)
}

const scalerFromId = (definitionId : string) : Scaler => {
  return scalerInstance({ definitionId })
}

const scalerInitialize = () : void => {
  new ScalerDefinitionClass(scalerDefaultJson)
  new ScalerDefinitionClass(scalerPanJson)
  new ScalerDefinitionClass(scalerScaleJson)
}

const scalerDefine = (object : ScalerDefinitionObject) : ScalerDefinition => {
  const { id } = object
  const idString = id && Is.populatedString(id) ? id : scalerDefaultId

  Definitions.uninstall(idString)
  return scalerDefinition(object)
}

const ScalerFactoryImplementation = {
  define: scalerDefine,
  install: scalerDefine,
  definitionFromId: scalerDefinitionFromId,
  definition: scalerDefinition,
  instance: scalerInstance,
  fromId: scalerFromId,
  initialize: scalerInitialize,
}

Factories[DefinitionType.Scaler] = ScalerFactoryImplementation

export {
  scalerDefine,
  scalerDefine as scalerInstall,
  scalerDefaultId,
  scalerDefinition,
  scalerDefinitionFromId,
  ScalerFactoryImplementation,
  scalerFromId,
  scalerInitialize,
  scalerInstance,
}
