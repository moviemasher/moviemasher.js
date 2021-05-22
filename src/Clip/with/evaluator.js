import { Errors, Property } from "../../Setup"
import { Is } from "../../Utilities/Is"
import { Evaluator } from "../Evaluator"

export const evaluator = {
  evaluator: {
    value: function(clipRange, context, dimensions){
      const evaluator = new Evaluator(clipRange, context, dimensions)
      if (this.media.properties) {
        Object.keys(this.media.properties).forEach(key => {
          let value = this[key]
          if (Is.undefined(value)) {
            console.log("this lacked property", key, this)
            const property = this.media.properties[key]
            value = property.value
            if (Is.undefined(value)) {
              console.log("Transform.draw media lacked property value", property)

              value = Property.propertyTypeDefault(property.type)

              if (Is.undefined(value)) throw Errors.unknown.type + property.type
            }
          }
          evaluator.set(key, value)
        })
      }
      return evaluator
    }
  },
}
