import { Base } from "../Base"
import { Is } from "../Utilities"
import { Property } from "../Setup"

class Media extends Base {
  id : string

  properties? : object[]

  type: string

  initializeInstance(clip, object) {
    const { properties } = this
    if (!Is.object(properties) || Is.empty(properties)) return

    const names = this.propertyNames.filter(name => !Reflect.has(clip, name))
    if (!Is.emptyarray(names)) {
      const entries = names.map(name => [name, {
        get() {
          const key = `__${name}`
          if (Is.undefined(this[key])) {
            const property = properties[name]
            this[key] = Property.orDefault(property)
          }
          return this[key]
        },
        set(value) { this[`__${name}`] = value }
      }])
      Object.defineProperties(clip, Object.fromEntries(entries))
      this.propertyNames.forEach(name => {
        if (Is.defined(object[name])) clip.set(name, object[name])
      })
    }
  }

  get propertyNames() : string[] {
    return this.properties ? Object.keys(this.properties) : []
  }
}

export { Media }
