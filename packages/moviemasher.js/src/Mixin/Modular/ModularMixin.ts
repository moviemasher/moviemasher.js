import { SvgFilters } from "../../declarations"
import { CommandFilterArgs, CommandFilters, FilterCommandFilterArgs } from "../../MoveMe"
import { assertProperty } from "../../Setup/Property"
import { Size } from "../../Utility/Size"
import { Rect } from "../../Utility/Rect"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { ModularClass, ModularDefinition } from "./Modular"
import { InstanceClass } from "../../Instance/Instance"
import { Filter } from "../../Filter/Filter"
import { PropertyTweenSuffix } from "../../Base/Propertied"
import { assertPopulatedString, isTimeRange } from "../../Utility/Is"
import { arrayLast } from "../../Utility/Array"



export function ModularMixin<T extends InstanceClass>(Base: T) : ModularClass & T {
  return class extends Base {
    commandFilters(args: CommandFilterArgs): CommandFilters {
      const commandFilters: CommandFilters = []
      const { videoRate, filterInput, time } = args
      assertPopulatedString(filterInput)

      const duration = isTimeRange(time) ? time.lengthSeconds : 0
      const { filters } = this.definition
      const filterArgs: FilterCommandFilterArgs = { 
        videoRate, duration, filterInput 
      }
      commandFilters.push(...filters.flatMap(filter => {
        this.setFilterValues(filter)
        const filters = filter.commandFilters(filterArgs)
        if (filters.length) {
          filterArgs.filterInput = arrayLast(arrayLast(filters).outputs)
        }
        return filters
      }))
      return commandFilters
    }
    
    declare definition : ModularDefinition

    private setFilterValues(filter: Filter) {
      const filterNames = filter.properties.map(property => property.name)
      const propertyNames = this.properties.map(property => property.name)
      const shared = propertyNames.filter(name => filterNames.includes(name))
      shared.forEach(name => {
        const property = this.properties.find(property => property.name === name)
        assertProperty(property)

        const { tweenable } = property
        filter.setValue(this.value(name), name)
        if (tweenable) {
          const tweenName = `${name}${PropertyTweenSuffix}`
          filter.setValue(this.value(tweenName), tweenName)
        }
      })
    }

    svgFilters(previewSize: Size, containerRect: Rect, time: Time, range: TimeRange): SvgFilters {
      const svgFilters: SvgFilters = []
      const { filters } = this.definition
      svgFilters.push(...filters.flatMap(filter => {
        this.setFilterValues(filter)
        return filter.filterSvgFilter()
      }))
      // console.log(this.constructor.name, "svgFilters", svgFilters.length)
      return svgFilters
    }
  }
}
