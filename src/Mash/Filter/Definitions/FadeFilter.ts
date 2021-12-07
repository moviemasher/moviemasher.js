
import { ContextFactory } from "../../../Playing/ContextFactory"
import { VisibleContext } from "../../../Playing/VisibleContext"
import { Errors } from "../../../Setup/Errors"
import { Evaluator } from "../../../Utilities/Evaluator"
import { FilterDefinitionClass } from "../FilterDefinition"

class FadeFilter extends FilterDefinitionClass {
  draw(evaluator : Evaluator) : VisibleContext {
    const { context } = evaluator
    if (!context) throw Errors.invalid.context

    const drawing = ContextFactory.toSize(context.size)
    const alpha = Number(evaluator.get('alpha') || evaluator.position)
    const type = String(evaluator.get('type') || 'in')
    const typedAlpha = type === 'in' ? alpha : 1.0 - alpha
    drawing.drawWithAlpha(context.drawingSource, typedAlpha)
    return drawing
  }
}

export { FadeFilter }
