import { ValueObject } from "../../declarations"
import { CommandFilter, FilterDefinitionCommandFilterArgs, CommandFilters } from "../../MoveMe"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { DataType } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { assertPopulatedString } from "../../Utility/Is"
import { PropertyTweenSuffix } from "../../Base/Propertied"
import { tweenOption, tweenPosition } from "../../Utility/Tween"

/**
 * @category Filter
 */
export class OverlayFilter extends FilterDefinitionClass {
  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({
      tweenable: true, custom: true, name: 'x', type: DataType.Percent, defaultValue: 0.5 
    }))
    this.properties.push(propertyInstance({
      tweenable: true, custom: true, name: 'y', type: DataType.Percent, defaultValue: 0.5
    }))
    this.populateParametersFromProperties()
  }

  commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters {
    const commandFilters: CommandFilters = []
    const { filter, filterInput, chainInput, duration, videoRate } = args
    assertPopulatedString(filterInput, 'filterInput')
    assertPopulatedString(chainInput, 'chainInput')

    const scalars = filter.scalarObject(!!duration)
    const options: ValueObject = {} //repeatlast: 0, shortest: 1
    options.format = 'yuv420'
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
