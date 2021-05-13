import { TransformTypes } from "../../Types"

export const propertyValues = {
  propertyValues: { get: function() {
    // console.log(this.constructor.name, "propertyValues", this.properties)
    return Object.fromEntries(Object.keys(this.properties).map(property => {
      const valueOrTransform = this[property]
      const transform = TransformTypes.includes(property)
      const value = transform ? valueOrTransform.id : valueOrTransform
      
      return [property, value]
    }))
  }}
}