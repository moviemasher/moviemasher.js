import { Is } from "../../Is"

export const toJSONTransform = {
  toJSON: { value: function() {
    const object = { id: this.id, type: this.type  }
    return { ...this.propertyValues, ...object } 
  } }
}
