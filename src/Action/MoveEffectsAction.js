import { Action } from "./Action"

class MoveEffectsAction extends Action {
  redoAction() {
    this.effects.splice(0, this.effects.length, ...this.redoEffects)
  }

  undoAction() {
    this.effects.splice(0, this.effects.length, ...this.undoEffects)
  }
}

export { MoveEffectsAction }