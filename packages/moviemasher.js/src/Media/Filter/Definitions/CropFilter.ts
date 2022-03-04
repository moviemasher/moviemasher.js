import { VisibleContext } from "../../../Context/VisibleContext"
import { ContextFactory } from "../../../Context/ContextFactory"
import { EvaluatedRect } from "../../../declarations"
import { Errors } from "../../../Setup/Errors"
import { Evaluator } from "../../../Helpers/Evaluator"
import { FilterDefinitionClass } from "../FilterDefinition"
import { Parameter } from "../../../Setup/Parameter"

/**
 * @category Filter
 */
class CropFilter extends FilterDefinitionClass {
  draw(evaluator : Evaluator) : VisibleContext {
    const { context } = evaluator
    if (!context) throw Errors.invalid.context

    const x = Number(evaluator.evaluateParameter('x'))
    const y = Number(evaluator.evaluateParameter('y'))
    const inWidth = Number(evaluator.evaluate("in_w"))
    const inHeight = Number(evaluator.evaluate("in_h"))
    if (inWidth + inHeight < 2) throw Errors.eval.inputSize

    let outWidth = Number(evaluator.evaluateParameter('out_w'))
    let outHeight = Number(evaluator.evaluateParameter('out_h'))
    if (outWidth + outHeight < 2) throw Errors.eval.outputSize

    if (outWidth === -1) outWidth = inWidth * (outHeight / inHeight)
    if (outHeight === -1) outHeight = inHeight * (outWidth / inWidth)

    const fromSize = { width: outWidth, height: outHeight }
    const inRect = { x, y, ...fromSize }
    const drawing = ContextFactory.toSize(fromSize)
    drawing.drawInRectFromSize(context.drawingSource, inRect, fromSize)
    return drawing
  }

  parameters = [
    new Parameter({ name: "x", value: "((in_w - out_w) / 2)" }),
    new Parameter({ name: "y", value: "((in_h - out_h) / 2)" }),
    new Parameter({ name: "out_w", value: "out_width" }),
    new Parameter({ name: "out_h", value: "out_height" }),
  ]

  scopeSet(evaluator: Evaluator): void {
    evaluator.setInputDimensions()
  }
}

export { CropFilter }
