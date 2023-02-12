import { EffectDefinition } from "./Effect"
import { Actions, Selectables } from "../../Editor"
import { SelectedItems } from "../../Helpers/Select/SelectedProperty"
import { SelectType } from "../../Setup/Enums"
import { Scalar } from "../../declarations"
import { SvgFilters } from "../../Helpers/Svg/Svg"
import { assertPopulatedString, isTimeRange } from "../../Utility/Is"
import { MediaInstanceBase } from "../MediaInstance/MediaInstanceBase"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"
import { ContainerMixin } from "../Container/ContainerMixin"
import { assertProperty } from "../../Setup/Property"
import { Rect } from "../../Utility/Rect"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { PropertyTweenSuffix } from "../../Base/Propertied"
import { Filter } from "../../Filter/Filter"
import { Size } from "../../Utility/Size"
import { CommandFiles, CommandFilterArgs, CommandFilters, FilterCommandFileArgs, FilterCommandFilterArgs, VisibleCommandFileArgs } from "../../Base/Code"
import { arrayLast } from "../../Utility/Array"
const EffectContainerWithTweenable = TweenableMixin(MediaInstanceBase)
const EffectContainerWithContainer = ContainerMixin(EffectContainerWithTweenable)

export class EffectClass extends EffectContainerWithContainer {
  commandFiles(args: VisibleCommandFileArgs): CommandFiles {
    const commandFiles: CommandFiles = []
    const { videoRate, time } = args
    

    const duration = isTimeRange(time) ? time.lengthSeconds : 0
    const { filters } = this.definition
    const filterArgs: FilterCommandFileArgs = { 
      ...args, videoRate, duration 
    }
    commandFiles.push(...filters.flatMap(filter => {
      this.setFilterValues(filter)
      return filter.commandFiles(filterArgs)
    }))
    return commandFiles
  }

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
  
  
  declare definition: EffectDefinition
  
  selectables(): Selectables { return [this] }

  selectType = SelectType.None

  selectedItems(actions: Actions): SelectedItems {
    return this.properties.map(property => { 
      const undoValue = this.value(property.name)
      const target = this
      return {
        value: undoValue,
        selectType: SelectType.None, property, 
        changeHandler: (property: string, redoValue: Scalar) => {
          assertPopulatedString(property)
      
          const options = { target, property, redoValue, undoValue }
          actions.create(options)
        }
      }
    })
  }


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
    const filters: SvgFilters = []
    const { filters: definitionFilters } = this.definition
    filters.push(...definitionFilters.flatMap(filter => {
      this.setFilterValues(filter)
      return filter.filterSvgFilter()
    }))
    return filters
  }
}
