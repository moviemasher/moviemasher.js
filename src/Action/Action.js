import { Errors } from "../Setup"
import { Is } from "../Utilities"
import { EventType } from "../Setup"

class Action {
  constructor(object) {
    if (!Is.objectStrict(object)) throw Errors.argument + object

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
    this.events && this.events.emit(EventType.action, { action: this } )
  }

  redoAction() {} 

  undo() {
    this.undoAction()
    this.done = false
    this.events && this.events.emit(EventType.action, { action: this } )
  }

  undoAction() {}
}

export { Action }
