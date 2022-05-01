import { Theme, ThemeDefinition } from "./Theme"
import { InstanceBase } from "../../Base/Instance"
import { ModularMixin } from "../../Mixin/Modular/ModularMixin"
import { ClipMixin } from "../../Mixin/Clip/ClipMixin"
import { VisibleMixin } from "../../Mixin/Visible/VisibleMixin"
import { TransformableMixin } from "../../Mixin/Transformable/TransformableMixin"
import { FilterChain } from "../../Edited/Mash/FilterChain/FilterChain"

const ThemeWithModular = ModularMixin(InstanceBase)
const ThemeWithClip = ClipMixin(ThemeWithModular)
const ThemeWithVisible = VisibleMixin(ThemeWithClip)
const ThemeWithTransformable = TransformableMixin(ThemeWithVisible)
export class ThemeClass extends ThemeWithTransformable implements Theme {
  declare definition: ThemeDefinition

  override initializeFilterChain(filterChain: FilterChain): void {
    this.definition.populateFilterChain(filterChain, this)
  }
}
