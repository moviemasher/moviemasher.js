import type { UnknownRecord } from '../Types/Core.js'
import type { EventType } from '../Setup/Enums.js'

export class Emitter extends EventTarget {
  emit(type: EventType, detail?: UnknownRecord): void {
    this.dispatchEvent(this.event(type, detail))
  }

  private event(type: EventType, detail?: UnknownRecord): CustomEvent {
    const init: CustomEventInit<UnknownRecord> | undefined = detail ? { detail } : undefined
    return new CustomEvent(type, init)
  }
}
