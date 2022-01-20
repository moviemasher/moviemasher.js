import { GraphFilter, ValueObject } from "../../../declarations"
import { Errors } from "../../../Setup/Errors"
import { Parameter } from "../../../Setup/Parameter"
import { Evaluator } from "../../../Helpers/Evaluator"
import { isPopulatedString } from "../../../Utilities/Is"
import { pixelColor } from "../../../Utilities/Pixel"
import { FilterDefinitionClass } from "../FilterDefinition"
import { VisibleContext } from "../../../Context/VisibleContext"

class ColorFilter extends FilterDefinitionClass {
  draw(evaluator : Evaluator, evaluated : ValueObject) : VisibleContext {
    const { context } = evaluator
    if (!context) throw Errors.invalid.context

    const { color } = evaluated
    if (!isPopulatedString(color)) return context

    context.drawFill(pixelColor(color))
    return context
  }

  input(evaluator: Evaluator, evaluated: ValueObject): GraphFilter {
    const graphFilter: GraphFilter = {
      filter: this.id,
      options: Object.fromEntries(this.parameters.map(parameter => [
        parameter.name,
        evaluated[parameter.name] || String(evaluator.get(parameter.name) || '')
      ]))
    }
    return graphFilter
   }

  parameters = [
    new Parameter({ name: "color", value: "color" }),
    new Parameter({ name: "size", value: "mm_dimensions" }),
    // new Parameter({ name: "duration", value: "mm_duration" }),
    new Parameter({ name: "rate", value: "mm_fps" }),
  ]
}

export { ColorFilter }
