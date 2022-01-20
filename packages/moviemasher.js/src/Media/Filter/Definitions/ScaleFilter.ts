
import { EvaluatedSize, GraphFilter, Size, ValueObject } from "../../../declarations"
import { Errors } from "../../../Setup/Errors"
import { Evaluator } from "../../../Helpers/Evaluator"
import { VisibleContext } from "../../../Context/VisibleContext"
import { ContextFactory } from "../../../Context/ContextFactory"
import { FilterDefinitionClass } from "../FilterDefinition"

class ScaleFilter extends FilterDefinitionClass {
  draw(evaluator : Evaluator, evaluated : EvaluatedSize) : VisibleContext {
    const { context } = evaluator
    if (!context) throw Errors.invalid.context

    let outWidth = evaluated.w || evaluated.width || 0
    let outHeight = evaluated.h || evaluated.height || 0
    if (outWidth + outHeight < 2) return context


    const inSize : Size = {
      width: Number(evaluator.get("mm_in_w")), height: Number(evaluator.get("mm_in_h"))
    }
    if (outWidth === -1) outWidth = inSize.width * (outHeight / inSize.height)
    else if (outHeight === -1) outHeight = inSize.height * (outWidth / inSize.width)

    const fromSize = { width: outWidth, height: outHeight }
    const drawing = ContextFactory.toSize(fromSize)
    // console.log(this.constructor.name, "draw", inSize, fromSize)

    drawing.drawInSizeFromSize(context.drawingSource, inSize, fromSize)
    return drawing
  }

  input(_evaluator: Evaluator, evaluated: ValueObject): GraphFilter {
    const outWidth = evaluated.w || evaluated.width || 0
    const outHeight = evaluated.h || evaluated.height || 0
    const graphFilter: GraphFilter = {
      filter: this.id,
      options: { width: outWidth, height: outHeight }
    }

    return graphFilter
  }

  scopeSet(evaluator: Evaluator): void {
    const { context } = evaluator
    if (!context) return

    const { width, height } = context.size
    evaluator.set("in_h", height)
    evaluator.set("mm_in_h", height)
    evaluator.set("in_w", width)
    evaluator.set("mm_in_w", width)
  }
}

export { ScaleFilter }
