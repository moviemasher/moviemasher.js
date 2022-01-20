import { Effect } from "../../../../Media/Effect/Effect"
import { Action, ActionOptions } from "./Action"

interface MoveEffectActionObject extends ActionOptions {
  effects : Effect[]
  redoEffects : Effect[]
  undoEffects : Effect[]
}
class MoveEffectAction extends Action {
  constructor(object : MoveEffectActionObject) {
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

export { MoveEffectAction, MoveEffectActionObject }
