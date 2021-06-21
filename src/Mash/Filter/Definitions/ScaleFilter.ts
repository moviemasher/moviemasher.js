
import { EvaluatedSize, Size } from "../../../Setup/declarations"
import { Evaluator } from "../../../Utilities/Evaluator"
import { ContextFactory, VisibleContext } from "../../../Playing"
import { FilterDefinitionClass } from "../FilterDefinition"

class ScaleFilter extends FilterDefinitionClass {
  draw(evaluator : Evaluator, evaluated : EvaluatedSize) : VisibleContext {
    const { context } = evaluator
    let outWidth = evaluated.w || evaluated.width || 0
    let outHeight = evaluated.h || evaluated.height || 0
    if (outWidth + outHeight < 2) return context


    const inSize : Size = {
      width: Number(evaluator.get("mm_in_w")), height: Number(evaluator.get("mm_in_h"))
  } //evaluator.inputSize
    if (outWidth === -1) outWidth = inSize.width * (outHeight / inSize.height)
    else if (outHeight === -1) outHeight = inSize.height * (outWidth / inSize.width)

    const fromSize = { width: outWidth, height: outHeight }
    const drawing = ContextFactory.toSize(fromSize)
    // console.log(this.constructor.name, "draw", inSize, fromSize)

    drawing.drawInSizeFromSize(context.imageSource, inSize, fromSize)
    return drawing
  }

  id = 'scale'

  scopeSet(evaluator : Evaluator) : void {
    const { width, height } = evaluator.context.size
    evaluator.set("in_h", height)
    evaluator.set("mm_in_h", height)
    evaluator.set("in_w", width)
    evaluator.set("mm_in_w", width)
  }
}

export { ScaleFilter }
