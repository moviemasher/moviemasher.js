import { GraphFilter, FilterChainArgs, ValueObject } from "../../../declarations"
import { Errors } from "../../../Setup/Errors"
import { Parameter } from "../../../Setup/Parameter"
import { Evaluator } from "../../../Helpers/Evaluator"
import { isPopulatedString } from "../../../Utility/Is"
import { pixelColor } from "../../../Utility/Pixel"
import { FilterDefinitionClass } from "../FilterDefinition"
import { VisibleContext } from "../../../Context/VisibleContext"
import { DataType } from "../../../Setup/Enums"

/**
 * @category Filter
 */
class ColorFilter extends FilterDefinitionClass {
  draw(evaluator : Evaluator, evaluated : ValueObject) : VisibleContext {
    const { context } = evaluator
    if (!context) throw Errors.invalid.context

    const { color } = evaluated
    if (!isPopulatedString(color)) return context

    context.drawFill(pixelColor(color))
    return context
  }

  input(evaluator: Evaluator, evaluated: ValueObject, args: FilterChainArgs): GraphFilter {
    const graphFilter: GraphFilter = {
      outputs: ['COLOR'],
      filter: this.ffmpegFilter,
      options: Object.fromEntries(this.parameters.map(parameter => [
        parameter.name,
        evaluated[parameter.name] || String(evaluator.evaluate(parameter.name) || '')
      ]))
    }
    return graphFilter
   }

  parameters = [
    new Parameter({ name: "color", value: "color", dataType: DataType.Rgba }),
    new Parameter({ name: "size", value: "out_size" }),
    // new Parameter({ name: "duration", value: "out_duration" }),
    new Parameter({ name: "rate", value: "out_rate" }),
  ]
}

export { ColorFilter }
