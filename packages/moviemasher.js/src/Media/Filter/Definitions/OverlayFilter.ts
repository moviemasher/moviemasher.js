
import { VisibleContext } from "../../../Context/VisibleContext"
import { EvaluatedPoint, GraphFilter, FilterChainArgs, ValueObject } from "../../../declarations"
import { Errors } from "../../../Setup/Errors"
import { Evaluator } from "../../../Helpers/Evaluator"
import { FilterDefinitionClass } from "../FilterDefinition"
import { GraphType } from "../../../Setup/Enums"


/**
 * @category Filter
 */
class OverlayFilter extends FilterDefinitionClass {
  draw(evaluator : Evaluator, evaluated : EvaluatedPoint) : VisibleContext {
    const { x, y } = evaluated
    const { context, mergeContext } = evaluator
    if (!(context && mergeContext)) throw Errors.invalid.context

    mergeContext.drawAtPoint(context.drawingSource, { x: x || 0, y: y || 0 })
    return mergeContext
  }

  input(_evaluator: Evaluator, evaluated: ValueObject, args: FilterChainArgs): GraphFilter {
    const inputs: string[] = []
    const { prevFilter, inputCount } = args
    if (prevFilter?.outputs?.length) inputs.push(...prevFilter.outputs)
    else inputs.push(`${inputCount}:v`)
    const { x, y } = evaluated
    return {
      inputs,
      filter: this.ffmpegFilter,
      options: { x, y }
    }
  }

  scopeSet(evaluator: Evaluator): void {
    const { graphType, outputSize } = evaluator
    const { width: outputWidth, height: outputHeight } = outputSize
    evaluator.set("main_w", outputWidth)
    evaluator.set("main_h", outputHeight)

    if (graphType !== GraphType.Canvas) return


    const { width: inputWidth, height: inputHeight } = evaluator.context!.size
    evaluator.set("overlay_w", inputWidth)
    evaluator.set("overlay_h", inputHeight)
  }
}

export { OverlayFilter }
