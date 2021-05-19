import { Is } from "../Utilities"
import { Pixel } from "../Utilities"
import { CoreFilter } from "./CoreFilter"

class ColorFilter extends CoreFilter {
  draw(evaluator, evaluated) {
    const { context } = evaluator
    const { color } = evaluated
    if (! Is.string(color)) return context

    const { canvas } = context
    const { width, height } = canvas

    context.fillStyle = Pixel.color(color)
    context.fillRect(0, 0, width, height)
    return context
  }

  get parameters() { 
    return [
      { name: "color", value: "color" },
      { name: "size", value: "mm_dimensions" },
      { name: "duration", value: "mm_duration" },
      { name: "rate", value: "mm_fps" },
    ]
  }
}
const ColorFilterInstance = new ColorFilter
export { ColorFilterInstance as ColorFilter }