import { Effects } from "../../../Media/Effect/Effect"
import { Action, ActionOptions } from "./Action"

export interface MoveEffectActionObject extends ActionOptions {
  effects : Effects
  redoEffects : Effects
  undoEffects: Effects
}

/**
 * @category Action
 */
export class MoveEffectAction extends Action {
  constructor(object : MoveEffectActionObject) {
    super(object)
    const { effects, redoEffects, undoEffects } = object
    this.effects = effects
    this.redoEffects = redoEffects
    this.undoEffects = undoEffects
  }

  effects : Effects

  redoEffects : Effects


  redoAction(): void {
    this.effects.splice(0, this.effects.length, ...this.redoEffects)
  }

  undoAction() : void {
    this.effects.splice(0, this.effects.length, ...this.undoEffects)
  }

  undoEffects : Effects
}
