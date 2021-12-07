import { DefinitionType } from "../../Setup/Enums"
import { MergerDefinitionClass } from "../Merger/MergerDefinition"
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
} from "../Merger/Merger"
import { Factories } from "../../Definitions/Factories"
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

const mergerInstance = (object: MergerObject): Merger => {
  const { definitionId } = object

  const definition = mergerDefinition({ id: definitionId })
  return definition.instanceFromObject(object)
}

const mergerFromId = (definitionId : string) : Merger => {
  return mergerInstance({ definitionId })
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

Factories[DefinitionType.Merger] = MergerFactoryImplementation

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
