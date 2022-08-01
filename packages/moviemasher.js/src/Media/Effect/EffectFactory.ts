import { DefinitionType } from "../../Setup/Enums"
import { EffectDefinitionClass } from "./EffectDefinitionClass"
import { Factories } from "../../Definitions/Factories"
import { Effect, EffectDefinition, EffectObject, EffectDefinitionObject } from "./Effect"
import { assertPopulatedString } from "../../Utility/Is"

import effectBlurJson from "../../Definitions/DefinitionObjects/effect/blur.json"
import effectChromaKeyJson from "../../Definitions/DefinitionObjects/effect/chromakey.json"
import effectEmbossJson from "../../Definitions/DefinitionObjects/effect/emboss.json"
import effectGrayscaleJson from "../../Definitions/DefinitionObjects/effect/grayscale.json"
import effectSepiaJson from "../../Definitions/DefinitionObjects/effect/sepia.json"
import effectSharpenJson from "../../Definitions/DefinitionObjects/effect/sharpen.json"
import effectTextJson from "../../Definitions/DefinitionObjects/effect/text.json"

export const effectDefinition = (object : EffectDefinitionObject) : EffectDefinition => {
  const { id } = object
  assertPopulatedString(id)
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
  // console.log("effectInstance", definitionId, object)
  const definition = effectDefinitionFromId(definitionId)
  return definition.instanceFromObject(object)
}

export const effectFromId = (definitionId: string): Effect => {
  const definition = effectDefinitionFromId(definitionId)
  return definition.instanceFromObject()
}

Factories[DefinitionType.Effect] = {
  definition: effectDefinition,
  definitionFromId: effectDefinitionFromId,
  fromId: effectFromId,
  instance: effectInstance,
  defaults: effectDefaults,
}
