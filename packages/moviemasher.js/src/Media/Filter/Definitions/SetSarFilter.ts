import { GraphFilter, FilterChainArgs, ValueObject } from "../../../declarations"
import { Errors } from "../../../Setup/Errors"
import { VisibleContext } from "../../../Context/VisibleContext"
import { Evaluator } from "../../../Helpers/Evaluator"
import { FilterDefinitionClass } from "../FilterDefinition"

/**
 * @category Filter
 */
class SetSarFilter extends FilterDefinitionClass {
  draw(evaluator: Evaluator, _evaluated: ValueObject): VisibleContext {
    const { context } = evaluator
    if (!context) throw Errors.invalid.context

    return context
  }

  input(evaluator: Evaluator, evaluated: ValueObject, args: FilterChainArgs): GraphFilter {
    return {
      outputs: ['SAR'],
      filter: this.ffmpegFilter,
      options: { sar: 1, max: 1 }
    }
  }
}

export { SetSarFilter }
