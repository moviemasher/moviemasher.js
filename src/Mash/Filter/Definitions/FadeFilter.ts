
import { ContextFactory, VisibleContext } from "../../../Playing"
import { Evaluator } from "../../../Utilities"
import { FilterDefinitionClass } from "../FilterDefinition"

class FadeFilter extends FilterDefinitionClass {
  draw(evaluator : Evaluator) : VisibleContext {
    const { context } = evaluator
    const drawing = ContextFactory.toSize(context.size)
    drawing.drawWithAlpha(context.imageSource, evaluator.position)
    return drawing
  }

  id = 'fade'
}

export { FadeFilter }
