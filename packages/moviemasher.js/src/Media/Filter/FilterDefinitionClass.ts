import { ModularGraphFilter } from "../../declarations"
import { DefinitionType, GraphType } from "../../Setup/Enums"
import { Parameter } from "../../Setup/Parameter"
import { Evaluator } from "../../Helpers/Evaluator"
import { DefinitionBase } from "../../Base/Definition"
import { VisibleContext } from "../../Context/VisibleContext"
import { Filter, FilterDefinition, FilterObject } from "./Filter"
import { FilterClass } from "./FilterClass"

export class FilterDefinitionClass extends DefinitionBase implements FilterDefinition {
  protected drawFilterDefinition(evaluator : Evaluator) : VisibleContext { return evaluator.visibleContext! }

  _ffmpegFilter?: string
  get ffmpegFilter(): string {
    return this._ffmpegFilter ||= this.id.split('.').pop() || this.id
  }

  get instance(): Filter { return this.instanceFromObject({}) }

  instanceFromObject(object: FilterObject): Filter {
    const { instanceObject } = this
    const instance = new FilterClass({ ...instanceObject, ...object })
    return instance
  }

  modularGraphFilter(evaluator: Evaluator): ModularGraphFilter {
    const { graphType, preloading } = evaluator

    const graphFilter: ModularGraphFilter = { inputs: [], filter: this.ffmpegFilter, options: {} }
    if (!preloading) {
      if (graphType === GraphType.Canvas) {
        evaluator.visibleContext = this.drawFilterDefinition(evaluator)
      } else graphFilter.options = evaluator.parameters
    }
    return graphFilter
  }

  parameters : Parameter[] = []

  retain = true

  type = DefinitionType.Filter
}
