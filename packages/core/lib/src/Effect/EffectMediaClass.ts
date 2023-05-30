import type {Effect, EffectMedia, EffectMediaObject, EffectObject} from './Effect.js'
import type {Filter} from '../Plugin/Filter/Filter.js'
import type {UnknownRecord} from '@moviemasher/runtime-shared'

import {EffectClass} from './EffectClass.js'
import {filterInstance} from '../Plugin/Filter/FilterFactory.js'
import { propertyInstance } from "../Setup/PropertyFunctions.js"
import { TypeEffect } from "../Setup/EnumConstantsAndFunctions.js"
import { PropertiedClass } from '../Base/PropertiedClass.js'
import { TranslateArgs } from '../index.js'

export class EffectMediaClass extends PropertiedClass implements EffectMedia {
  constructor(object: EffectMediaObject) {
    super(object)
    this.properties.push(propertyInstance({ name: 'label', defaultValue: '' }))

    const { properties, filters, initializeFilter, finalizeFilter } = object
    if (properties?.length) this.properties.push(...properties.map(property =>
      propertyInstance({ ...property, custom: true })
    ))
    if (initializeFilter) this.initializeFilter = filterInstance(initializeFilter)
    if (finalizeFilter) this.finalizeFilter = filterInstance(finalizeFilter)
    if (filters) this.filters.push(...filters.map(filter => filterInstance(filter)))
  }
  id = ''
  label?: string | TranslateArgs | undefined

  get assetIds(): string[] { return [this.id] }

  filters : Filter[] = []

  finalizeFilter?: Filter

  initializeFilter?: Filter

  instanceArgs(args: EffectObject): EffectObject {
    args.label ||= this.label
    return args
  }

  instanceFromObject(object: EffectObject): Effect {
    return new EffectClass(this.instanceArgs(object))
  }

  toJSON(): UnknownRecord {
    const object = super.toJSON()
    const custom = this.properties.filter(property => property.custom)
    if (custom.length) object.properties = custom
    if (this.filters.length) object.filters = this.filters
    return object
  }

  type = TypeEffect
}
