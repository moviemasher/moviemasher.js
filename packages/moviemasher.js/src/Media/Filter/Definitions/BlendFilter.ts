import { Evaluator } from "../../../Helpers/Evaluator"
import { Errors } from "../../../Setup/Errors"
import { DataType } from "../../../Setup/Enums"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { VisibleContext } from "../../../Context/VisibleContext"
import { Parameter } from "../../../Setup/Parameter"
import { Modes } from "../../../Setup/Modes"

/**
 * @category Filter
 */
export class BlendFilter extends FilterDefinitionClass {
  protected override drawFilterDefinition(evaluator : Evaluator) : VisibleContext {
    const { visibleContext, createVisibleContext } = evaluator
    const all_mode = evaluator.parameterNumber('all_mode')
    const mode = Modes[all_mode]
    if (!mode) throw Errors.unknown.mode

    createVisibleContext.drawWithComposite(visibleContext.drawingSource, mode)
    return createVisibleContext
  }

  parameters: Parameter[] = [
    new Parameter({ name: "all_mode", value: 0, dataType: DataType.Mode }),
    new Parameter({ name: "repeatlast", value: 0 }),
  ]
}
