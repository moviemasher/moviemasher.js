import { Errors } from "../Errors"
import { Is } from "../Is"
import { CoreFilter } from "./CoreFilter"

class OverlayFilter extends CoreFilter {
  draw(evaluator, evaluated, outputContext) {
    if (Is.undefined(outputContext)) return

    const { context } = evaluator    
    const { canvas } = context
    const { x, y } = evaluated
    outputContext.drawImage(canvas, x, y)
    return outputContext
  }
  scopeSet(evaluator) {
    const { context } = evaluator
    if (Is.undefined(context)) throw Errors.internal + evaluator.constructor.name
    const { width, height } = context.canvas
    evaluator.set("overlay_w", width)
    evaluator.set("overlay_h", height)
    
  }
}
const OverlayFilterInstance = new OverlayFilter
export { OverlayFilterInstance as OverlayFilter }