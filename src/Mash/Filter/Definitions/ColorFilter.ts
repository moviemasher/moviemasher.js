import { VisibleContext } from "../../../Playing"
import { Parameter } from "../../../Setup/Parameter"
import { Evaluator, isPopulatedString, Pixel } from "../../../Utilities"
import { FilterDefinitionClass } from "../FilterDefinition"

class ColorFilter extends FilterDefinitionClass {
  draw(evaluator : Evaluator, evaluated : { color : string }) : VisibleContext {
    const { context } = evaluator
    const { color } = evaluated
    if (!isPopulatedString(color)) return context

    context.drawFill(Pixel.color(color))
    return context
  }

  // id = 'color'

  parameters = [
    new Parameter({ name: "color", value: "color" }),
    new Parameter({ name: "size", value: "mm_dimensions" }),
    new Parameter({ name: "duration", value: "mm_duration" }),
    new Parameter({ name: "rate", value: "mm_fps" }),
  ]
}

export { ColorFilter }
