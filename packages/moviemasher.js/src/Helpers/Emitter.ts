import { EventType } from "../Setup/Enums"

export class Emitter extends EventTarget {
  emit(type: EventType): void {
    this.dispatchEvent(new CustomEvent(type))
  }
}
