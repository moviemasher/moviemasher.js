import { GraphFilter, ValueObject } from "../../../declarations"
import { Errors } from "../../../Setup/Errors"
import { VisibleContext } from "../../../Context/VisibleContext"
import { Evaluator } from "../../../Helpers/Evaluator"
import { FilterDefinitionClass } from "../FilterDefinition"

class SetSarFilter extends FilterDefinitionClass {
  draw(evaluator: Evaluator, _evaluated: ValueObject): VisibleContext {
    const { context } = evaluator
    if (!context) throw Errors.invalid.context

    return context
  }

  input(evaluator: Evaluator, evaluated: ValueObject): GraphFilter {
    return { filter: this.id, options: { sar: 1, max: 1 } }
  }
}

export { SetSarFilter }
