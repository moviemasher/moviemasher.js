import { VisibleContext } from "../../../Context/VisibleContext"
import { ContextFactory } from "../../../Context/ContextFactory"
import { Evaluator } from "../../../Helpers/Evaluator"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { Parameter } from "../../../Setup/Parameter"
import { DataType } from "../../../Setup/Enums"
import { ModularGraphFilter } from "../../../declarations"

/**
 * @category Filter
 */
export class CropFilter extends FilterDefinitionClass {
  protected override drawFilterDefinition(evaluator: Evaluator): VisibleContext {
    const width = evaluator.parameterNumber('out_w')
    const height = evaluator.parameterNumber('out_h')
    const fromSize = { width, height }
    const drawing = ContextFactory.toSize(fromSize)
    const x = evaluator.parameterNumber('x')
    const y = evaluator.parameterNumber('y')
    const inRect = { x, y, ...fromSize }
    const { visibleContext } = evaluator
    drawing.drawInRectFromSize(visibleContext.drawingSource, inRect, fromSize)
    return drawing
  }

  modularGraphFilter(evaluator: Evaluator): ModularGraphFilter {
    evaluator.setInputDimensions()
    return super.modularGraphFilter(evaluator)
  }

  parameters = [
    new Parameter({ name: "x", value: "((in_w - out_w) / 2)", dataType: DataType.String }),
    new Parameter({ name: "y", value: "((in_h - out_h) / 2)", dataType: DataType.String }),
    new Parameter({ name: "out_w", value: "out_width", dataType: DataType.String }),
    new Parameter({ name: "out_h", value: "out_height", dataType: DataType.String }),
  ]
}
