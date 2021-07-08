import { Modular, ModularDefinitionObject } from "./Modular"
import { Property, PropertyObject } from "../../../Setup/Property"
import { Any, Constrained, JsonObject, ScalarValue, Size } from "../../../Setup/declarations"
import { Errors } from "../../../Setup/Errors"
import { TimeRange } from "../../../Utilities/TimeRange"
import { Is } from "../../../Utilities/Is"
import { VisibleContext } from "../../../Playing"
import { Definition } from "../../Definition/Definition"
import { Filter } from "../../Filter/Filter"
import { Evaluator } from "../../../Utilities/Evaluator"
import { filterInstance } from "../../Filter"

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function ModularDefinitionMixin<TBase extends Constrained<Definition>>(Base: TBase) {
  return class extends Base {
    constructor(...args : Any[]) {
      super(...args)
      const [object] = args
      const { properties, filters } = <ModularDefinitionObject> object
      if (properties) {
        const propertyInstances = Object.entries(properties).map(entry => {
          const [name, propertyObject] = entry
          if (!Is.object(propertyObject)) throw Errors.invalid.property + "name " + name

          const property : PropertyObject = Object.assign(propertyObject, { name, custom: true })
          return new Property(property)
        })
        this.properties.push(...propertyInstances)
        //console.log("ModularDefinition", this.id, "properties", this.properties.map(p => `${p.name} => ${p.value}`))
      }

      if (filters) {
        const filterInstances = filters.map(filter => {
          const { id } = filter
          if (!id) throw Errors.id

          return filterInstance(filter)
        })
        this.filters.push(...filterInstances)
      }
    }

    drawFilters(modular: Modular, range : TimeRange, context : VisibleContext, size : Size, outContext?: VisibleContext) : VisibleContext {
      // range's frame is offset of draw time in clip = frames is duration
      let contextFiltered = context
      this.filters.forEach(filter => {
        const evaluator = this.evaluator(modular, range, contextFiltered, size, outContext)
        contextFiltered = filter.drawFilter(evaluator)
      })
      return contextFiltered
    }

    evaluator(modular: Modular, range : TimeRange, context : VisibleContext, size : Size, mergerContext? : VisibleContext) : Evaluator {
      const instance = new Evaluator(range, context, size, mergerContext)
      this.propertiesCustom.forEach(property => {
        const value = <ScalarValue> modular.value(property.name)
        instance.set(property.name, value)
      })
      return instance
    }

    filters : Filter[] = []

    get propertiesCustom() : Property[] {
      return this.properties.filter(property => property.custom)
    }

    retain = true

    toJSON() : JsonObject {
      const object = super.toJSON()
      if (this.filters.length) object.filters = this.filters
      const entries = this.propertiesCustom.map(property => [property.name, property])
      if (entries.length) object.properties = Object.fromEntries(entries)

      return object
    }
  }
}

export { ModularDefinitionMixin }
