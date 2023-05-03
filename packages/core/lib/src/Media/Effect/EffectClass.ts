import type {CommandFiles, CommandFilterArgs, CommandFilters, FilterCommandFileArgs, FilterCommandFilterArgs, VisibleCommandFileArgs} from '../../Base/Code.js'
import type {EffectMedia} from './Effect.js'
import type {Filter} from '../../Plugin/Filter/Filter.js'
import type {Rect} from '../../Utility/Rect.js'
import type {Scalar} from '../../Types/Core.js'
import type {Selectables} from '../../Plugin/Masher/Selectable.js'
import type {SelectedItems} from '../../Helpers/Select/SelectedProperty.js'
import type {Size} from '../../Utility/Size.js'
import type {SvgFilters} from '../../Helpers/Svg/Svg.js'
import type {Time, TimeRange} from '../../Helpers/Time/Time.js'

import {Actions} from '../../Plugin/Masher/Actions/Actions.js'
import {arrayLast} from '../../Utility/Array.js'
import {assertPopulatedString, isTimeRange} from '../../Utility/Is.js'
import {assertProperty} from '../../Setup/Property.js'
import {ContainerMixin} from '../Container/ContainerMixin.js'
import {MediaInstanceBase} from '../MediaInstanceBase.js'
import {PropertyTweenSuffix} from '../../Base/Propertied.js'
import {TweenableMixin} from '../../Mixin/Tweenable/TweenableMixin.js'
import {TypeEffect, TypeNone, SelectorType, ActionTypeChange} from '../../Setup/Enums.js'
import { ChangePropertyActionObject } from "../../Plugin/Masher/Actions/Action/Action.js"


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
  
  
  declare definition: EffectMedia
  
  selectables(): Selectables { return [this] }

  selectType: SelectorType = TypeEffect

  selectedItems(actions: Actions): SelectedItems {
    return this.properties.map(property => { 
      const undoValue = this.value(property.name)
      return {
        value: undoValue,
        selectType: TypeNone, property, 
        changeHandler: (property: string, redoValue: Scalar) => {
          assertPopulatedString(property)
      
          const options: ChangePropertyActionObject = { 
            type: ActionTypeChange,
            target: this, property, redoValue, undoValue,
            undoSelection: {...actions.selection}, redoSelection: {...actions.selection }
          }

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
