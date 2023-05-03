import { ValueRecord } from '../../../Types/Core.js'
import { CommandFilter, FilterDefinitionCommandFilterArgs, CommandFilters } from '../../../Base/Code.js'
import { FilterDefinitionClass } from '../FilterDefinitionClass.js'
import { DataTypePercent, DataTypeString } from '../../../Setup/Enums.js'
import { propertyInstance } from '../../../Setup/Property.js'
import { assertPopulatedString, isPopulatedString } from '../../../Utility/Is.js'
import { PropertyTweenSuffix } from '../../../Base/Propertied.js'
import { tweenOption, tweenPosition } from '../../../Mixin/Tweenable/Tween.js'
import { FilterDefinitionObject } from '../Filter.js'

/**
 * @category Filter
 */
export class OverlayFilter extends FilterDefinitionClass {
  constructor(object: FilterDefinitionObject) {
    super(object)
    this.properties.push(propertyInstance({
      tweenable: true, custom: true, name: 'x', type: DataTypePercent, defaultValue: 0.5 
    }))
    this.properties.push(propertyInstance({
      tweenable: true, custom: true, name: 'y', type: DataTypePercent, defaultValue: 0.5
    }))
    this.properties.push(propertyInstance({
      custom: true, name: 'format', type: DataTypeString, defaultValue: 'yuv420' // yuv420p10
    }))
    this.properties.push(propertyInstance({
      custom: true, name: 'alpha', type: DataTypeString, defaultValue: 'straight' // premultiplied
    }))
    this.populateParametersFromProperties()
  }

  commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters {
    const commandFilters: CommandFilters = []
    const { filter, filterInput, chainInput, duration, videoRate } = args
    assertPopulatedString(filterInput, 'filterInput')
    assertPopulatedString(chainInput, 'chainInput')

    const scalars = filter.scalarObject(!!duration)
    const options: ValueRecord = {} //repeatlast: 0, shortest: 1
    const { format, alpha } = scalars
    if (isPopulatedString(format)) options.format = format
    if (isPopulatedString(alpha)) options.alpha = alpha
  
    const position = tweenPosition(videoRate, duration, '(n-1)') // overlay bug

    const x = tweenOption(scalars.x, scalars[`x${PropertyTweenSuffix}`], position, true)
    const y = tweenOption(scalars.y, scalars[`y${PropertyTweenSuffix}`], position, true)
    const xZero = x === 0
    const yZero = y === 0 
    // const zero = xZero && yZero
    if (!xZero) options.x = x
    if (!yZero) options.y = y
    
    // const { ffmpegFilter } = this
    const ffmpegFilter = 'overlay'
    const commandFilter: CommandFilter = {
      inputs: [chainInput, filterInput], ffmpegFilter, options, outputs: []
    }
    commandFilters.push(commandFilter)
    return commandFilters
  }
}
