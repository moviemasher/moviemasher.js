import { Effect } from "../../Mash/Effect/Effect"
import { Action, ActionObject } from "./Action"

interface MoveEffectsActionObject extends ActionObject {
  effects : Effect[]
  redoEffects : Effect[]
  undoEffects : Effect[]
}
class MoveEffectsAction extends Action {
  constructor(object : MoveEffectsActionObject) {
    super(object)
    const { effects, redoEffects, undoEffects } = object
    this.effects = effects
    this.redoEffects = redoEffects
    this.undoEffects = undoEffects
  }

  effects : Effect[]

  redoEffects : Effect[]

  undoEffects : Effect[]

  redoAction() : void {
    this.effects.splice(0, this.effects.length, ...this.redoEffects)
  }

  undoAction() : void {
    this.effects.splice(0, this.effects.length, ...this.undoEffects)
  }
}

export { MoveEffectsAction }
