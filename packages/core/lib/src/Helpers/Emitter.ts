import { UnknownRecord } from "../Types/Core"
import { EventType } from "../Setup/Enums"


export class Emitter extends EventTarget {
  dispatch(type: EventType, detail?: UnknownRecord): void {
    // console.log(this.constructor.name, "dispatch", type, detail)
    this.dispatchEvent(this.event(type, detail))
  }

  emit(type: EventType, detail?: UnknownRecord): void {
    if (!this.trapped.has(type)) {
      this.dispatch(type, detail)
      return
    }
    const listener = this.trapped.get(type)
    // console.log(this.constructor.name, "emit trapped", type, !!listener)
    if (listener) listener(this.event(type, detail))
  }
  
  enqueue(type: EventType, detail: UnknownRecord = {}): void {
    
  }

  event(type: EventType, detail?: UnknownRecord): CustomEvent {
    const init: CustomEventInit<UnknownRecord> | undefined = detail ? { detail } : undefined
    return new CustomEvent(type, init)
  }

  private queue = new Map<EventType, UnknownRecord>()

  trap(type: EventType, listener?: EventListener): void {
    if (this.trapped.has(type)) return

    this.trapped.set(type, listener || null)
  }

  private trapped = new Map<EventType, EventListener | null>()
}
