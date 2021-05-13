import { Is } from "../../Is"
import { id } from "../../Base/with/id";
import { label } from "./label"
import { object } from "../../Base/with/object"
import { Property } from "../../Utilities";
import { toJSONFromObject } from "../../Base/with/toJSONFromObject";

export const sharedMedia = {
  ...object,
  ...toJSONFromObject,
  ...id,
  ...label,
  properties: { 
    get: function() { 
      if (Is.undefined(this.__properties)) this.__properties = this.propertiesInitialize 
      return this.__properties 
    }
  },
  propertyNames: { get: function() { return Object.keys(this.properties) } },
  propertiesInitialize: { 
    get: function() {
      const object = { label: { type: 'string' } }
      if (this.propertiesTiming) Object.assign(object, this.propertiesTiming)
      if (this.propertiesAudible) Object.assign(object, this.propertiesAudible)
      if (this.propertiesModular) Object.assign(object, this.propertiesModular)
      return object
    }
  },
  source: { get: function() { return this.object.source } },
  initializeInstance: { value: function(clip, object) {
    const properties = this.properties 
    if (!Is.object(properties) || Is.empty(properties)) return

    const names = this.propertyNames.filter(name => !Reflect.has(clip, name))
    if (!Is.emptyarray(names)) {
      const entries = names.map(name => [name, { 
        get: function() { 
          const key = `__${name}`
          if (Is.undefined(this[key])) {
            const property = properties[name]
            this[key] = Property.orDefault(property)
            //console.log("initialized", key, this[key])
          }
          return this[key]
        },
        set: function(value) { this[`__${name}`] = value }
      }])
      Object.defineProperties(clip, Object.fromEntries(entries))
      this.propertyNames.forEach(name => {
        if (Is.defined(object[name])) clip[name] = object[name]
      })
    }
    
    
  }},
}