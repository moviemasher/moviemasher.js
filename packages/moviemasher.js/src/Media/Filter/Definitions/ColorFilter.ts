import { ModularGraphFilter } from "../../../declarations"
import { Errors } from "../../../Setup/Errors"
import { Parameter } from "../../../Setup/Parameter"
import { Evaluator } from "../../../Helpers/Evaluator"
import { pixelColor } from "../../../Utility/Pixel"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { VisibleContext } from "../../../Context/VisibleContext"
import { DataType, GraphType } from "../../../Setup/Enums"
import { colorServer, colorYellow } from "../../../Utility/Color"

/**
 * @category Filter
 */
class ColorFilter extends FilterDefinitionClass {
  protected override drawFilterDefinition(evaluator : Evaluator) : VisibleContext {
    const { visibleContext: context } = evaluator
    if (!context) throw Errors.invalid.context + this.id

    const color = evaluator.parameter('color')
    context.drawFill(pixelColor(color))
    return context
  }

  modularGraphFilter(evaluator: Evaluator): ModularGraphFilter {
    const { graphType, preloading } = evaluator
    const graphFilter: ModularGraphFilter = { filter: this.ffmpegFilter, options: {} }
    if (!preloading) {
      if (graphType === GraphType.Canvas) {
        evaluator.visibleContext = this.drawFilterDefinition(evaluator)
      } else {
        graphFilter.options = evaluator.parameters
        graphFilter.options.color = colorServer(String(graphFilter.options.color))
      }
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
