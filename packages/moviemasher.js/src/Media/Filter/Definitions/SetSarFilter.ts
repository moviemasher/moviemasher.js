import { GraphFilter, LayerArgs, ValueObject } from "../../../declarations"
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

  input(evaluator: Evaluator, evaluated: ValueObject, args: LayerArgs): GraphFilter {
    return {
      outputs: ['SAR'],
      filter: this.id,
      options: { sar: 1, max: 1 }
    }
  }
}

export { SetSarFilter }
