import { VisibleContext } from "../../../Context/VisibleContext"
import { EvaluatedPoint, ModularGraphFilter, FilterChainArgs, ValueObject } from "../../../declarations"
import { Errors } from "../../../Setup/Errors"
import { Evaluator } from "../../../Helpers/Evaluator"
import { FilterDefinitionClass } from "../FilterDefinition"
import { isNan } from "../../../Utility/Is"
import { Parameter } from "../../../Setup"


/**
 * @category Filter
 */
class OverlayFilter extends FilterDefinitionClass {
  draw(evaluator: Evaluator): VisibleContext {
    const x = Number(evaluator.evaluateParameter('x'))
    const y = Number(evaluator.evaluateParameter('y'))
    if (isNan(x)) throw Errors.invalid.property + 'x'
    if (isNan(y)) throw Errors.invalid.property + 'y'

    const { context, mergeContext } = evaluator
    if (!(context && mergeContext)) throw Errors.invalid.context

    mergeContext.drawAtPoint(context.drawingSource, { x, y })
    return mergeContext
  }

  modularGraphFilter(evaluator: Evaluator): ModularGraphFilter {
    const x = Number(evaluator.evaluateParameter('x'))
    const y = Number(evaluator.evaluateParameter('y'))
    return {
      inputs: [],
      filter: this.ffmpegFilter,
      options: { x, y }
    }
  }

  parameters: Parameter[] = [
    new Parameter({ name: "x", value: 0 }),
    new Parameter({ name: "y", value: 0 }),
  ]

  scopeSet(evaluator: Evaluator): void {
    evaluator.setInputDimensions('overlay')
    evaluator.setOutputDimensions('main')
  }
}

export { OverlayFilter }
