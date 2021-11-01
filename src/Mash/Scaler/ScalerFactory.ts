import { DefinitionType } from "../../Setup/Enums"
import { ScalerDefinitionClass } from "../Scaler/ScalerDefinition"
import {
  Scaler,
  ScalerDefinition,
  ScalerDefinitionObject,
  ScalerObject
} from "../Scaler/Scaler"
import { Definitions } from "../Definitions"
import { Factories } from "../Factories"
import scalerDefaultJson from "../Scaler/DefinitionObjects/default.json"
import scalerPanJson from "../Scaler/DefinitionObjects/pan.json"
import scalerScaleJson from "../Scaler/DefinitionObjects/scale.json"
import { Is } from "../../Utilities/Is"

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

Factories.scaler = ScalerFactoryImplementation

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
