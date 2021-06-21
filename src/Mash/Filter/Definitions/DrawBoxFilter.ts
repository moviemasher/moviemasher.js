import { VisibleContext } from "../../../Playing"
import { Evaluator, isPopulatedString, Pixel } from "../../../Utilities"
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
    const color = isPopulatedString(evaluated.color) ? <string> evaluated.color : 'black'
    const x = evaluated.x || 0
    const y = evaluated.y || 0
    const width = evaluated.width || context.size.width
    const height = evaluated.height || context.size.height

    context.drawFillInRect(Pixel.color(color), { x, y, width, height })
    return context
  }

  id = 'drawbox'

}

export { DrawBoxFilter }
