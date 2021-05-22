import { Clip } from "../Clip"
import { Mash } from "../Mash"
import { Errors, EventType } from "../Setup"
import { Effect } from "../Transform"
import { Is } from "../Utilities"

class Action {
  mash : Mash

  undoSelectedClips : Clip[]

  redoSelectedClips : Clip[]

  undoSelectedEffects : Effect[]

  redoSelectedEffects : Effect[]

  done : boolean

  constructor(object) {
    if (!Is.object(object)) throw Errors.argument

    const keys = Object.keys(object)
    const entries = keys.map(key => [key, { value: object[key] }])
    Object.defineProperties(this, Object.fromEntries(entries))
  }

  get events() { return this.mash.events }

  get selectedClips() {
    if (this.done) return this.redoSelectedClips

    return this.undoSelectedClips
  }

  get selectedEffects() {
    if (this.done) return this.redoSelectedEffects

    return this.undoSelectedEffects
  }

  redo() {
    this.redoAction()
    this.done = true
    if (!this.events) return

    this.events.emit(EventType.action, { action: this })
  }

  redoAction() {}

  undo() {
    this.undoAction()
    this.done = false
    if (!this.events) return
    this.events.emit(EventType.action, { action: this })
  }

  undoAction() {}
}

export { Action }
