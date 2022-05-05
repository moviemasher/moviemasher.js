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

export const effectDefinition = (object : EffectDefinitionObject) : EffectDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.id + JSON.stringify(object)

  return new EffectDefinitionClass({...object, type: DefinitionType.Effect })
}

const EffectDefinitions = {
  [effectBlurJson.id]: effectDefinition(effectBlurJson),
  [effectChromaKeyJson.id]: effectDefinition(effectChromaKeyJson),
  [effectEmbossJson.id]: effectDefinition(effectEmbossJson),
  [effectGrayscaleJson.id]: effectDefinition(effectGrayscaleJson),
  [effectSepiaJson.id]: effectDefinition(effectSepiaJson),
  [effectSharpenJson.id]: effectDefinition(effectSharpenJson),
  [effectTextJson.id]: effectDefinition(effectTextJson),
}

export const effectDefinitionFromId = (id: string): EffectDefinition => {
  const definition = EffectDefinitions[id]
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

export const EffectFactoryImplementation = {
  definition: effectDefinition,
  definitionFromId: effectDefinitionFromId,
  fromId: effectFromId,
  instance: effectInstance,
}

Factories[DefinitionType.Effect] = EffectFactoryImplementation
