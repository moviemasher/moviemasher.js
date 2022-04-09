import { EventType } from "../Setup/Enums"

class Emitter extends EventTarget {
  emit(type: EventType): void {
    this.dispatchEvent(new CustomEvent(type))
  }
}

export { Emitter }
