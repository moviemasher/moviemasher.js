import {
  Any, GraphFilter, UnknownObject, Value, Size, FilterChain, FilterChainArgs, GraphFile
} from "../../declarations"
import { Modular, ModularDefinitionClass, ModularDefinitionObject } from "./Modular"
import { Property } from "../../Setup/Property"
import { TimeRange } from "../../Helpers/TimeRange"
import { VisibleContext } from "../../Context"
import { DefinitionClass } from "../../Base/Definition"
import { Filter } from "../../Media/Filter/Filter"
import { Evaluator, EvaluatorArgs } from "../../Helpers/Evaluator"
import { filterInstance } from "../../Media/Filter"
import { Definitions } from "../../Definitions/Definitions"
import { DefinitionType, GraphFileType, LoadType } from "../../Setup/Enums"
import { FontDefinition } from "../../Media/Font/Font"
import { Preloader } from "../../Preloader/Preloader"

function ModularDefinitionMixin<T extends DefinitionClass>(Base: T) : ModularDefinitionClass & T {
  return class extends Base {
    constructor(...args : Any[]) {
      super(...args)
      const [object] = args
      const { properties, filters } = <ModularDefinitionObject> object
      if (properties?.length) this.properties.push(...properties.map(property =>
        new Property({ ...property, custom: true })
      ))
      if (filters) this.filters.push(...filters.map(filter => filterInstance(filter)))
    }

    drawFilters(preloader: Preloader, modular: Modular, range : TimeRange, clipRange: TimeRange, context : VisibleContext, outputSize : Size, outContext?: VisibleContext) : VisibleContext {
     // range's frame is offset of draw time in clip = frames is duration of clip
      let contextFiltered = context
      this.filters.forEach(filter => {
        const evaluatorArgs: EvaluatorArgs = {
          preloader,
          timeRange: range, outputSize, context: contextFiltered, mergeContext: outContext,
        }
        const evaluator = new Evaluator(evaluatorArgs)
        this.modulateEvaluator(modular, evaluator)
        contextFiltered = filter.drawFilter(evaluator)
      })
      return contextFiltered
    }

    fileFilterChain(layer: FilterChain, modular: Modular) {
      const modularProperties = this.propertiesModular
      const ids = modularProperties.map(property => String(modular.value(property.name)))
      ids.forEach(id => {
        const definition = Definitions.fromId(id)
        const { type } = definition
        switch (type) {
          case DefinitionType.Font: {
            const fontDefinition = definition as FontDefinition
            const graphFile: GraphFile = {
              type: LoadType.Font, file: fontDefinition.source
            }
            layer.files.push(graphFile)
            break
          }
        }
      })
    }
    filters : Filter[] = []

    filtrateFilterChain(layer: FilterChain, modular: Modular, args: FilterChainArgs): void {
      this.fileFilterChain(layer, modular)
      const graphFilters = this.graphFilters(layer, modular, args)
      layer.filters.push(...graphFilters)
    }

    graphFilters(filterChain: FilterChain, modular: Modular, args: FilterChainArgs): GraphFilter[] {
      const { size: outputSize, clipTimeRange, timeRange } = args

      const range = clipTimeRange.scale(timeRange.fps)
      const frame = Math.max(0, timeRange.frame - range.frame)
      const crazyRange = range.withFrame(frame)

      // range's frame is offset of draw time in clip and frames is duration
      const filtersInput = this.filters.map((filter, index) => {

        const evaluatorArgs: EvaluatorArgs = {
          timeRange: crazyRange, outputSize, graphType: args.graphType
        }
        const evaluator = new Evaluator(evaluatorArgs)
        this.modulateEvaluator(modular, evaluator)

        const graphFilter = filter.inputFilter(evaluator, args)
        if (!graphFilter.inputs?.length) {
          if (args.prevFilter?.outputs?.length) graphFilter.inputs = args.prevFilter.outputs
          else if (filterChain.inputs.length) graphFilter.inputs = ['0:v']
        }

        args.prevFilter = graphFilter
        return graphFilter
      })
      return filtersInput
    }

    private modulateEvaluator(modular: Modular, evaluator: Evaluator): void {
      this.propertiesCustom.forEach(property => {
        const { type, name } = property
        const value = modular.value(property.name) as Value
        evaluator.set(name, value, type.id)
      })
    }

    get propertiesCustom() : Property[] {
      return this.properties.filter(property => property.custom)
    }

    retain = true

    toJSON() : UnknownObject {
      const object = super.toJSON()
      const custom = this.propertiesCustom
      if (custom.length) object.properties = custom
      if (this.filters.length) object.filters = this.filters
      return object
    }
  }
}

export { ModularDefinitionMixin }
