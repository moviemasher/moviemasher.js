import { Context } from "../Utilities"
import { CoreFilter } from "./CoreFilter"

class FadeFilter extends CoreFilter{
  draw(evaluator) {
    const context = evaluator.context
    const drawing = Context.createDrawingLike(context)
    drawing.globalAlpha = evaluator.get("mm_t")
    drawing.drawImage(context.canvas, 0, 0)
    drawing.globalAlpha = 1
    return drawing
  }
}
const FadeFilterInstance = new FadeFilter
export { FadeFilterInstance as FadeFilter }