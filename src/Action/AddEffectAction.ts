import { Action } from "./Action"
import { Effect } from "../Transform"

class AddEffectAction extends Action {
  effect : Effect

  effects : Effect[]

  index : number

  redoAction() { this.effects.splice(this.index, 0, this.effect) }

  undoAction() { this.effects.splice(this.index, 1) }
}

export { AddEffectAction }
