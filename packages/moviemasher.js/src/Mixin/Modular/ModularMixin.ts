import { ModularClass, ModularDefinition } from "./Modular"
import { InstanceClass } from "../../Instance/Instance"
import { Size } from "../../Utility/Size"
import { Rect } from "../../Utility/Rect"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { SvgFilters } from "../../declarations"
import { FilterArgs } from "../../MoveMe"
// import { ChainLinks } from "../../Filter/Filter"


export function ModularMixin<T extends InstanceClass>(Base: T) : ModularClass & T {
  return class extends Base {
    declare definition : ModularDefinition

    svgFilters(previewSize: Size, containerRect: Rect, time: Time, range: TimeRange): SvgFilters {
      const svgFilters: SvgFilters = []
      const { filters } = this.definition
      svgFilters.push(...filters.flatMap(filter => filter.filterSvgFilters()))
      return svgFilters
    }
  }
}
