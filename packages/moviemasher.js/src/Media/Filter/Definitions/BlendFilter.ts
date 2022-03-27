import { Evaluator } from "../../../Helpers/Evaluator"
import { Errors } from "../../../Setup/Errors"
import { DataType } from "../../../Setup/Enums"
import { FilterDefinitionClass } from "../FilterDefinition"
import { VisibleContext } from "../../../Context/VisibleContext"
import { Types } from "../../../Setup/Types"
import { Parameter } from "../../../Setup"

/**
 * @category Filter
 */
class BlendFilter extends FilterDefinitionClass {
  protected override drawFilterDefinition(evaluator : Evaluator) : VisibleContext {
    const { visibleContext, createVisibleContext } = evaluator
    const all_mode = evaluator.parameter('all_mode')
    const modes = Types.propertyType(DataType.Mode).values
    if (typeof modes === "undefined") throw Errors.unknown.mode

    const mode = modes.find(object => object.id === all_mode)
    if (typeof mode === "undefined") throw Errors.unknown.mode
    const { identifier } = mode
    createVisibleContext.drawWithComposite(visibleContext.drawingSource, identifier)
    return createVisibleContext
  }

  parameters: Parameter[] = [
    new Parameter({ name: "all_mode", value: "normal", dataType: DataType.Mode }),
    new Parameter({ name: "repeatlast", value: 0 }),
  ]
}

export { BlendFilter }
