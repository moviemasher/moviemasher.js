import { Errors } from "./Errors"
import { Is } from "../Utilities/Is"

class Property {}

Object.defineProperties(Property.prototype, {
  modularPropertyTypeIds: {
    get() {
      if (Is.undefined(this.__modularPropertyTypeIds)) {
        const ids = Object.keys(this.propertyTypes)
        this.__modularPropertyTypeIds = ids.filter(id => (
          this.propertyTypes[id].modular
        ))
      }
      return this.__modularPropertyTypeIds
    }
  },
  orDefault: {
    value(property : { value: string | number, type: string }) : string | number {
      const { value, type } = property
      return Is.defined(value) ? value : this.propertyTypeDefault(type)
    }
  },
  property_types: { // deprecated
    get() {
      console.warn(Errors.deprecation.property_types)
      return this.propertyTypes
    }
  },
  propertyType: { value(type : string) { return this.propertyTypes[type] } },
  propertyTypeDefault: {
    value(type : string) : string | number {
      if (!Is.string(type) || Is.empty(type)) return ""

      const propertyType = this.propertyType(type)
      if (!Is.object(propertyType)) return ""

      if (Is.defined(propertyType.value)) return propertyType.value
      const Klass = propertyType.type
      if (Klass) return new Klass()

      return ""
    }
  },
  propertyTypes: {
    value: {
      number: {
        type: Number,
        value: 0,
      },
      integer: {
        type: Number,
        value: 0,
      },
      rgba: {
        type: String,
        value: '#000000FF',
      },
      rgb: {
        type: String,
        value: '#000000',
      },
      font: {
        type: String,
        value: 'com.moviemasher.font.default',
        modular: true,
      },
      fontsize: {
        type: Number,
        value: 13,
      },
      direction4: {
        type: Number,
        values: [
          { id: 0, identifier: 'top', label: 'Top' },
          { id: 1, identifier: 'right', label: 'Right' },
          { id: 2, identifier: 'bottom', label: 'Bottom' },
          { id: 3, identifier: 'left', label: 'Left' },
        ],
        value: 0,
      },
      direction8: {
        type: Number,
        values: [
          { id: 0, identifier: "top", label: "Top" },
          { id: 1, identifier: "right", label: "Right" },
          { id: 2, identifier: "bottom", label: "Bottom" },
          { id: 3, identifier: "left", label: "Left" },
          { id: 4, identifier: "top_right", label: "Top Right" },
          { id: 5, identifier: "bottom_right", label: "Bottom Right" },
          { id: 6, identifier: "bottom_left", label: "Bottom Left" },
          { id: 7, identifier: "top_left", label: "Top Left" },
        ],
        value: 0,
      },
      string: {
        type: String,
        value: '',
      },
      pixel: {
        type: Number,
        value: 0.0,
      },
      mode: {
        type: String,
        value: 'normal',
        values: [
          { id: "burn", composite: "color-burn", label: "Color Burn" },
          { id: "dodge", composite: "color-dodge", label: "Color Dodge" },
          { id: "darken", composite: "darken", label: "Darken" },
          { id: "difference", composite: "difference", label: "Difference" },
          { id: "exclusion", composite: "exclusion", label: "Exclusion" },
          { id: "hardlight", composite: "hard-light", label: "Hard Light" },
          { id: "lighten", composite: "lighter", label: "Lighten" },
          { id: "multiply", composite: "multiply", label: "Multiply" },
          { id: "normal", composite: "normal", label: "Normal" },
          { id: "overlay", composite: "overlay", label: "Overlay" },
          { id: "screen", composite: "screen", label: "Screen" },
          { id: "softlight", composite: "soft-light", label: "Soft Light" },
          { id: "xor", composite: "xor", label: "Xor" },
        ]
      },
      text: {
        type: String,
        value: '',
      },
    },
  }
})

const PropertyInstance = new Property()
export { PropertyInstance as Property }
