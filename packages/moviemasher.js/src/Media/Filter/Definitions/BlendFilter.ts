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

  // eslint-disable-next-line camelcase
  draw(evaluator : Evaluator) : VisibleContext {
    const { context, mergeContext } = evaluator
    if (!(context && mergeContext)) throw Errors.invalid.context

    const all_mode = evaluator.evaluateParameter('all_mode')

    const modes = Types.propertyType(DataType.Mode).values
    if (typeof modes === "undefined") throw Errors.unknown.mode

    const mode = modes.find(object => object.id === all_mode)
    if (typeof mode === "undefined") throw Errors.unknown.mode

    const { identifier } = mode

    mergeContext.drawWithComposite(context.drawingSource, identifier)
    return mergeContext
  }

  parameters: Parameter[] = [
    new Parameter({ name: "all_mode", value: "normal", dataType: DataType.Mode }),
    new Parameter({ name: "repeatlast", value: 0 }),
  ]
}

export { BlendFilter }
