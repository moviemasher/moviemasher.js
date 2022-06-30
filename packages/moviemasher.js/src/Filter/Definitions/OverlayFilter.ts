import { ValueObject } from "../../declarations"
import { CommandFilter, FilterDefinitionCommandFilterArgs, CommandFilters } from "../../MoveMe"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { DataType, Phase } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { assertPopulatedString } from "../../Utility/Is"
import { PropertyTweenSuffix } from "../../Base/Propertied"
import { tweenOption } from "../../Utility/Tween"

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
    const { filter, filterInput, chainInput, duration } = args
    assertPopulatedString(filterInput)
    assertPopulatedString(chainInput)

    const scalars = filter.scalarObject(!!duration)
    const options: ValueObject = {}
    options.x = tweenOption(scalars.x, scalars[`x${PropertyTweenSuffix}`])
    options.y = tweenOption(scalars.y, scalars[`y${PropertyTweenSuffix}`])
   
    const { ffmpegFilter } = this
    const commandFilter: CommandFilter = {
      inputs: [chainInput, filterInput], ffmpegFilter, options, outputs: []
    }
    commandFilters.push(commandFilter)
    return commandFilters
  }
  
  phase = Phase.Finalize
}
