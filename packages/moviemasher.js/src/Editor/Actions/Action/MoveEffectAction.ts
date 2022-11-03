import { Effects } from "../../../Media/Effect/Effect"
import { Action, ActionOptions, ActionObject } from "./Action"

export interface MoveEffectActionObject extends ActionObject {
  effects : Effects
  redoEffects : Effects
  undoEffects: Effects
}

export interface MoveEffectOptions extends Partial<MoveEffectActionObject> {}

/**
 * @category Action
 */
export class MoveEffectAction extends Action {
  constructor(object: MoveEffectActionObject) {
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
