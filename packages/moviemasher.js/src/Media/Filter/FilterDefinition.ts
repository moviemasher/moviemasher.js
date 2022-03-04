import { ModularGraphFilter, FilterChainArgs, ValueObject } from "../../declarations"
import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Parameter } from "../../Setup/Parameter"
import { Evaluator } from "../../Helpers/Evaluator"
import { DefinitionBase } from "../../Base/Definition"
import { VisibleContext } from "../../Context/VisibleContext"
import { Filter, FilterDefinition, FilterObject } from "./Filter"
import { FilterClass } from "./FilterClass"


class FilterDefinitionClass extends DefinitionBase implements FilterDefinition {
  draw(_evaluator : Evaluator) : VisibleContext {
    throw Errors.unimplemented + 'draw' + this.id
  }

  _ffmpegFilter?: string
  get ffmpegFilter(): string {
    if (this._ffmpegFilter) return this._ffmpegFilter

    const prefix = 'com.moviemasher.filter.'
    const filter = this.id.startsWith(prefix) ? this.id.slice(prefix.length) : this.id
    return this._ffmpegFilter = filter
  }

  modularGraphFilter(evaluator: Evaluator): ModularGraphFilter {
    const graphFilter: ModularGraphFilter = {
      inputs: [],
      outputs: [this.ffmpegFilter.toUpperCase()],
      filter: this.ffmpegFilter,
      options: evaluator.valueObject
    }
    return graphFilter
  }

  get instance(): Filter { return this.instanceFromObject({}) }

  instanceFromObject(object: FilterObject): Filter {
    const { instanceObject } = this
    const instance = new FilterClass({ ...instanceObject, ...object })
    return instance
  }

  parameters : Parameter[] = []

  retain = true

  scopeSet(_evaluator : Evaluator) : void {}

  type = DefinitionType.Filter
}

export { FilterDefinitionClass }
