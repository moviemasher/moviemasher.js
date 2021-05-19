import { Is } from "../Utilities"
import { Context } from "../Utilities"
import { CoreFilter } from "./CoreFilter"

class CropFilter extends CoreFilter {
  draw(evaluator, evaluated) {
    const context = evaluator.context
    const x = evaluated.x || 0
    const y = evaluated.y || 0
    const in_width = evaluator.get("mm_input_width")
    const in_height = evaluator.get("mm_input_height")
    let width = evaluated.w || evaluated.out_w
    let height = evaluated.h || evaluated.out_h
    if (2 > width + height) throw 'crop.draw invalid output dimensions'
    if (!(in_width && in_height)) throw 'crop.draw invalid input dimensions'
    
    if (-1 === width) width = in_width * (height / in_height)
    if (-1 === height) height = in_height * (width / in_width)

    const drawing = Context.createDrawing(width, height)
    drawing.drawImage(context.canvas, x, y, width, height, 0, 0, width, height)
    return [drawing]
  }
  scopeSet(evaluator) {
    const { width, height } = evaluator.context.canvas
    evaluator.set("in_h", height)
    evaluator.set("mm_input_height", height)
    evaluator.set("in_w", width)
    evaluator.set("mm_input_width", width)
    if (Is.not(evaluator.get("x"))) evaluator.set("x", '((in_w - out_w) / 2)')
    if (Is.not(evaluator.get("y"))) evaluator.set("y", '((in_h - out_h) / 2)')
  }
}

const CropFilterInstance = new CropFilter
export { CropFilterInstance as CropFilter }
