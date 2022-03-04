import {
  Any, UnknownObject, Value, Size, FilterChain, FilterChainArgs, GraphFilters, ModularGraphFilter
} from "../../declarations"
import { Modular, ModularDefinitionClass, ModularDefinitionObject } from "./Modular"
import { Property } from "../../Setup/Property"
import { TimeRange } from "../../Helpers/TimeRange"
import { VisibleContext } from "../../Context"
import { DefinitionClass } from "../../Base/Definition"
import { Filter } from "../../Media/Filter/Filter"
import { Evaluator, EvaluatorArgs } from "../../Helpers/Evaluator"
import { filterInstance } from "../../Media/Filter"
import { Preloader } from "../../Preloader/Preloader"
import { AVType, GraphType } from "../../Setup/Enums"

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

    drawFilters(preloader: Preloader, modular: Modular, range : TimeRange, context : VisibleContext, outputSize : Size, outContext?: VisibleContext) : VisibleContext {
     // range's frame is offset of draw time in clip = frames is duration of clip
      let contextFiltered = context
      this.filters.forEach(filter => {
        const evaluatorArgs: EvaluatorArgs = {
          avType: AVType.Video,
          graphType: GraphType.Canvas,
          preloader, filter, modular,
          timeRange: range, outputSize,
          context: contextFiltered, mergeContext: outContext,
        }
        const evaluator = new Evaluator(evaluatorArgs)
        this.modulateEvaluator(modular, evaluator)
        contextFiltered = filter.drawFilter(evaluator)

        evaluator.logDebug()

      })
      return contextFiltered
    }


    filters : Filter[] = []

    filtrateFilterChain(filterChain: FilterChain, modular: Modular, filterChainArgs: FilterChainArgs): void {
      // this.fileFilterChain(layer, modular)
      const graphFilters = this.graphFilters(filterChain, modular, filterChainArgs)
      filterChain.graphFilters.push(...graphFilters)
    }

    graphFilters(filterChain: FilterChain, modular: Modular, args: FilterChainArgs): GraphFilters {
      const { size: outputSize, clip, quantize, timeRange, preloader, graphType, avType } = args
      const clipTimeRange = clip.timeRange(quantize)

      const range = clipTimeRange.scale(timeRange.fps)
      const frame = Math.max(0, timeRange.frame - range.frame)
      const crazyRange = range.withFrame(frame)

      // range's frame is offset of draw time in clip and frames is duration
      const filtersInput = this.filters.map(filter => {
        const evaluatorArgs: EvaluatorArgs = {
          modular, filter, avType,
          timeRange: crazyRange, outputSize, graphType, preloader
        }
        const evaluator = new Evaluator(evaluatorArgs)
        this.modulateEvaluator(modular, evaluator)

        const modularGraphFilter: ModularGraphFilter = filter.inputFilter(evaluator)
        evaluator.logDebug()
        const { inputs, graphFiles } = modularGraphFilter
        if (graphFiles?.length) {
          filterChain.graphFiles.push(...graphFiles)
        }
        if (inputs) {
          const { prevFilter } = args
          if (!inputs.length) {
            if (prevFilter?.outputs?.length) {
              // console.log(this.constructor.name, 'graphFilters populating inputs with previous filter outputs', modularGraphFilter.filter, prevFilter.filter)

              inputs.push(...prevFilter.outputs)
            }
            else {
              const inputCount = filterChain.graphFiles.filter(file => file.input).length
              if (inputCount) modularGraphFilter.inputs = [`${inputCount - 1}:v`]
            }
          }
        }

        args.prevFilter = modularGraphFilter
        return modularGraphFilter
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
