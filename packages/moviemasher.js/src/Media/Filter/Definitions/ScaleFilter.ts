
import { EvaluatedSize, GraphFilter, FilterChainArgs, Size, ValueObject } from "../../../declarations"
import { Errors } from "../../../Setup/Errors"
import { Evaluator } from "../../../Helpers/Evaluator"
import { VisibleContext } from "../../../Context/VisibleContext"
import { ContextFactory } from "../../../Context/ContextFactory"
import { FilterDefinitionClass } from "../FilterDefinition"
import { GraphType } from "../../../Setup/Enums"

/**
 * @category Filter
 */
class ScaleFilter extends FilterDefinitionClass {
  draw(evaluator : Evaluator, evaluated : EvaluatedSize) : VisibleContext {
    const { context } = evaluator
    if (!context) throw Errors.invalid.context

    let outWidth = evaluated.w || evaluated.width || 0
    let outHeight = evaluated.h || evaluated.height || 0
    if (outWidth + outHeight < 2) return context

    const inWidth = Number(evaluator.evaluate("in_w"))
    const inHeight = Number(evaluator.evaluate("in_h"))
    if (inWidth + inHeight < 2) throw Errors.eval.inputSize


    const inSize : Size = { width: inWidth, height: inHeight }
    if (outWidth === -1) outWidth = inWidth * (outHeight / inHeight)
    else if (outHeight === -1) outHeight = inHeight * (outWidth / inWidth)

    const fromSize = { width: outWidth, height: outHeight }
    const drawing = ContextFactory.toSize(fromSize)
    // console.log(this.constructor.name, "draw", inSize, fromSize)

    drawing.drawInSizeFromSize(context.drawingSource, inSize, fromSize)
    return drawing
  }

  input(_evaluator: Evaluator, evaluated: ValueObject, args: FilterChainArgs): GraphFilter {
    const inputs: string[] = []
    const { prevFilter, inputCount } = args
    if (prevFilter?.outputs?.length) inputs.push(...prevFilter.outputs)
    else inputs.push(`${inputCount}:v`)

    const outWidth = evaluated.w || evaluated.width || 0
    const outHeight = evaluated.h || evaluated.height || 0
    const graphFilter: GraphFilter = {
      outputs: ['SCALE'],
      inputs,
      filter: this.ffmpegFilter,
      options: { width: outWidth, height: outHeight }
    }

    return graphFilter
  }

  scopeSet(evaluator: Evaluator): void {
    const { graphType, outputSize } = evaluator

    const { width: outputWidth, height: outputHeight } = outputSize
    evaluator.set("out_w", outputWidth)
    evaluator.set("out_h", outputHeight)

    if (graphType !== GraphType.Canvas) return

    const { width: inputWidth, height: inputHeight } = evaluator.context!.size
    evaluator.set("in_w", inputWidth)
    evaluator.set("in_h", inputHeight)
  }
}

export { ScaleFilter }
