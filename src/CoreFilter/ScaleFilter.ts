import { Context } from "../Utilities"
import { CoreFilter } from "./CoreFilter"

class ScaleFilter extends CoreFilter {
  draw(evaluator, evaluated) {
    const { context } = evaluator
    let width = evaluated.w || evaluated.width
    let height = evaluated.h || evaluated.height

    if (width + height < 2) return context

    const inWidth = evaluator.get("mm_input_width")
    const inHeight = evaluator.get("mm_input_height")
    if (width === -1) width = inWidth * (height / inHeight)
    else if (height === -1) height = inHeight * (width / inWidth)

    const drawing = Context.createDrawing(width, height)
    drawing.drawImage(context.canvas, 0, 0, inWidth, inHeight, 0, 0, width, height)
    return drawing
  }

  scopeSet(evaluator) {
    const { context } = evaluator
    const { canvas } = context

    const { width, height } = canvas
    evaluator.set("in_h", height)
    evaluator.set("mm_input_height", height)
    evaluator.set("in_w", width)
    evaluator.set("mm_input_width", width)
  }
}
const ScaleFilterInstance = new ScaleFilter()
export { ScaleFilterInstance as ScaleFilter }
