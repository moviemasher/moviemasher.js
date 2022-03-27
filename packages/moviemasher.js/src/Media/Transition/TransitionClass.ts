import { TrackType } from "../../Setup/Enums"
import { Transition, TransitionDefinition } from "./Transition"
import { InstanceBase } from "../../Base/Instance"
import { ModularMixin } from "../../Mixin/Modular/ModularMixin"
import { VisibleMixin } from "../../Mixin/Visible/VisibleMixin"
import { ClipMixin } from "../../Mixin/Clip/ClipMixin"

const TransitionWithModular = ModularMixin(InstanceBase)
const TransitionWithClip = ClipMixin(TransitionWithModular)
const TransitionWithVisible = VisibleMixin(TransitionWithClip)

class TransitionClass extends TransitionWithVisible implements Transition {
  declare definition: TransitionDefinition

  trackType = TrackType.Transition
}

export { TransitionClass }
