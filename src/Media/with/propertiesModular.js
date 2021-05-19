import { Is } from "../../Utilities"
import { Property } from "../../Setup"

export const propertiesModular = { 
  propertiesModular: { 
    get: function() { 
      if (Is.undefined(this.__propertiesModular)) {
        this.__propertiesModular = this.object.properties || {}
      }
      return this.__propertiesModular 
    }
  }, 
  modularPropertiesByType: {
    get: function() {
      if (Is.undefined(this.__modularPropertiesByType)) {
        this.__modularPropertiesByType = this.initializeModularPropertiesByType
      }
      return this.__modularPropertiesByType
    }
  },
  initializeModularPropertiesByType: {
    get: function() {
      const object = {}
      Property.modularPropertyTypeIds.forEach(type => {
        Object.keys(this.propertiesModular).forEach(property => {
          if (type === this.propertiesModular[property].type) {
            object[type] ||= []
            object[type].push(property)
          }
        })
      })
      return object
    }
  },
} 
