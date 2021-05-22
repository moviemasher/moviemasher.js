import { Evaluator } from "../Clip"

class CoreFilter {
  draw(evaluator : Evaluator, evaluated) { return evaluator.context }

  scopeSet() {}
}

export { CoreFilter }
