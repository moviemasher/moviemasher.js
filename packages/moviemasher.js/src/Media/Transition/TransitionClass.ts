import { TrackType } from "../../Setup/Enums"
import { VisibleContext } from "../../Context"
import { Transition, TransitionDefinition, TransitionObject } from "./Transition"
import { InstanceBase } from "../../Base/Instance"
import { ModularMixin } from "../../Mixin/Modular/ModularMixin"
import { Visible } from "../../Mixin/Visible"
import { VisibleMixin } from "../../Mixin/Visible/VisibleMixin"
import { ClipMixin } from "../../Mixin/Clip/ClipMixin"
import { Any, FilterChain, FilterChainArgs } from "../../declarations"
import { Time } from "../../Helpers/Time"
import { Preloader } from "../../Preloader/Preloader"

const TransitionWithModular = ModularMixin(InstanceBase)
const TransitionWithClip = ClipMixin(TransitionWithModular)
const TransitionWithVisible = VisibleMixin(TransitionWithClip)

class TransitionClass extends TransitionWithVisible implements Transition {
  // constructor(...args: Any[]) {
  //   super(...args)
  //   const [object] = args
  //   const { fromTrack, toTrack } = <TransitionObject>object
  //   if (typeof fromTrack !== 'undefined') this.fromTrack = fromTrack
  //   if (typeof toTrack !== 'undefined') this.toTrack = toTrack
  // }

  contextAtTimeToSize() : VisibleContext | undefined { return }

  declare definition : TransitionDefinition

  transitionFilterChains(args: FilterChainArgs, fromClip?: Visible, toClip?: Visible, backcolor?: string): FilterChain {
    // console.log(this.constructor.name, "transitionFilterChains", fromClip?.label, toClip?.label)

    return this.definition.mergeFilterChain(this, args, fromClip, toClip, backcolor)
  }

  fromTrack = 0

  mergeClipsIntoContextAtTime(preloader: Preloader, context: VisibleContext, time: Time, quantize: number, fromClip?: Visible, toClip?: Visible, color?: string): void {
    // console.log(this.constructor.name, "mergeClipsIntoContextAtTime", fromClip?.label, toClip?.label, time)
    if (!(fromClip || toClip)) return

    this.definition.mergeClips(this, preloader, time, quantize, context, fromClip, toClip, color)
  }

  toTrack = 1

  trackType = TrackType.Transition
}

export { TransitionClass }
