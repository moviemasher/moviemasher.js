import { CommandFilter, CommandFilters, FilterDefinitionCommandFilterArgs } from '../../../Base/Code.js'
import { FilterDefinitionClass } from '../FilterDefinitionClass.js'
import { assertPopulatedString } from '../../../Utility/Is.js'
import { idGenerate } from '../../../Utility/Id.js'

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
