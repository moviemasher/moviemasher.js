import { object } from "./object"

// clips and transforms
export const editable = {
  ...object,
  propertyNames: { get: function() { return Object.keys(this.properties)} },
  properties: {
    get: function() { return this.__properties ||= this.propertiesInitialize }
  },
  propertiesInitialize: {
    get: function() { 
      const object = { ...this.media.properties }
      if (this.propertiesTransform) Object.assign(object, this.propertiesTransform)
      return object
    }
  },
}