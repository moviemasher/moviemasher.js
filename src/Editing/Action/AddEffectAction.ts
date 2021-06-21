import { Effect } from "../../Mash/Effect/Effect"
import { Action, ActionObject } from "./Action"

interface AddEffectActionObject extends ActionObject {
  effect : Effect

  effects : Effect[]

  index : number
}
class AddEffectAction extends Action {
  constructor(object : AddEffectActionObject) {
    super(object)
    const { effect, effects, index } = object
    this.effect = effect
    this.effects = effects
    this.index = index
  }
  effect : Effect

  effects : Effect[]

  index : number

  redoAction() : void { this.effects.splice(this.index, 0, this.effect) }

  undoAction() : void { this.effects.splice(this.index, 1) }
}

export { AddEffectAction, AddEffectActionObject }
