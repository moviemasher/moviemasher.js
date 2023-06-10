import { CommandFilter, CommandFilters, FilterDefinitionCommandFilterArgs } from '../../../Server/GraphFile.js'
import { FilterDefinitionClass } from '../FilterDefinitionClass.js'
import { assertPopulatedString } from '../../../Shared/SharedGuards.js'
import { idGenerate } from '../../../Utility/IdFunctions.js'

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
