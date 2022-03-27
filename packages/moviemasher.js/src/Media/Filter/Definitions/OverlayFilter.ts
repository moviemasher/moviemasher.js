import { VisibleContext } from "../../../Context/VisibleContext"
import { ModularGraphFilter } from "../../../declarations"
import { Errors } from "../../../Setup/Errors"
import { Evaluator } from "../../../Helpers/Evaluator"
import { FilterDefinitionClass } from "../FilterDefinition"
import { isNan } from "../../../Utility/Is"
import { GraphType, Parameter } from "../../../Setup"


/**
 * @category Filter
 */
class OverlayFilter extends FilterDefinitionClass {
  protected override drawFilterDefinition(evaluator: Evaluator): VisibleContext {
    const x = Number(evaluator.parameter('x'))
    const y = Number(evaluator.parameter('y'))
    if (isNan(x)) throw Errors.invalid.property + 'x'
    if (isNan(y)) throw Errors.invalid.property + 'y'

    const { visibleContext: context, createVisibleContext: mergeContext } = evaluator
    if (!(context && mergeContext)) throw Errors.invalid.context + this.id

    mergeContext.drawAtPoint(context.drawingSource, { x, y })
    return mergeContext
  }

  modularGraphFilter(evaluator: Evaluator): ModularGraphFilter {
    const { graphType, preloading } = evaluator
    const graphFilter: ModularGraphFilter = {
      inputs: [], filter: this.ffmpegFilter, options: {}
    }
    evaluator.setOutputDimensions('main')
    if (!preloading) {
      if (graphType === GraphType.Canvas) {
        evaluator.setInputDimensions('overlay')
        evaluator.visibleContext = this.drawFilterDefinition(evaluator)
      } else {
        graphFilter.options.x = evaluator.parameter('x')
        graphFilter.options.y = evaluator.parameter('y')
      }
    }
    return graphFilter
  }

  parameters: Parameter[] = [
    new Parameter({ name: "x", value: 0 }),
    new Parameter({ name: "y", value: 0 }),
  ]
}

export { OverlayFilter }
