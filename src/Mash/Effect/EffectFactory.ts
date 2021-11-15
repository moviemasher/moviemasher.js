import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { EffectDefinitionClass } from "./EffectDefinition"
import { Definitions } from "../Definitions"
import { Factories } from "../Factories"
import { Is } from "../../Utilities/Is"
import { Effect, EffectDefinition, EffectObject, EffectDefinitionObject } from "./Effect"

import effectBlurJson from "../../DefinitionObjects/effect/blur.json"
import effectChromaKeyJson from "../../DefinitionObjects/effect/chromakey.json"
import effectEmbossJson from "../../DefinitionObjects/effect/emboss.json"
import effectGrayscaleJson from "../../DefinitionObjects/effect/grayscale.json"
import effectSepiaJson from "../../DefinitionObjects/effect/sepia.json"
import effectSharpenJson from "../../DefinitionObjects/effect/sharpen.json"
import effectTextJson from "../../DefinitionObjects/effect/text.json"


const effectDefinition = (object : EffectDefinitionObject) : EffectDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id

  if (Definitions.installed(id)) return <EffectDefinition> Definitions.fromId(id)

  return new EffectDefinitionClass({...object, type: DefinitionType.Effect })
}

const effectDefinitionFromId = (id : string) : EffectDefinition => {
  return effectDefinition({ id })
}

const effectInstance = (object : EffectObject) : Effect => {
  const definition = effectDefinition(object)
  const instance = definition.instanceFromObject(object)
  return instance
}

const effectFromId = (id : string) : Effect => {
  return effectInstance({ id })
}

const effectInitialize = () : void => {
  new EffectDefinitionClass(effectBlurJson)
  new EffectDefinitionClass(effectChromaKeyJson)
  new EffectDefinitionClass(effectEmbossJson)
  new EffectDefinitionClass(effectGrayscaleJson)
  new EffectDefinitionClass(effectSepiaJson)
  new EffectDefinitionClass(effectSharpenJson)
  new EffectDefinitionClass(effectTextJson)
}

const effectDefine = (object : EffectDefinitionObject) : EffectDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id

  Definitions.uninstall(id)
  return effectDefinition(object)
}

const EffectFactoryImplementation = {
  define: effectDefine,
  definition: effectDefinition,
  definitionFromId: effectDefinitionFromId,
  fromId: effectFromId,
  initialize: effectInitialize,
  install: effectDefine,
  instance: effectInstance,
}

Factories[DefinitionType.Effect] = EffectFactoryImplementation

export {
  effectDefine,
  effectDefinition,
  effectDefinitionFromId,
  EffectFactoryImplementation,
  effectFromId,
  effectDefine as effectInstall,
  effectInitialize,
  effectInstance,
}
