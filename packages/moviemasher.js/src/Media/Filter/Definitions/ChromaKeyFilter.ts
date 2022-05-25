import { Errors } from "../../../Setup/Errors"
import { Parameter } from "../../../Setup/Parameter"
import { Evaluator } from "../../../Helpers/Evaluator"
import { colorGreen, colorToRgb } from "../../../Utility/Color"
import { pixelsRemoveRgba } from "../../../Utility/Pixel"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { VisibleContext } from "../../../Context/VisibleContext"
import { DataType } from "../../../Setup/Enums"

/**
 * @category Filter
 */
export class ChromaKeyFilter extends FilterDefinitionClass {
  protected override drawFilterDefinition(evaluator : Evaluator) : VisibleContext {
    const { visibleContext, createVisibleContext } = evaluator
    if (!visibleContext) throw Errors.invalid.context + this.id

    const { imageData } = visibleContext

    const accurate = !!evaluator.propertyValue('accurate')
    const similarity = evaluator.parameterNumber('similarity')
    const color = String(evaluator.parameter('color'))
    const blend = evaluator.parameterNumber('blend')

    pixelsRemoveRgba(imageData.data, visibleContext.size, colorToRgb(color), similarity, blend, accurate)
    createVisibleContext.drawImageData(imageData)
    return createVisibleContext
  }

  parameters = [
    new Parameter({ name: "color", value: colorGreen, dataType: DataType.Rgb }),
    new Parameter({ name: "similarity", value: 0.5, dataType: DataType.Number }),
    new Parameter({ name: "blend", value: 0.01, dataType: DataType.Number }),
  ]

}
