import { Base } from "../Base"
import { Errors } from "../Setup"
import { Is } from "../Utilities"

class Events extends Base {
  constructor(object) {
    super(object)
    this.methods = new Set
  }

  get target() { return this.object.target }
  set target(value) { 
    if (this.object.target !== value) {
      if (!Is.instanceOf(value, EventTarget)) throw Errors.object

      const methods = new Set(this.methods)

      methods.forEach(this.removeListener, this)
      this.object.target = value
      methods.forEach(this.addListener, this)      
    }
  }

  addListener(method) { 
    if (this.methods.add(method)) {
      this.target && this.target.addEventListener(Events.type, method) 
    }
  }

  emit(type, info = {}) {
    const detail = { type, ...info }
    const event = { detail }
    this.target && this.target.dispatchEvent(new CustomEvent(Events.type, event))
  }

  removeListener(method) { 
    if (this.methods.delete(method)) {
      this.target && this.target.removeEventListener(Events.type, method) 
    }
  }
}

Object.defineProperties(Events, { type: { value: "masher" } })

export { Events }