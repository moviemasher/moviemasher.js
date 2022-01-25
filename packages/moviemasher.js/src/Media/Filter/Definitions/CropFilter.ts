import { VisibleContext } from "../../../Context/VisibleContext"
import { ContextFactory } from "../../../Context/ContextFactory"
import { EvaluatedRect } from "../../../declarations"
import { Errors } from "../../../Setup/Errors"
import { Evaluator } from "../../../Helpers/Evaluator"
import { FilterDefinitionClass } from "../FilterDefinition"

/**
 * @category Filter
 */
class CropFilter extends FilterDefinitionClass {
  draw(evaluator : Evaluator, evaluated : EvaluatedRect) : VisibleContext {
    const { context } = evaluator
    if (!context) throw Errors.invalid.context

    const x = evaluated.x || 0
    const y = evaluated.y || 0
    const inSize = evaluator.inputSize
    let width = evaluated.w || evaluated.out_w || 0
    let height = evaluated.h || evaluated.out_h || 0
    // console.log(this.constructor.name, width, height, evaluated)

    if (width + height < 2) throw Errors.eval.outputSize

    if (width === -1) width = inSize.width * (height / inSize.height)
    if (height === -1) height = inSize.height * (width / inSize.width)

    const fromSize = { width, height }
    const inRect = { x, y, ...fromSize }
    const drawing = ContextFactory.toSize(fromSize)
    // console.log(this.constructor.name, "draw", inRect, fromSize)

    drawing.drawInRectFromSize(context.drawingSource, inRect, fromSize)
    return drawing
  }

  scopeSet(evaluator: Evaluator): void {
    const { context } = evaluator
    if (!context) return

    evaluator.setInputSize(context.size)
    evaluator.initialize("x", '((in_w - out_w) / 2)')
    evaluator.initialize("y", '((in_h - out_h) / 2)')
  }
}

export { CropFilter }
