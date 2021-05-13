import { Context } from "../Utilities";
import { CoreFilter } from "./CoreFilter";

class ScaleFilter extends CoreFilter {
  draw(evaluator, evaluated) {
    const context = evaluator.context
    let width = evaluated.w || evaluated.width
    let height = evaluated.h || evaluated.height

    if (2 > width + height) return context
    
    const in_width = evaluator.get("mm_input_width")
    const in_height = evaluator.get("mm_input_height")
    if (-1 === width) width = in_width * (height / in_height)
    else if (-1 === height) height = in_height * (width / in_width)

    const drawing = Context.createDrawing(width, height)
    
    drawing.drawImage(context.canvas, 0, 0, in_width, in_height, 0, 0, width, height)
  
    return drawing
  }

  scopeSet(evaluator) {
    const { context } = evaluator
    if (!context) throw 'context'
    const { canvas } = context

    if (!canvas) throw 'canvas'

    const { width, height } = canvas
    evaluator.set("in_h", height)
    evaluator.set("mm_input_height", height)
    evaluator.set("in_w", width)
    evaluator.set("mm_input_width", width)
  }
}
const ScaleFilterInstance = new ScaleFilter
export { ScaleFilterInstance as ScaleFilter }
