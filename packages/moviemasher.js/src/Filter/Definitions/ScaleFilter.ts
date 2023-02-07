import { CommandFilter, CommandFilters, FilterDefinitionCommandFilterArgs } from "../../MoveMe"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { DataType } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { assertPopulatedString, isNumber } from "../../Utility/Is"
import { idGenerate } from "../../Utility/Id"
import { PropertyTweenSuffix } from "../../Base/Propertied"
import { ValueObject } from "../../declarations"
import { tweenOption, tweenPosition } from "../../Utility/Tween"
import { FilterDefinitionObject } from "../Filter"

/**
 * @category Filter
 */
export class ScaleFilter extends FilterDefinitionClass {
  constructor(object: FilterDefinitionObject) {
    super(object)
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
    
    // console.log(this.constructor.name, "commandFilters", filterInput, width, "x", height) //, widthEnd, "x", heightEnd)

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
}
