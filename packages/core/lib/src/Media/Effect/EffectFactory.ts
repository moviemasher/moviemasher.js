import { TypeEffect} from '../../Setup/Enums.js'
import {EffectMediaClass} from './EffectMediaClass.js'
import {Effect, EffectMedia, EffectObject, EffectMediaObject} from './Effect.js'
import {assertPopulatedString} from '../../Utility/Is.js'

import {MediaFactories} from '../MediaFactories.js'
import {MediaDefaults} from '../MediaDefaults.js'

export const effectDefinition = (object : EffectMediaObject) : EffectMedia => {
  const { id } = object
  assertPopulatedString(id)
  return new EffectMediaClass({...object, type: TypeEffect })
}

export const effectDefinitionFromId = (id: string): EffectMedia => {
  const definition = MediaDefaults[TypeEffect].find(object => object.id === id)
  if (definition) return definition as EffectMedia

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
MediaFactories[TypeEffect] = effectDefinition
