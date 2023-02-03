import { DefinitionType } from "../../Setup/Enums"
import { EffectDefinitionClass } from "./EffectDefinitionClass"
import { Effect, EffectDefinition, EffectObject, EffectDefinitionObject } from "./Effect"
import { assertPopulatedString } from "../../Utility/Is"

import effectBlurJson from "../../DefinitionObjects/effect/blur.json"
import effectChromaKeyJson from "../../DefinitionObjects/effect/chromakey.json"
import effectEmbossJson from "../../DefinitionObjects/effect/emboss.json"
import effectGrayscaleJson from "../../DefinitionObjects/effect/grayscale.json"
import effectSepiaJson from "../../DefinitionObjects/effect/sepia.json"
import effectSharpenJson from "../../DefinitionObjects/effect/sharpen.json"
import effectRippleJson from "../../DefinitionObjects/effect/ripple.json"
import { ModuleDefaults } from "../ModuleDefaults"
import { ModuleFactories } from "../ModuleFactories"

export const effectDefinition = (object : EffectDefinitionObject) : EffectDefinition => {
  const { id } = object
  assertPopulatedString(id)
  return new EffectDefinitionClass({...object, type: DefinitionType.Effect })
}

export const effectDefinitionFromId = (id: string): EffectDefinition => {
  const definition = ModuleDefaults[DefinitionType.Effect].find(definition => 
    definition.id === id
  )
  if (definition) return definition as EffectDefinition

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
ModuleFactories[DefinitionType.Effect] = effectDefinition
ModuleDefaults[DefinitionType.Effect].push(
  effectDefinition(effectBlurJson),
  effectDefinition(effectChromaKeyJson),
  effectDefinition(effectEmbossJson),
  effectDefinition(effectGrayscaleJson),
  effectDefinition(effectSepiaJson),
  effectDefinition(effectSharpenJson),
  effectDefinition(effectRippleJson),
)