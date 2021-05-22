import { CoreFilter } from "./CoreFilter"
import { Property } from "../Setup"

class BlendFilter extends CoreFilter {
  draw(evaluator, evaluated, outputContext) {
    const { context } = evaluator

    const modes = Property.propertyTypes.mode.values
    const mode = modes.find(object => object.id === evaluated.all_mode)
    const { composite } = mode

    outputContext.globalCompositeOperation = composite
    outputContext.drawImage(context.canvas, 0, 0)
    outputContext.globalCompositeOperation = 'normal'
    return outputContext
  }
}
const BlendFilterInstance = new BlendFilter
export { BlendFilterInstance as BlendFilter }
