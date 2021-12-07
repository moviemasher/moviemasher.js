import { InputFilter, ValueObject } from "../../../declarations"
import { Errors } from "../../../Setup/Errors"
import { VisibleContext } from "../../../Playing/VisibleContext"
import { Evaluator } from "../../../Utilities/Evaluator"
import { FilterDefinitionClass } from "../FilterDefinition"

class SetSarFilter extends FilterDefinitionClass {
  draw(evaluator: Evaluator, _evaluated: ValueObject): VisibleContext {
    const { context } = evaluator
    if (!context) throw Errors.invalid.context

    return context
  }

  input(_evaluator: Evaluator, evaluated: ValueObject): InputFilter {
    return { filter: this.id, options: { sar: 1, max: 1 } }
  }
}

export { SetSarFilter }
