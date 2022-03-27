import { VisibleContext } from "../../../Context/VisibleContext"
import { Errors } from "../../../Setup/Errors"
import { Evaluator } from "../../../Helpers/Evaluator"
import { FilterDefinitionClass } from "../FilterDefinition"
import { Parameter } from "../../../Setup/Parameter"
import { DataType } from "../../../Setup/Enums"

/**
 * @category Filter
 */
class FadeFilter extends FilterDefinitionClass {
  protected override drawFilterDefinition(evaluator : Evaluator) : VisibleContext {
    const { visibleContext: context } = evaluator
    if (!context) throw Errors.invalid.context + this.id

    const typeValue = evaluator.parameter('type')

    const alpha = Number(evaluator.get('t')) // note this is different than parameter
    const type = String(typeValue || 'in')
    const directionAlpha = type === 'in' ? alpha : 1.0 - alpha
    const { createVisibleContext: mergeContext } = evaluator

    if (directionAlpha > 0.0) {
      // console.log(this.constructor.name, "drawFilterDefinition", directionAlpha)
      mergeContext.drawWithAlpha(context.drawingSource, directionAlpha)
    }
    return mergeContext
    // return context
  }

  parameters = [
    new Parameter({ name: "type", value: "in", dataType: DataType.String, values: ["in", "out"] }),
    new Parameter({ name: "alpha", value: 1, dataType: DataType.Number }),
    new Parameter({ name: "duration", value: "out_duration", dataType: DataType.String }),
  ]
}

export { FadeFilter }
