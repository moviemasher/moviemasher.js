import { FilesArgs, FilterChain, FilterChainArgs, GraphFile, LoadPromise, Size } from "../../declarations"
import { Time } from "../../Helpers/Time"
import { ContextFactory } from "../../Context/ContextFactory"
import { VisibleContext } from "../../Context/VisibleContext"
import { ThemeDefinition } from "./Theme"
import { InstanceBase } from "../../Base/Instance"
import { ModularMixin } from "../../Mixin/Modular/ModularMixin"
import { ClipMixin } from "../../Mixin/Clip/ClipMixin"
import { VisibleMixin } from "../../Mixin/Visible/VisibleMixin"
import { TransformableMixin } from "../../Mixin/Transformable/TransformableMixin"
import { Preloader } from "../../Preloader/Preloader"

const ThemeWithModular = ModularMixin(InstanceBase)
const ThemeWithClip = ClipMixin(ThemeWithModular)
const ThemeWithVisible = VisibleMixin(ThemeWithClip)
const ThemeWithTransformable = TransformableMixin(ThemeWithVisible)
class ThemeClass extends ThemeWithTransformable {
  contextAtTimeToSize(preloader: Preloader, mashTime : Time, quantize: number, dimensions : Size) : VisibleContext | undefined {
    const context = ContextFactory.toSize(dimensions)
    const range = this.timeRangeRelative(mashTime, quantize)

    const clipRange = this.timeRange(quantize)
    return this.definition.drawFilters(preloader, this, range, clipRange, context, dimensions, undefined)
  }

  // clipUrls(quantize: number, start: Time): string[] {
  //   const urls = super.clipUrls(quantize, start) // urls from my effects, etc.
  //   urls.push(...this.modularUrls(quantize, start)) // urls from my modular properties
  //   return urls
  // }

  declare definition: ThemeDefinition

  files(args: FilesArgs): GraphFile[] {
    const files = super.files(args)
    files.push(...this.filesModular(args))
    return files
  }

  filterChainBase(args: FilterChainArgs): FilterChain | undefined {
    const layer = super.filterChainBase(args)
    if (!layer) return

    this.modulateFilterChain(layer, args)
    return layer
  }

  // loadClip(quantize: number, start: Time, end?: Time): LoadPromise | void {
  //   const promises: LoadPromise[] = []
  //   const transformablePromise = super.loadClip(quantize, start, end) // my effects, etc.
  //   if (transformablePromise) promises.push(transformablePromise)
  //   const modularPromise = this.loadModular(quantize, start, end) // my modular properties
  //   if (modularPromise) promises.push(modularPromise)
  //   switch (promises.length) {
  //     case 0: return
  //     case 1: return promises[0]
  //     default: return Promise.all(promises).then()
  //   }
  // }
}

export { ThemeClass }
