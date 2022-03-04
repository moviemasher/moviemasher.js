import { ContextFactory } from "../../../Context/ContextFactory"
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
  draw(evaluator : Evaluator) : VisibleContext {
    const { context } = evaluator
    if (!context) throw Errors.invalid.context

    const drawing = ContextFactory.toSize(context.size)
    const alphaValue = evaluator.evaluateParameter('alpha')
    const typeValue = evaluator.evaluateParameter('type')

    const alpha = Number(alphaValue || evaluator.position)
    const type = String(typeValue || 'in')
    const typedAlpha = type === 'in' ? alpha : 1.0 - alpha
    if (alpha > 0.0) drawing.drawWithAlpha(context.drawingSource, typedAlpha)
    return drawing
  }

  parameters = [
    new Parameter({ name: "type", value: "in", dataType: DataType.String, values: ["in", "out"] }),
    new Parameter({ name: "alpha", value: "t", dataType: DataType.String }),
    new Parameter({ name: "duration", value: "out_duration", dataType: DataType.String }),
  ]
}

export { FadeFilter }
