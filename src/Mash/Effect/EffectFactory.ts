import { DefinitionType } from "../../Setup/Enums"
import { UnknownObject } from "../../Setup/declarations"
import { Errors } from "../../Setup/Errors"
import { EffectDefinitionClass } from "./EffectDefinition"
import { Definitions } from "../Definitions"

import effectBlurJson from "./DefinitionObjects/blur.json"
import effectChromaKeyJson from "./DefinitionObjects/chromakey.json"
import effectEmbossJson from "./DefinitionObjects/emboss.json"
import effectGrayscaleJson from "./DefinitionObjects/grayscale.json"
import effectSepiaJson from "./DefinitionObjects/sepia.json"
import effectSharpenJson from "./DefinitionObjects/sharpen.json"
import effectTextJson from "./DefinitionObjects/text.json"
import { Effect, EffectDefinition, EffectObject, EffectDefinitionObject } from "./Effect"
import { Factories } from "../Factories"
import { Is } from "../../Utilities/Is"


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
  instance: effectInstance,
}

Factories.effect = EffectFactoryImplementation

export {
  effectDefine,
  effectDefinition,
  effectDefinitionFromId,
  EffectFactoryImplementation,
  effectFromId,
  effectInitialize,
  effectInstance,
}
