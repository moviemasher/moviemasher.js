import { Evaluator } from "../../../Utilities/Evaluator"
import { Errors } from "../../../Setup/Errors"
import { DataType } from "../../../Setup/Enums"
import { FilterDefinitionClass } from "../FilterDefinition"
import { VisibleContext } from "../../../Playing/VisibleContext"
import { Types } from "../../../Setup/Types"

class BlendFilter extends FilterDefinitionClass {

  // eslint-disable-next-line camelcase
  draw(evaluator : Evaluator, evaluated : { all_mode : string }) : VisibleContext {
    const { context, mergeContext } = evaluator
    if (!(context && mergeContext)) throw Errors.invalid.context

    const modes = Types.propertyType(DataType.Mode).values
    if (typeof modes === "undefined") throw Errors.unknown.mode

    const mode = modes.find(object => object.id === evaluated.all_mode)
    if (typeof mode === "undefined") throw Errors.unknown.mode

    const { identifier } = mode

    mergeContext.drawWithComposite(context.drawingSource, identifier)
    return mergeContext
  }
}

export { BlendFilter }
