import { Modular, ModularDefinitionClass, ModularDefinitionObject } from "./Modular"
import { Property, PropertyObject } from "../../Setup/Property"
import { Any, GraphFilter, UnknownObject, Value, Size, Layer, LayerArgs, GraphFile } from "../../declarations"
import { Errors } from "../../Setup/Errors"
import { TimeRange } from "../../Helpers/TimeRange"
import { Is } from "../../Utilities/Is"
import { VisibleContext } from "../../Context"
import { DefinitionClass } from "../../Base/Definition"
import { Filter } from "../../Media/Filter/Filter"
import { Evaluator } from "../../Helpers/Evaluator"
import { filterInstance } from "../../Media/Filter"
import { Definitions } from "../../Definitions/Definitions"
import { DefinitionType } from "../../Setup/Enums"
import { FontDefinition } from "../../Media/Font/Font"

function ModularDefinitionMixin<T extends DefinitionClass>(Base: T) : ModularDefinitionClass & T {
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
      }
      if (filters) {
        const filterInstances = filters.map(filter => {
          const { id } = filter
          if (!id) throw Errors.id + JSON.stringify(filter)

          return filterInstance(filter)
        })
        this.filters.push(...filterInstances)
      }
    }

    drawFilters(modular: Modular, range : TimeRange, clipRange: TimeRange, context : VisibleContext, size : Size, outContext?: VisibleContext) : VisibleContext {
     // range's frame is offset of draw time in clip = frames is duration of clip
      let contextFiltered = context
      this.filters.forEach(filter => {
        const evaluator: Evaluator = this.evaluator(modular, range, size, contextFiltered, outContext)
        contextFiltered = filter.drawFilter(evaluator)
      })
      return contextFiltered
    }

    evaluator(modular: Modular, range : TimeRange, size : Size, context? : VisibleContext, mergerContext? : VisibleContext) : Evaluator {
      const instance = new Evaluator(range, size, context, mergerContext)
      this.propertiesCustom.forEach(property => {
        const value = <Value> modular.value(property.name)
        instance.set(property.name, value)
      })
      return instance
    }

    fileLayer(layer: Layer, modular: Modular) {
      const modularProperties = this.propertiesModular
      const ids = modularProperties.map(property => String(modular.value(property.name)))
      ids.forEach(id => {
        const definition = Definitions.fromId(id)
        const { type } = definition
        switch (type) {
          case DefinitionType.Font: {
            const fontDefinition = definition as FontDefinition
            const graphFile: GraphFile = {
              type, source: fontDefinition.source
            }
            layer.files.push(graphFile)
            break
          }
        }
      })
    }
    filters : Filter[] = []

    filtrateLayer(layer: Layer, modular: Modular, args: LayerArgs): void {
      this.fileLayer(layer, modular)

      const graphFilters = this.graphFilters(layer, modular, args)
      layer.filters.push(...graphFilters)
      // const { length } = graphFilters
      // graphFilters.forEach((graphFilter, index) => {
      //   console.log(this.constructor.name, "filtrateLayer graphFilter", graphFilter.filter, index + 1, "of", length, "prevFilter", args.prevFilter?.filter, "outputs", args.prevFilter?.outputs?.join(', '))

      //   args.prevFilter = graphFilter
      // })
    }

    graphFilters(layer: Layer, modular: Modular, args: LayerArgs): GraphFilter[] {
      const { size, clipTimeRange, timeRange } = args

      const range = clipTimeRange.scale(timeRange.fps)
      const frame = Math.max(0, timeRange.frame - range.frame)
      const crazyRange = range.withFrame(frame)

      // range's frame is offset of draw time in clip and frames is duration
      const filtersInput = this.filters.map((filter, index) => {
        const evaluator: Evaluator = this.evaluator(modular, crazyRange, size)
        const graphFilter = filter.inputFilter(evaluator, args)
        if (!graphFilter.inputs?.length) {
          if (args.prevFilter?.outputs?.length) graphFilter.inputs = args.prevFilter.outputs
          else if (layer.layerInputs.length) graphFilter.inputs = ['0:v']
        }
        // if (!graphFilter.outputs?.length) graphFilter.outputs = [`F${index}`]

        args.prevFilter = graphFilter
        return graphFilter
      })
      return filtersInput
    }

    get propertiesCustom() : Property[] {
      return this.properties.filter(property => property.custom)
    }

    retain = true

    toJSON() : UnknownObject {
      const object = super.toJSON()
      if (this.filters.length) object.filters = this.filters
      const entries = this.propertiesCustom.map(property => [property.name, property])
      if (entries.length) object.properties = Object.fromEntries(entries)

      return object
    }
  }
}

export { ModularDefinitionMixin }
