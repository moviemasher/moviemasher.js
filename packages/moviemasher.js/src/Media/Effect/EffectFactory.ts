import { EffectType } from "../../Setup/Enums"
import { EffectDefinitionClass } from "./EffectDefinitionClass"
import { Effect, EffectDefinition, EffectObject, EffectDefinitionObject } from "./Effect"
import { assertPopulatedString } from "../../Utility/Is"

import effectBlurJson from "../../MediaObjects/effect/blur.json"
import effectChromaKeyJson from "../../MediaObjects/effect/chromakey.json"
import effectEmbossJson from "../../MediaObjects/effect/emboss.json"
import effectGrayscaleJson from "../../MediaObjects/effect/grayscale.json"
import effectSepiaJson from "../../MediaObjects/effect/sepia.json"
import effectSharpenJson from "../../MediaObjects/effect/sharpen.json"
import { MediaFactories } from "../MediaFactories"
import { MediaDefaults } from "../MediaDefaults"

export const effectDefinition = (object : EffectDefinitionObject) : EffectDefinition => {
  const { id } = object
  assertPopulatedString(id)
  return new EffectDefinitionClass({...object, type: EffectType })
}

export const effectDefinitionFromId = (id: string): EffectDefinition => {
  const definition = MediaDefaults[EffectType].find(object => object.id === id)
  if (definition) return definition as EffectDefinition

  return effectDefinition({ id })
}

export const effectInstance = (object: EffectObject): Effect => {
  const { mediaId = '' } = object
  const definition = effectDefinitionFromId(mediaId)
  return definition.instanceFromObject(object)
}

export const effectFromId = (id: string): Effect => {
  return effectDefinitionFromId(id).instanceFromObject()
}
MediaFactories[EffectType] = effectDefinition
MediaDefaults[EffectType].push(
  effectDefinition(effectBlurJson),
  effectDefinition(effectChromaKeyJson),
  effectDefinition(effectEmbossJson),
  effectDefinition(effectGrayscaleJson),
  effectDefinition(effectSepiaJson),
  effectDefinition(effectSharpenJson),
)