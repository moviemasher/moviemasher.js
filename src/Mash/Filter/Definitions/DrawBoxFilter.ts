import { VisibleContext } from "../../../Playing"
import { Errors } from "../../../Setup/Errors"
import { Evaluator } from "../../../Utilities/Evaluator"
import { isPopulatedString } from "../../../Utilities/Is"
import { pixelColor } from "../../../Utilities/Pixel"
import { FilterDefinitionClass } from "../FilterDefinition"

interface EvaluatedBox {
  x? : number
  y? : number
  color? : string
  width? : number
  height? : number
}

class DrawBoxFilter extends FilterDefinitionClass {
  draw(evaluator : Evaluator, evaluated : EvaluatedBox) : VisibleContext {
    const { context } = evaluator
    if (!context) throw Errors.invalid.context

    const color = isPopulatedString(evaluated.color) ? <string> evaluated.color : 'black'
    const x = evaluated.x || 0
    const y = evaluated.y || 0
    const width = evaluated.width || context.size.width
    const height = evaluated.height || context.size.height

    context.drawFillInRect(pixelColor(color), { x, y, width, height })
    return context
  }
}

export { DrawBoxFilter }
