
import { VisibleContext } from "../../../Playing/VisibleContext"
import { EvaluatedPoint, InputFilter, ValueObject } from "../../../declarations"
import { Errors } from "../../../Setup/Errors"
import { Evaluator } from "../../../Utilities/Evaluator"
import { FilterDefinitionClass } from "../FilterDefinition"

class OverlayFilter extends FilterDefinitionClass {
  draw(evaluator : Evaluator, evaluated : EvaluatedPoint) : VisibleContext {
    const { x, y } = evaluated
    const { context, mergeContext } = evaluator
    if (!(context && mergeContext)) throw Errors.invalid.context

    mergeContext.drawAtPoint(context.drawingSource, { x: x || 0, y: y || 0 })
    return mergeContext
  }

  input(_evaluator: Evaluator, evaluated: ValueObject): InputFilter {
    const { x, y } = evaluated
    return {
      filter: this.id,
      options: { x, y }
    }
  }

  scopeSet(evaluator: Evaluator): void {
    const { context } = evaluator
    if (!context) return

    const { width, height } = context.size
    evaluator.set("overlay_w", width)
    evaluator.set("overlay_h", height)
  }
}

export { OverlayFilter }
