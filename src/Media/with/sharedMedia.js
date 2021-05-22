import { Is } from "../../Utilities"
import { id } from "../../Base/with/id"
import { label } from "./label"
import { object } from "../../Base/with/object"
import { toJSONFromObject } from "../../Base/with/toJSONFromObject"

export const sharedMedia = {
  ...object,
  ...toJSONFromObject,
  ...id,
  ...label,
  properties: {
    get() {
      if (Is.undefined(this.__properties)) this.__properties = this.propertiesInitialize
      return this.__properties
    }
  },

  propertiesInitialize: {
    get() {
      const object = { label: { type: 'string' } }
      if (this.propertiesTiming) Object.assign(object, this.propertiesTiming)
      if (this.propertiesAudible) Object.assign(object, this.propertiesAudible)
      if (this.propertiesModular) Object.assign(object, this.propertiesModular)
      return object
    }
  },
  source: { get() { return this.object.source } },
}
