import { ModularGraphFilter, ValueObject } from "../../../declarations"
import { Errors } from "../../../Setup/Errors"
import { Parameter } from "../../../Setup/Parameter"
import { Evaluator } from "../../../Helpers/Evaluator"
import { pixelColor } from "../../../Utility/Pixel"
import { FilterDefinitionClass } from "../FilterDefinition"
import { VisibleContext } from "../../../Context/VisibleContext"
import { DataType } from "../../../Setup/Enums"
import { colorYellow } from "../../../Utility/Color"

/**
 * @category Filter
 */
class ColorFilter extends FilterDefinitionClass {
  draw(evaluator : Evaluator) : VisibleContext {
    const { context } = evaluator
    if (!context) throw Errors.invalid.context

    const color = evaluator.evaluateParameter('color')
    context.drawFill(pixelColor(color))
    return context
  }

  modularGraphFilter(evaluator: Evaluator): ModularGraphFilter {
    const graphFilter: ModularGraphFilter = {
      outputs: ['COLOR'],
      filter: this.ffmpegFilter,
      options: evaluator.valueObject
    }
    return graphFilter
   }

  parameters = [
    new Parameter({ name: "color", value: colorYellow, dataType: DataType.Rgba }),
    new Parameter({ name: "size", value: "out_size", dataType: DataType.String }),
    new Parameter({ name: "rate", value: "out_rate", dataType: DataType.String }),
  ]
}

export { ColorFilter }
