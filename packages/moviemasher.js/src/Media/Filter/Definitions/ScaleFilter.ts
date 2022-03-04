import { EvaluatedSize, ModularGraphFilter, FilterChainArgs, Size, ValueObject } from "../../../declarations"
import { Errors } from "../../../Setup/Errors"
import { Evaluator } from "../../../Helpers/Evaluator"
import { VisibleContext } from "../../../Context/VisibleContext"
import { ContextFactory } from "../../../Context/ContextFactory"
import { FilterDefinitionClass } from "../FilterDefinition"
import { DataType } from "../../../Setup/Enums"
import { Parameter } from "../../../Setup"

/**
 * @category Filter
 */
class ScaleFilter extends FilterDefinitionClass {
  draw(evaluator : Evaluator) : VisibleContext {
    const { context } = evaluator
    if (!context) throw Errors.invalid.context



    let outWidth = Number(evaluator.evaluateParameter('width'))
    let outHeight = Number(evaluator.evaluateParameter('height'))

    if (outWidth + outHeight < 2) return context

    const inWidth = Number(evaluator.evaluate("in_w"))
    const inHeight = Number(evaluator.evaluate("in_h"))
    if (inWidth + inHeight < 2) throw Errors.eval.inputSize


    const inSize : Size = { width: inWidth, height: inHeight }
    if (outWidth === -1) outWidth = inWidth * (outHeight / inHeight)
    else if (outHeight === -1) outHeight = inHeight * (outWidth / inWidth)

    const fromSize = { width: outWidth, height: outHeight }
    const drawing = ContextFactory.toSize(fromSize)

    drawing.drawInSizeFromSize(context.drawingSource, inSize, fromSize)
    return drawing
  }

  modularGraphFilter(evaluator: Evaluator): ModularGraphFilter {
    const width = evaluator.evaluateParameter('width')
    const height = evaluator.evaluateParameter('height')
    const graphFilter: ModularGraphFilter = {
      inputs: [],
      outputs: ['SCALE'],
      filter: this.ffmpegFilter,
      options: { width, height }
    }
    return graphFilter
  }

  parameters: Parameter[] = [
    new Parameter({ name: "width", value: "out_w", dataType: DataType.Number }),
    new Parameter({ name: "height", value: "out_h", dataType: DataType.Number }),
  ]

  scopeSet(evaluator: Evaluator): void {
    evaluator.setInputDimensions()
    evaluator.setOutputDimensions()
  }
}

export { ScaleFilter }
