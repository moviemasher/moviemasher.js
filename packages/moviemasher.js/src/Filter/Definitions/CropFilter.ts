import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { DataType, Phase } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { CommandFilter, CommandFilters, FilterDefinitionCommandFilterArgs } from "../../MoveMe"
import { idGenerate } from "../../Utility/Id"
import { assertDimensions, assertPopulatedString, assertRect } from "../../Utility/Is"
import { tweenOption } from "../../Utility/Tween"
import { ValueObject } from "../../declarations"
import { PropertyTweenSuffix } from "../../Base/Propertied"

/**
 * @category Filter
 */
export class CropFilter extends FilterDefinitionClass {
  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({
      custom: true, name: 'width', type: DataType.Number,
      defaultValue: 0, min: 0, step: 1
    }))
    this.properties.push(propertyInstance({
      custom: true, name: 'height', type: DataType.Number,
      defaultValue: 0, min: 0, step: 1
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
    assertDimensions(scalars)
    // console.log(this.constructor.name, "commandFilters scalars", scalars, !!duration)

    const options: ValueObject = {}
    const pos = `(n/${videoRate * duration})`
    options.x = tweenOption(scalars.x, scalars[`x${PropertyTweenSuffix}`], pos)
    options.y = tweenOption(scalars.y, scalars[`y${PropertyTweenSuffix}`], pos)
    options.w = scalars.width
    options.h = scalars.height

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
