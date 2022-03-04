import { VisibleContext } from "../../../Context"
import { Errors } from "../../../Setup/Errors"
import { Evaluator } from "../../../Helpers/Evaluator"
import { isPopulatedString } from "../../../Utility/Is"
import { pixelColor } from "../../../Utility/Pixel"
import { FilterDefinitionClass } from "../FilterDefinition"
import { colorBlack } from "../../../Utility/Color"
import { FilterChainArgs, ModularGraphFilter, ValueObject } from "../../../declarations"
import { DataType, Parameter } from "../../../Setup"

interface EvaluatedBox {
  x? : number
  y? : number
  color? : string
  width? : number
  height? : number
}

/**
 * @category Filter
 */
class DrawBoxFilter extends FilterDefinitionClass {
  draw(evaluator : Evaluator) : VisibleContext {
    const { context } = evaluator
    if (!context) throw Errors.invalid.context

    const color = evaluator.evaluateParameter('color')
    const width = Number(evaluator.evaluateParameter('width'))
    const height = Number(evaluator.evaluateParameter('height'))
    const x = Number(evaluator.evaluateParameter('x'))
    const y = Number(evaluator.evaluateParameter('y'))
    context.drawFillInRect(pixelColor(color), { x, y, width, height })
    return context
  }

  modularGraphFilter(evaluator: Evaluator): ModularGraphFilter {
    const modularGraphFilter = super.modularGraphFilter(evaluator)
    delete modularGraphFilter.inputs
    return modularGraphFilter
  }

  parameters: Parameter[] = [
    new Parameter({ name: "color", value: colorBlack, dataType: DataType.String }),
    new Parameter({ name: "width", value: "in_w", dataType: DataType.String }),
    new Parameter({ name: "height", value: "in_h", dataType: DataType.String }),
  ]

  scopeSet(evaluator: Evaluator): void {
    evaluator.setInputDimensions()
  }
}

export { DrawBoxFilter, EvaluatedBox }
