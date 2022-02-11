import { TrackType } from "../../Setup/Enums"
import { Is } from "../../Utility/Is"
import { VisibleContext } from "../../Context"
import { Transition, TransitionDefinition, TransitionObject } from "./Transition"
import { InstanceBase } from "../../Base/Instance"
import { ModularMixin } from "../../Mixin/Modular/ModularMixin"
import { Visible } from "../../Mixin/Visible"
import { VisibleMixin } from "../../Mixin/Visible/VisibleMixin"
import { ClipMixin } from "../../Mixin/Clip/ClipMixin"
import { Any, Size } from "../../declarations"
import { Time } from "../../Helpers/Time"
import { Preloader } from "../../Preloader/Preloader"

const TransitionWithModular = ModularMixin(InstanceBase)
const TransitionWithClip = ClipMixin(TransitionWithModular)
const TransitionWithVisible = VisibleMixin(TransitionWithClip)

class TransitionClass extends TransitionWithVisible implements Transition {
  constructor(...args: Any[]) {
    super(...args)
    const [object] = args
    const { fromTrack, toTrack } = <TransitionObject>object
    if (typeof fromTrack !== 'undefined') this.fromTrack = fromTrack
    if (typeof toTrack !== 'undefined') this.toTrack = toTrack
  }

  contextAtTimeToSize() : VisibleContext | undefined { return }

  declare definition : TransitionDefinition

  fromTrack = 0

  mergeClipsIntoContextAtTime(preloader: Preloader, clips : Visible[], context : VisibleContext, time : Time, quantize : number, color? : string) : void {
    if (!Is.aboveZero(clips.length)) return

    this.definition.drawVisibleFilters(preloader, clips, this, time, quantize, context, color)
  }

  toTrack = 1

  trackType = TrackType.Transition
}

export { TransitionClass }
