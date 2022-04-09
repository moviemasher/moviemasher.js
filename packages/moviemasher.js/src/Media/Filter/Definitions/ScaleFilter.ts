import { ModularGraphFilter, Size } from "../../../declarations"
import { Errors } from "../../../Setup/Errors"
import { Evaluator } from "../../../Helpers/Evaluator"
import { VisibleContext } from "../../../Context/VisibleContext"
import { ContextFactory } from "../../../Context/ContextFactory"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { DataType, GraphType } from "../../../Setup/Enums"
import { Parameter } from "../../../Setup"

/**
 * @category Filter
 */
class ScaleFilter extends FilterDefinitionClass {
  protected override  drawFilterDefinition(evaluator : Evaluator) : VisibleContext {
    const inWidth = Number(evaluator.get("in_w"))
    const inHeight = Number(evaluator.get("in_h"))
    if (inWidth + inHeight < 2) throw Errors.eval.inputSize + `${inWidth}x${inHeight}`

    const outWidth = evaluator.parameterNumber('width')
    const outHeight = evaluator.parameterNumber('height')
    const inSize : Size = { width: inWidth, height: inHeight }
    const outSize = { width: outWidth, height: outHeight }
    const { visibleContext: context } = evaluator
    const drawing = ContextFactory.toSize(outSize)
    drawing.drawInSizeFromSize(context.drawingSource, inSize, outSize)
    return drawing
  }

  modularGraphFilter(evaluator: Evaluator): ModularGraphFilter {
    const { graphType, preloading } = evaluator
    const graphFilter: ModularGraphFilter = {
      inputs: [], filter: this.ffmpegFilter, options: {}
    }
    evaluator.setOutputDimensions()
    if (!preloading) {
      if (graphType === GraphType.Canvas) {
        evaluator.setInputDimensions()
        evaluator.visibleContext = this.drawFilterDefinition(evaluator)
      } else {
        graphFilter.options.width = evaluator.parameter('width')
        graphFilter.options.height = evaluator.parameter('height')
      }
    }
    return graphFilter
  }

  parameters: Parameter[] = [
    new Parameter({ name: "width", value: "out_w", dataType: DataType.Number }),
    new Parameter({ name: "height", value: "out_h", dataType: DataType.Number }),
  ]
}

export { ScaleFilter }
