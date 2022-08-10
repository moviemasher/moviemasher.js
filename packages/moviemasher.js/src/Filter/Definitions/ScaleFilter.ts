import { CommandFilter, CommandFilters, FilterDefinitionCommandFilterArgs } from "../../MoveMe"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { DataType, Phase } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { assertPopulatedString, isNumber } from "../../Utility/Is"
import { idGenerate } from "../../Utility/Id"
import { PropertyTweenSuffix } from "../../Base/Propertied"
import { ValueObject } from "../../declarations"
import { tweenOption, tweenPosition } from "../../Utility/Tween"

/**
 * @category Filter
 */
export class ScaleFilter extends FilterDefinitionClass {

  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({
      name: 'width', type: DataType.Percent, defaultValue: 1.0, max: 2.0
    }))
    this.properties.push(propertyInstance({
      name: 'height', type: DataType.Percent, defaultValue: 1.0, max: 2.0
    }))
    this.properties.push(propertyInstance({
      name: `width${PropertyTweenSuffix}`, type: DataType.Percent, 
      defaultValue: 1.0, max: 2.0
    }))
    this.properties.push(propertyInstance({
      name: `height${PropertyTweenSuffix}`, type: DataType.Percent, 
      defaultValue: 1.0, max: 2.0
    }))
    this.populateParametersFromProperties()
  }

  commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters {
    const commandFilters: CommandFilters = []
    const { filter, duration, filterInput, videoRate } = args
    const values = filter.scalarObject(!!duration)
    const { 
      width, height, 
      [`width${PropertyTweenSuffix}`]: widthEnd,
      [`height${PropertyTweenSuffix}`]: heightEnd,
    } = values
    assertPopulatedString(filterInput)
    
    const { ffmpegFilter } = this
  
    const position = tweenPosition(videoRate, duration)
    const options: ValueObject = {
      width: tweenOption(width, widthEnd, position, true),
      height: tweenOption(height, heightEnd, position, true),
      // sws_flags: 'accurate_rnd',
    }
    if (!(isNumber(options.width) && isNumber(options.height))) options.eval = 'frame'

    const commandFilter: CommandFilter = {
      inputs: [filterInput], ffmpegFilter, options, 
      outputs: [idGenerate(ffmpegFilter)]
    }
    commandFilters.push(commandFilter)
    return commandFilters
  }

  phase = Phase.Populate
}
