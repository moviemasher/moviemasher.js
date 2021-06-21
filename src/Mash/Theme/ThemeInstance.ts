import { Size } from "../../Setup/declarations"
import { Time } from "../../Utilities/Time"
import { ContextFactory, VisibleContext } from "../../Playing"
import { ThemeDefinition } from "./Theme"
import { InstanceClass } from "../Instance/Instance"
import { ModularMixin } from "../Mixin/Modular/ModularMixin"
import { ClipMixin } from "../Mixin/Clip/ClipMixin"
import { VisibleMixin } from "../Mixin/Visible/VisibleMixin"
import { TransformableMixin } from "../Mixin/Transformable/TransformableMixin"


const ThemeWithModular = ModularMixin(InstanceClass)
const ThemeWithClip = ClipMixin(ThemeWithModular)
const ThemeWithVisible = VisibleMixin(ThemeWithClip)
const ThemeWithTransformable = TransformableMixin(ThemeWithVisible)
class ThemeClass extends ThemeWithTransformable {
  contextAtTimeToSize(mashTime : Time, quantize: number, dimensions : Size) : VisibleContext | undefined {
    const context = ContextFactory.toSize(dimensions)
    const clipTimeRange = this.timeRangeRelative(mashTime, quantize)
    return this.definition.drawFilters(this, clipTimeRange, context, dimensions)
  }
  definition! : ThemeDefinition
}


export { ThemeClass }
