import { InputCommand, Size } from "../../declarations"
import { Time } from "../../Utilities/Time"
import { ContextFactory, VisibleContext } from "../../Playing"
import { ThemeDefinition } from "./Theme"
import { InstanceBase } from "../../Base/Instance"
import { ModularMixin } from "../../Mixin/Modular/ModularMixin"
import { ClipMixin } from "../../Mixin/Clip/ClipMixin"
import { VisibleMixin } from "../../Mixin/Visible/VisibleMixin"
import { TransformableMixin } from "../../Mixin/Transformable/TransformableMixin"
import { LoadPromise } from "../.."


const ThemeWithModular = ModularMixin(InstanceBase)
const ThemeWithClip = ClipMixin(ThemeWithModular)
const ThemeWithVisible = VisibleMixin(ThemeWithClip)
const ThemeWithTransformable = TransformableMixin(ThemeWithVisible)
class ThemeClass extends ThemeWithTransformable {
  commandAtTimeToSize(mashTime: Time, quantize: number, dimensions: Size): InputCommand | undefined {
    const source = this.definition.inputSource
    const inputCommand: InputCommand = { sources: { source }, filters: []}
    return inputCommand
  }

  contextAtTimeToSize(mashTime : Time, quantize: number, dimensions : Size) : VisibleContext | undefined {
    const context = ContextFactory.toSize(dimensions)
    const clipTimeRange = this.timeRangeRelative(mashTime, quantize)
    return this.definition.drawFilters(this, clipTimeRange, context, dimensions)
  }

  clipUrls(quantize: number, start: Time): string[] {
    const urls = super.clipUrls(quantize, start) // urls from my effects, etc.
    urls.push(...this.modularUrls(quantize, start)) // urls from my modular properties
    return urls
  }

  declare definition: ThemeDefinition

  inputCommandAtTimeToSize(mashTime: Time, quantize: number, dimensions: Size): InputCommand | undefined {
    // console.log(this.constructor.name, "inputCommandAtTimeToSize", this.id)
    const inputCommand = super.inputCommandAtTimeToSize(mashTime, quantize, dimensions)
    if (!inputCommand) return inputCommand

    const clipTimeRange = this.timeRangeRelative(mashTime, quantize)

    inputCommand.filters = this.definition.inputFilters(this, clipTimeRange, dimensions)

    return inputCommand
  }

  loadClip(quantize: number, start: Time, end?: Time): LoadPromise | void {
    const promises: LoadPromise[] = []
    const transformablePromise = super.loadClip(quantize, start, end) // my effects, etc.
    if (transformablePromise) promises.push(transformablePromise)
    const modularPromise = this.loadModular(quantize, start, end) // my modular properties
    if (modularPromise) promises.push(modularPromise)
    switch (promises.length) {
      case 0: return
      case 1: return promises[0]
      default: return Promise.all(promises).then()
    }
  }
}

export { ThemeClass }
