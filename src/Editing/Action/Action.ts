import { Mash } from "../../Mash"
import { Actions } from "../Actions"
import { Clip } from "../../Mash/Mixin/Clip/Clip"
import { Errors } from "../../Setup/Errors"
import { Effect } from "../../Mash/Effect/Effect"

interface ActionObject {
  actions : Actions
  mash : Mash
  redoSelectedClips : Clip[]
  redoSelectedEffects : Effect[]
  type : string
  undoSelectedClips : Clip[]
  undoSelectedEffects : Effect[]
  redoAction() : void
  undoAction() : void
}

class Action {
  constructor(object : ActionObject) {
    const {
      actions,
      mash,
      redoSelectedClips,
      redoSelectedEffects,
      type,
      undoSelectedClips,
      undoSelectedEffects,
    } = object
    this.actions = actions
    this.type = type
    this.mash = mash
    this.undoSelectedClips = undoSelectedClips
    this.redoSelectedClips = redoSelectedClips
    this.undoSelectedEffects = undoSelectedEffects
    this.redoSelectedEffects = redoSelectedEffects
  }

  actions : Actions

  mash : Mash

  undoSelectedClips : Clip[]

  redoSelectedClips : Clip[]

  undoSelectedEffects : Effect[]

  redoSelectedEffects : Effect[]

  done =  false

  get selectedClips() : Clip[] {
    if (this.done) return this.redoSelectedClips

    return this.undoSelectedClips
  }

  get selectedEffects() : Effect[] {
    if (this.done) return this.redoSelectedEffects

    return this.undoSelectedEffects
  }

  redo() : void {
    this.redoAction()
    this.done = true
  }

  redoAction() : void {
    throw Errors.internal + 'redoAction'
  }

  type : string

  undo() : void {
    this.undoAction()
    this.done = false
  }

  undoAction() : void {
    throw Errors.internal + 'undoAction'
  }
}

export { Action, ActionObject }
