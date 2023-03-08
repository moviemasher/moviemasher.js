import { EffectType } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { Effect, EffectMedia, EffectMediaObject, EffectObject } from "./Effect"
import { EffectClass } from "./EffectClass"
import { TweenableDefinitionMixin } from "../../Mixin/Tweenable/TweenableDefinitionMixin"
import { MediaBase } from "../MediaBase"
import { ContainerDefinitionMixin } from "../Container/ContainerDefinitionMixin"
import { Filter } from "../../Plugin/Filter/Filter"
import { UnknownRecord } from "../../Types/Core"
import { filterInstance } from "../../Plugin/Filter/FilterFactory"

const EffectContainerDefinitionWithTweenable = TweenableDefinitionMixin(MediaBase)
const EffectContainerDefinitionWithContainer = ContainerDefinitionMixin(EffectContainerDefinitionWithTweenable)

export class EffectMediaClass extends EffectContainerDefinitionWithContainer implements EffectMedia {
  constructor(object: EffectMediaObject) {
    super(object)
    this.properties.push(propertyInstance({ name: "label", defaultValue: "" }))

    const { properties, filters, initializeFilter, finalizeFilter } = object
    if (properties?.length) this.properties.push(...properties.map(property =>
      propertyInstance({ ...property, custom: true })
    ))
    if (initializeFilter) this.initializeFilter = filterInstance(initializeFilter)
    if (finalizeFilter) this.finalizeFilter = filterInstance(finalizeFilter)
    if (filters) this.filters.push(...filters.map(filter => filterInstance(filter)))
  }

  filters : Filter[] = []

  finalizeFilter?: Filter

  initializeFilter?: Filter

  instanceArgs(object: EffectObject): EffectObject {
    const args = super.instanceArgs(object)
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


  type = EffectType



}
