import { Base } from "../Base"

class Events extends Base {
  methods : Set<Function> = new Set()

  get target() { return this.object.target }

  set target(value) {
    if (this.object.target !== value) {
      const methods = new Set(this.methods)
      methods.forEach(this.removeListener, this)
      this.object.target = value
      methods.forEach(this.addListener, this)
    }
  }

  addListener(method) {
    if (this.methods.add(method)) {
      if (!this.target) return

      this.target.addEventListener(Events.type, method)
    }
  }

  emit(type : string, info = {}) {
    const detail = { type, ...info }
    const event = { detail }
    if (!this.target) return

    this.target.dispatchEvent(new CustomEvent(Events.type, event))
  }

  removeListener(method : Function) {
    if (this.methods.delete(method)) {
      if (!this.target) return

      this.target.removeEventListener(Events.type, method)
    }
  }

  static get type() { return "masher" }
}

export { Events }
