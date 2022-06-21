import { GraphFilter } from "../../MoveMe"
import { FilterChain } from "../../Edited/Mash/FilterChain/FilterChain"
import { DataType, Phase } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { FilterDefinitionClass } from "../FilterDefinitionClass"

/**
 * @category Filter
 */
export class FpsFilter extends FilterDefinitionClass {
  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({
      custom: true, name: 'fps', type: DataType.Number
    }))
    this.populateParametersFromProperties()
  }

  graphFilter(filterChain: FilterChain): GraphFilter {
    const graphFilter = super.graphFilter(filterChain)
    graphFilter.options.fps ||= filterChain.filterGraph.videoRate
    return graphFilter
  }

  phase = Phase.Initialize
}
