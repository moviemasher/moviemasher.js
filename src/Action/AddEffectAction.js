
import { Action } from "./Action"
import { Utilities } from "../Utilities"

class AddEffectAction extends Action {
  redoAction() { this.effects.splice(this.index, 0, this.effect) }
  
  undoAction() { Utilities.deleteFromArray(this.effects, this.effect) }
}

export { AddEffectAction }