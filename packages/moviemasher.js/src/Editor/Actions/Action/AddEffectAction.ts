import { Effect, Effects } from "../../../Media/Effect/Effect"
import { Action, ActionOptions } from "./Action"

export interface AddEffectActionObject extends ActionOptions {
  effect: Effect
  effects: Effects
  index : number
}

/**
 * @category Action
 */
export class AddEffectAction extends Action {
  constructor(object : AddEffectActionObject) {
    super(object)
    const { effect, effects, index } = object
    this.effect = effect
    this.effects = effects
    this.index = index
  }
  effect : Effect

  effects : Effects

  index : number

  redoAction() : void { this.effects.splice(this.index, 0, this.effect) }

  undoAction() : void { this.effects.splice(this.index, 1) }
}
