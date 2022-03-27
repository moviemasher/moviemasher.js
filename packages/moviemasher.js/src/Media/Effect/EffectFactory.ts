import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { EffectDefinitionClass } from "./EffectDefinitionClass"
import { Definitions } from "../../Definitions"
import { Factories } from "../../Definitions/Factories"
import { Is } from "../../Utility/Is"
import { Effect, EffectDefinition, EffectObject, EffectDefinitionObject } from "./Effect"

import effectBlurJson from "../../Definitions/DefinitionObjects/effect/blur.json"
import effectChromaKeyJson from "../../Definitions/DefinitionObjects/effect/chromakey.json"
import effectEmbossJson from "../../Definitions/DefinitionObjects/effect/emboss.json"
import effectGrayscaleJson from "../../Definitions/DefinitionObjects/effect/grayscale.json"
import effectSepiaJson from "../../Definitions/DefinitionObjects/effect/sepia.json"
import effectSharpenJson from "../../Definitions/DefinitionObjects/effect/sharpen.json"
import effectTextJson from "../../Definitions/DefinitionObjects/effect/text.json"


const effectDefinition = (object : EffectDefinitionObject) : EffectDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id + JSON.stringify(object)

  if (Definitions.installed(id)) return <EffectDefinition> Definitions.fromId(id)

  return new EffectDefinitionClass({...object, type: DefinitionType.Effect })
}

const effectDefinitionFromId = (id : string) : EffectDefinition => {
  return effectDefinition({ id })
}

const effectInstance = (object: EffectObject): Effect => {
  const { definitionId = '' } = object
  const definition = effectDefinition({ id: definitionId })

  const args = { ...object, definitionId }
  return definition.instanceFromObject(args)
}

const effectFromId = (definitionId : string) : Effect => {
  return effectInstance({ definitionId })
}


// const effectInstance = (object : EffectObject) : Effect => {
//   const definition = effectDefinition(object)
//   const instance = definition.instanceFromObject(object)
//   return instance
// }

// const effectFromId = (id : string) : Effect => {
//   return effectInstance({ id })
// }

const effectInitialize = () : void => {
  [
    effectBlurJson,
    effectChromaKeyJson,
    effectEmbossJson,
    effectGrayscaleJson,
    effectSepiaJson,
    effectSharpenJson,
    effectTextJson,
  ].forEach(instance => effectInstall(instance))
}

const effectInstall = (object : EffectDefinitionObject) : EffectDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id

  Definitions.uninstall(id)
  const instance = effectDefinition(object)
  Definitions.install(instance)
  return instance
}

const EffectFactoryImplementation = {
  definition: effectDefinition,
  definitionFromId: effectDefinitionFromId,
  fromId: effectFromId,
  initialize: effectInitialize,
  install: effectInstall,
  instance: effectInstance,
}

Factories[DefinitionType.Effect] = EffectFactoryImplementation

export {
  effectDefinition,
  effectDefinitionFromId,
  EffectFactoryImplementation,
  effectFromId,
  effectInstall,
  effectInitialize,
  effectInstance,
}
