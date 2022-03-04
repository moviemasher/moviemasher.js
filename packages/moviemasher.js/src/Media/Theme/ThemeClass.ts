import { FilterChain, FilterChainArgs, Size } from "../../declarations"
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

    // const clipRange = this.timeRange(quantize)
    return this.definition.drawFilters(preloader, this, range, context, dimensions, undefined)
  }

  declare definition: ThemeDefinition

  // files(args: FilesArgs): GraphFiles {
  //   const files = super.files(args)
  //   files.push(...this.filesModular(args))
  //   return files
  // }

  filterChainBase(args: FilterChainArgs): FilterChain {
    const filterChain = super.filterChainBase(args)
    this.modulateFilterChain(filterChain, args)
    return filterChain
  }
}

export { ThemeClass }
