import { VisibleContext } from "../../../Context/VisibleContext"
import { ContextFactory } from "../../../Context/ContextFactory"
import { EvaluatedRect } from "../../../declarations"
import { Errors } from "../../../Setup/Errors"
import { Evaluator } from "../../../Helpers/Evaluator"
import { FilterDefinitionClass } from "../FilterDefinition"
import { GraphType } from "../../../Setup/Enums"
import { Parameter } from "../../../Setup/Parameter"

/**
 * @category Filter
 */
class CropFilter extends FilterDefinitionClass {
  draw(evaluator : Evaluator, evaluated : EvaluatedRect) : VisibleContext {
    const { context } = evaluator
    if (!context) throw Errors.invalid.context

    const x = evaluated.x || 0
    const y = evaluated.y || 0
    const inWidth = Number(evaluator.evaluate("in_w"))
    const inHeight = Number(evaluator.evaluate("in_h"))
    if (inWidth + inHeight < 2) throw Errors.eval.inputSize

    let outWidth = evaluated.w || evaluated.out_w || 0
    let outHeight = evaluated.h || evaluated.out_h || 0
    // console.log(this.constructor.name, outWidth, outHeight, evaluated)

    if (outWidth + outHeight < 2) throw Errors.eval.outputSize

    if (outWidth === -1) outWidth = inWidth * (outHeight / inHeight)
    if (outHeight === -1) outHeight = inHeight * (outWidth / inWidth)

    const fromSize = { width: outWidth, height: outHeight }
    const inRect = { x, y, ...fromSize }
    const drawing = ContextFactory.toSize(fromSize)
    // console.log(this.constructor.name, "draw", inRect, fromSize)

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
    const { graphType } = evaluator
    if (graphType !== GraphType.Canvas) return

    const { width: inputWidth, height: inputHeight } = evaluator.context!.size
    evaluator.set("in_w", inputWidth)
    evaluator.set("in_h", inputHeight)
  }
}

export { CropFilter }
