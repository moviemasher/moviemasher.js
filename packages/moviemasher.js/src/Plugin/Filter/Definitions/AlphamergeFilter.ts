import { CommandFilter, CommandFilters, FilterDefinitionCommandFilterArgs } from "../../../Base/Code"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { assertPopulatedString } from "../../../Utility/Is"
import { idGenerate } from "../../../Utility/Id"

/**
 * @category Filter
 */
export class AlphamergeFilter extends FilterDefinitionClass {
  commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters {
    const commandFilters: CommandFilters = []
    const { chainInput, filterInput } = args
    assertPopulatedString(chainInput, 'chainInput')
    assertPopulatedString(filterInput, 'filterInput')
    const { ffmpegFilter } = this
    const commandFilter: CommandFilter = {
      inputs: [chainInput, filterInput], ffmpegFilter, 
      options: {}, outputs: [idGenerate(ffmpegFilter)]
    }
    commandFilters.push(commandFilter)
    return commandFilters
  }
}
