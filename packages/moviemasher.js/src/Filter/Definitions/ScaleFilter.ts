import { CommandFilter, CommandFilters, FilterDefinitionCommandFilterArgs } from "../../MoveMe"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { DataType, Phase } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { assertAboveZero, assertPopulatedString } from "../../Utility/Is"
import { idGenerate } from "../../Utility/Id"
import { PropertyTweenSuffix } from "../../Base/Propertied"

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
    const { filter, duration, filterInput } = args
    const values = filter.scalarObject(!!duration)
    const { width, height } = values
    assertPopulatedString(filterInput)
    assertAboveZero(width)
    assertAboveZero(height)
    const { ffmpegFilter } = this
  
    const commandFilter: CommandFilter = {
      inputs: [filterInput], ffmpegFilter, options: { width, height }, outputs: [idGenerate(ffmpegFilter)]
    }
    commandFilters.push(commandFilter)
    return commandFilters
  }

  phase = Phase.Populate
}
