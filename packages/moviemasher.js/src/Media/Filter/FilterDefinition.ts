import { Any, GraphFilter, FilterChainArgs, ValueObject } from "../../declarations"
import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Parameter } from "../../Setup/Parameter"
import { Definitions } from "../../Definitions/Definitions"
import { Evaluator } from "../../Helpers/Evaluator"
import { DefinitionBase } from "../../Base/Definition"
import { VisibleContext } from "../../Context/VisibleContext"
import { Filter, FilterDefinition, FilterObject } from "./Filter"
import { FilterClass } from "./FilterClass"


class FilterDefinitionClass extends DefinitionBase implements FilterDefinition {
  constructor(...args : Any[]) {
    super(...args)
    Definitions.install(this)
  }

  draw(_evaluator : Evaluator, _evaluated : ValueObject) : VisibleContext {
    throw Errors.unimplemented + this.id
  }

  _ffmpegFilter?: string
  get ffmpegFilter(): string {
    if (this._ffmpegFilter) return this._ffmpegFilter

    const prefix = 'com.moviemasher.filter.'
    const filter = this.id.startsWith(prefix) ? this.id.slice(prefix.length) : this.id
    return this._ffmpegFilter = filter
  }

  input(_evaluator: Evaluator, _evaluated: ValueObject, _args: FilterChainArgs): GraphFilter {
    throw Errors.unimplemented + this.id
  }

  get instance() : Filter {
    return this.instanceFromObject(this.instanceObject)
  }

  instanceFromObject(object : FilterObject) : Filter {
    const instance = new FilterClass({ ...this.instanceObject, ...object })
    return instance
  }

  parameters : Parameter[] = []

  retain = true

  scopeSet(_evaluator : Evaluator) : void {}

  type = DefinitionType.Filter
}

export { FilterDefinitionClass }
