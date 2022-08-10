import { UnknownObject } from "../declarations"
import { EventType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"

export class Emitter extends EventTarget {
  dispatch(type: EventType, detail?: UnknownObject): void {
    // console.log(this.constructor.name, "dispatch", type, detail)
    this.dispatchEvent(this.event(type, detail))
  }

  emit(type: EventType, detail?: UnknownObject): void {
    if (!this.trapped.has(type)) {
      this.dispatch(type, detail)
      return
    }
    const listener = this.trapped.get(type)
    // console.log(this.constructor.name, "emit trapped", type, !!listener)
    if (listener) listener(this.event(type, detail))
  }

  event(type: EventType, detail?: UnknownObject): CustomEvent {
    const init: CustomEventInit<UnknownObject> | undefined = detail ? { detail } : undefined
    return new CustomEvent(type, init)
  }

  trap(type: EventType, listener?: EventListener): void {
    if (this.trapped.has(type)) return

    this.trapped.set(type, listener || null)
  }

  private trapped = new Map<EventType, EventListener | null>()
}
