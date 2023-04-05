import { FilterDefinitionClass } from '../FilterDefinitionClass.js'
import { DataType } from '../../../Setup/Enums.js'
import { propertyInstance } from '../../../Setup/Property.js'
import { CommandFilter, CommandFilters, FilterDefinitionCommandFilterArgs } from '../../../Base/Code.js'
import { idGenerate } from '../../../Utility/Id.js'
import { assertPopulatedString, isTrueValue } from '../../../Utility/Is.js'
import { tweenOption, tweenPosition } from '../../../Mixin/Tweenable/Tween.js'
import { ValueRecord } from '../../../Types/Core.js'
import { PropertyTweenSuffix } from '../../../Base/Propertied.js'
import { FilterDefinitionObject } from '../Filter.js'

/**
 * @category Filter
 */
export class CropFilter extends FilterDefinitionClass {
  constructor(object: FilterDefinitionObject) {
    super(object)
    this.properties.push(propertyInstance({
      custom: true, name: 'width', type: DataType.String,
    }))
    this.properties.push(propertyInstance({
      custom: true, name: 'height', type: DataType.String,
    }))
    this.properties.push(propertyInstance({
      tweenable: true, custom: true, name: 'x', type: DataType.Number,
      defaultValue: 0, min: 0, step: 1
    }))
    this.properties.push(propertyInstance({
      tweenable: true, custom: true, name: 'y', type: DataType.Number,
      defaultValue: 0, min: 0, step: 1
    }))
    this.populateParametersFromProperties()
  }

  commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters {
    const { filter, filterInput, duration, videoRate } = args
    assertPopulatedString(filterInput)
    
    const commandFilters: CommandFilters = []
    const scalars = filter.scalarObject(!!duration)

    const options: ValueRecord = { exact: 1 }
    const position = tweenPosition(videoRate, duration)
    options.x = tweenOption(scalars.x, scalars[`x${PropertyTweenSuffix}`], position, true)
    options.y = tweenOption(scalars.y, scalars[`y${PropertyTweenSuffix}`], position, true)

    const { width, height } = scalars
    if (isTrueValue(width)) options.w = width
    if (isTrueValue(height)) options.h = height

    const { ffmpegFilter } = this
    const commandFilter: CommandFilter = {
      inputs: [filterInput], ffmpegFilter, 
      options, 
      outputs: [idGenerate(ffmpegFilter)]
    }
    commandFilters.push(commandFilter)
    return commandFilters
  }
}
