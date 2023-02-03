import { UnknownObject} from "../../declarations"
import { propertyInstance } from "../../Setup/Property"
import { DefinitionClass } from "../../Definition/Definition"
import {
  ModularDefinition, ModularDefinitionClass, ModularDefinitionObject
} from "./Modular"
import { Filter } from "../../Module/Filter/Filter"
import { filterInstance } from "../../Module/Filter/FilterFactory"

export function ModularDefinitionMixin<T extends DefinitionClass>(Base: T) : ModularDefinitionClass & T {
  return class extends Base implements ModularDefinition {
    constructor(...args : any[]) {
      super(...args)
      const [object] = args
      const { properties, filters, initializeFilter, finalizeFilter } = object as ModularDefinitionObject
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

    toJSON() : UnknownObject {
      const object = super.toJSON()
      const custom = this.properties.filter(property => property.custom)
      if (custom.length) object.properties = custom
      if (this.filters.length) object.filters = this.filters
      return object
    }
  }
}
