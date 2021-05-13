import { CoreFilter } from "./CoreFilter"
import { Is } from '../Is'
import { Pixel } from "../Utilities"

class DrawBoxFilter extends CoreFilter {
  draw(evaluator, evaluated) {
    var context = evaluator.context
    const color = (Is.undefined(evaluated.color) ? 'black' : evaluated.color)
    const x = evaluated.x || 0
    const y = evaluated.y || 0
    const width = evaluated.width || context.canvas.width
    const height = evaluated.height || context.canvas.height

    context.fillStyle = Pixel.color(color)
    context.fillRect(x, y, width, height)
    return context
  }
}

const DrawBoxFilterInstance = new DrawBoxFilter

export { DrawBoxFilterInstance as DrawBoxFilter }