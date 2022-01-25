
import { ContextFactory } from "../../../Context/ContextFactory"
import { VisibleContext } from "../../../Context/VisibleContext"
import { Errors } from "../../../Setup/Errors"
import { Evaluator } from "../../../Helpers/Evaluator"
import { FilterDefinitionClass } from "../FilterDefinition"

/**
 * @category Filter
 */
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
