
import { VisibleContext } from "../../../Playing"
import { EvaluatedPoint } from "../../../Setup/declarations"
import { Errors } from "../../../Setup/Errors"
import { Evaluator } from "../../../Utilities"
import { FilterDefinitionClass } from "../FilterDefinition"

class OverlayFilter extends FilterDefinitionClass {
  draw(evaluator : Evaluator, evaluated : EvaluatedPoint) : VisibleContext {
    const { x, y } = evaluated
    const { context, mergeContext } = evaluator
    if (typeof mergeContext === "undefined") throw Errors.internal + 'OverlayFilter mergeContext'

    mergeContext.drawAtPoint(context.drawingSource, { x: x || 0, y: y || 0 })
    return mergeContext
  }

  // id = 'overlay'

  scopeSet(evaluator : Evaluator) : void {
    const { width, height } = evaluator.context.size
    evaluator.set("overlay_w", width)
    evaluator.set("overlay_h", height)
  }
}

export { OverlayFilter }
