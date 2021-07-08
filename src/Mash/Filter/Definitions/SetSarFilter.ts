import { VisibleContext } from "../../../Playing/VisibleContext"
import { ValueObject } from "../../../Setup/declarations"
import { Evaluator } from "../../../Utilities/Evaluator"
import { FilterDefinitionClass } from "../FilterDefinition"

class SetSarFilter extends FilterDefinitionClass {
  draw(evaluator : Evaluator, _evaluated : ValueObject) : VisibleContext {
    return evaluator.context
  }

  // id = 'setsar'
}

export { SetSarFilter }
