import { TrackType } from "../../Setup/Enums"
import { Is } from "../../Utilities/Is"
import { VisibleContext } from "../../Context"
import { Transition, TransitionDefinition, TransitionObject } from "./Transition"
import { InstanceBase } from "../../Base/Instance"
import { ModularMixin } from "../../Mixin/Modular/ModularMixin"
import { Visible } from "../../Mixin/Visible"
import { VisibleMixin } from "../../Mixin/Visible/VisibleMixin"
import { ClipMixin } from "../../Mixin/Clip/ClipMixin"
import { Any, Size } from "../../declarations"
import { Time } from "../../Helpers/Time"

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

  contextAtTimeToSize(_time : Time, _quantize: number, _dimensions : Size) : VisibleContext | undefined {
    return
  }

  declare definition : TransitionDefinition

  fromTrack = 0

  mergeClipsIntoContextAtTime(clips : Visible[], context : VisibleContext, time : Time, quantize : number, color? : string) : void {
    // console.log(this.constructor.name, "mergeClipsIntoContextAtTime", clips.length, time, quantize, color)
    if (!Is.aboveZero(clips.length)) return

    this.definition.drawVisibleFilters(clips, this, time, quantize, context, color)
  }

  toTrack = 1

  trackType = TrackType.Transition
}

export { TransitionClass }
