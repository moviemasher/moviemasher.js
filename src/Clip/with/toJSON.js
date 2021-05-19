import { Is } from "../../Utilities"

export const toJSON = {
  toJSON: { value: function() {
    const object = { id: this.id, type: this.type, frame: this.frame  }
    if (Is.array(this.effects)) object.effects = this.effects
    return { ...this.propertyValues, ...object } 
  } }
}
