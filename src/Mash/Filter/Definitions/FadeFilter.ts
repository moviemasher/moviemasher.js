
import { ContextFactory, VisibleContext } from "../../../Playing"
import { Evaluator } from "../../../Utilities"
import { FilterDefinitionClass } from "../FilterDefinition"

class FadeFilter extends FilterDefinitionClass {
  draw(evaluator : Evaluator) : VisibleContext {
    const { context } = evaluator
    const drawing = ContextFactory.toSize(context.size)
    const alpha = Number(evaluator.get('alpha') || evaluator.position)
    const type = String(evaluator.get('type') || 'in')
    const typedAlpha = type === 'in' ? alpha : 1.0 - alpha
    drawing.drawWithAlpha(context.drawingSource, typedAlpha)
    return drawing
  }

  // id = 'fade'
}

export { FadeFilter }
