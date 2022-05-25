import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { EffectDefinitionClass } from "./EffectDefinitionClass"
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
import { EffectClass } from "./EffectClass"

export const effectDefinition = (object : EffectDefinitionObject) : EffectDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id + JSON.stringify(object)

  return new EffectDefinitionClass({...object, type: DefinitionType.Effect })
}

export const effectDefaults = [
  effectDefinition(effectBlurJson),
  effectDefinition(effectChromaKeyJson),
  effectDefinition(effectEmbossJson),
  effectDefinition(effectGrayscaleJson),
  effectDefinition(effectSepiaJson),
  effectDefinition(effectSharpenJson),
  effectDefinition(effectTextJson),
]

export const effectDefinitionFromId = (id: string): EffectDefinition => {
  const definition = effectDefaults.find(definition => definition.id === id)
  if (definition) return definition

  return effectDefinition({ id })
}

export const effectInstance = (object: EffectObject): Effect => {
  const { definitionId = '' } = object
  const definition = effectDefinitionFromId(definitionId)
  return definition.instanceFromObject(object)
}

export const effectFromId = (definitionId: string): Effect => {
  const definition = effectDefinitionFromId(definitionId)
  return definition.instance
}

export const isEffect = (value?: any): value is Effect => value instanceof EffectClass

Factories[DefinitionType.Effect] = {
  definition: effectDefinition,
  definitionFromId: effectDefinitionFromId,
  fromId: effectFromId,
  instance: effectInstance,
  defaults: effectDefaults,
}
