import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { DataType, Phase } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { CommandFilter, CommandFilters, FilterDefinitionCommandFilterArgs } from "../../MoveMe"
import { idGenerate } from "../../Utility/Id"
import { assertPopulatedString, isTrueValue } from "../../Utility/Is"
import { tweenOption, tweenPosition } from "../../Utility/Tween"
import { ValueObject } from "../../declarations"
import { PropertyTweenSuffix } from "../../Base/Propertied"

/**
 * @category Filter
 */
export class CropFilter extends FilterDefinitionClass {
  constructor(...args: any[]) {
    super(...args)
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

    const options: ValueObject = {}
    const position = tweenPosition(videoRate, duration)
    options.x = tweenOption(scalars.x, scalars[`x${PropertyTweenSuffix}`], position, true)
    options.y = tweenOption(scalars.y, scalars[`y${PropertyTweenSuffix}`], position, true)

    const { width, height } = scalars
    if (isTrueValue(width)) options.w = width
    if (isTrueValue(height)) options.h = height

    // if (isString(options.x) || isString(options.y)) console.log(this.constructor.name, "commandFilters scalars", scalars, !!duration)
    // console.log(this.constructor.name, "commandFilters options", options)

   
    const { ffmpegFilter } = this
    const commandFilter: CommandFilter = {
      inputs: [filterInput], ffmpegFilter, 
      options, 
      outputs: [idGenerate(ffmpegFilter)]
    }
    commandFilters.push(commandFilter)
    return commandFilters
  }

  phase = Phase.Populate

}
