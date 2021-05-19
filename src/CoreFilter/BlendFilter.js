import { CoreFilter } from "./CoreFilter"
import { Property } from "../Setup"
import { Utilities } from "../Utilities"

const array_key = (array, value, key, id_key) => {
  return Utilities.findBy(array, value, id_key)[key];
}

class BlendFilter extends CoreFilter {
  draw(evaluator, evaluated, outputContext) {
    const context = evaluator.context
    
    const mode = array_key(Property.propertyTypes.mode.values, evaluated.all_mode, 'composite')
    outputContext.globalCompositeOperation = mode
    outputContext.drawImage(context.canvas, 0, 0)
    outputContext.globalCompositeOperation = 'normal'
    return outputContext
  }
}
const BlendFilterInstance = new BlendFilter
export { BlendFilterInstance as BlendFilter } 
