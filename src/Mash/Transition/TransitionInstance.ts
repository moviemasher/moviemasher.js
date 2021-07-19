import { TrackType } from "../../Setup/Enums"
import { Is, Time } from "../../Utilities"
import { VisibleContext } from "../../Playing"
import { TransitionDefinition } from "./Transition"
import { InstanceClass } from "../Instance/Instance"
import { ModularMixin } from "../Mixin/Modular/ModularMixin"
import { Visible } from "../Mixin/Visible"
import { VisibleMixin } from "../Mixin/Visible/VisibleMixin"
import { ClipMixin } from "../Mixin/Clip/ClipMixin"
import { Size } from "../../declarations"

const TransitionWithModular = ModularMixin(InstanceClass)
const TransitionWithClip = ClipMixin(TransitionWithModular)
const TransitionWithVisible = VisibleMixin(TransitionWithClip)

class TransitionClass extends TransitionWithVisible {
  contextAtTimeToSize(_time : Time, _quantize: number, _dimensions : Size) : VisibleContext | undefined {
    return
  }

  declare definition : TransitionDefinition

  mergeClipsIntoContextAtTime(clips : Visible[], context : VisibleContext, time : Time, quantize : number, color? : string) : void {
    // console.log(this.constructor.name, "mergeClipsIntoContextAtTime", clips.length, time, quantize, color)
    if (!Is.aboveZero(clips.length)) return

    this.definition.drawVisibleFilters(clips, this, time, quantize, context, color)
  }

  trackType = TrackType.Video
}

export { TransitionClass }
