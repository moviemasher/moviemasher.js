import { VisibleContext } from "../../../Context"
import { Errors } from "../../../Setup/Errors"
import { Evaluator } from "../../../Helpers/Evaluator"
import { pixelColor } from "../../../Utility/Pixel"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { colorBlack } from "../../../Utility/Color"
import { ModularGraphFilter } from "../../../declarations"
import { DataType, Parameter } from "../../../Setup"

/**
 * @category Filter
 */
export class DrawBoxFilter extends FilterDefinitionClass {
  protected override drawFilterDefinition(evaluator : Evaluator) : VisibleContext {
    const { visibleContext: context } = evaluator
    if (!context) throw Errors.invalid.context + this.id

    const color = evaluator.parameter('color')
    const width = Number(evaluator.parameter('width'))
    const height = Number(evaluator.parameter('height'))
    const x = Number(evaluator.parameter('x'))
    const y = Number(evaluator.parameter('y'))
    context.drawFillInRect(pixelColor(color), { x, y, width, height })
    return context
  }

  modularGraphFilter(evaluator: Evaluator): ModularGraphFilter {
    evaluator.setInputDimensions()
    const modularGraphFilter = super.modularGraphFilter(evaluator)
    delete modularGraphFilter.inputs
    return modularGraphFilter
  }

  parameters: Parameter[] = [
    new Parameter({ name: "color", value: colorBlack, dataType: DataType.String }),
    new Parameter({ name: "width", value: "in_w", dataType: DataType.String }),
    new Parameter({ name: "height", value: "in_h", dataType: DataType.String }),
  ]
}
