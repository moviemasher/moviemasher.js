import { Is, Pixel } from "../Utilities"
import { CoreFilter } from "./CoreFilter"

class DrawBoxFilter extends CoreFilter {
  draw(evaluator, evaluated) {
    const { context } = evaluator
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

const DrawBoxFilterInstance = new DrawBoxFilter()

export { DrawBoxFilterInstance as DrawBoxFilter }
