import {EffectMediaClass} from './EffectMediaClass.js'
import {Effect, EffectMedia, EffectObject, EffectMediaObject} from './Effect.js'
import {assertPopulatedString} from '../Shared/SharedGuards.js'


export const effectDefinition = (object : EffectMediaObject) : EffectMedia => {
  const { id } = object
  assertPopulatedString(id)
  return new EffectMediaClass(object)
}

export const effectDefinitionFromId = (id: string): EffectMedia => {

  return effectDefinition({ id })
}

export const effectInstance = (object: EffectObject): Effect => {
  const { id = '' } = object
  const definition = effectDefinitionFromId(id)
  return definition.instanceFromObject(object)
}

export const effectFromId = (id: string): Effect => {
  return effectDefinitionFromId(id).instanceFromObject()
}
