import { EventsTarget, EventsCallback } from "../../Setup/declarations"
import { Action } from "../Action"


class Events {
  constructor(object : { target? : EventsTarget } = {}) {
    // console.log("Events constructor")
    const { target } = object
    if (target) this.target = target
  }

  methods : Set<EventsCallback> = new Set()

  get target() : EventsTarget | undefined { return this.__target }

  set target(value : EventsTarget | undefined) {
    if (this.__target !== value) {
      const methods = new Set(this.methods)
      methods.forEach(this.removeListener, this)
      this.__target = value
      methods.forEach(this.addListener, this)
    }
  }

  addListener(method : EventsCallback) : void {
    if (this.methods.add(method)) {
      if (!this.target) return

      this.target.addEventListener(Events.type, method)
    }
  }

  emit(type : string, info = {}) : void {
    const detail = { type, ...info }
    const event = { detail }
    if (!this.target) return

    this.target.dispatchEvent(new CustomEvent(Events.type, event))
  }

  removeListener(method : EventsCallback) : void {
    if (this.methods.delete(method)) {
      if (!this.target) return

      this.target.removeEventListener(Events.type, method)
    }
  }

  static get type() : string { return "masher" }

  __target? : EventsTarget
}
interface EventsDetail {
  action? : Action
  type : string
}
type EventsType = CustomEvent<EventsDetail>

export { Events, EventsType, EventsDetail}
