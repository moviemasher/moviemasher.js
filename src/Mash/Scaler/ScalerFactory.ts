import { DefinitionType } from "../../Setup/Enums"
import { Is } from "../../Utilities/Is"
import { Definitions } from "../Definitions"
import { Factories } from "../Factories"
import { ScalerDefinitionClass } from "../Scaler/ScalerDefinition"
import {
  Scaler, ScalerDefinition, ScalerDefinitionObject, ScalerObject
} from "../Scaler/Scaler"

import scalerDefaultJson from "../../DefinitionObjects/scaler/default.json"
import scalerPanJson from "../../DefinitionObjects/scaler/pan.json"
import scalerScaleJson from "../../DefinitionObjects/scaler/scale.json"

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

const scalerInstance = (object : ScalerObject) : Scaler => {
  return scalerDefinition(object).instanceFromObject(object)
}

const scalerFromId = (id : string) : Scaler => {
  return scalerInstance({ id })
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
