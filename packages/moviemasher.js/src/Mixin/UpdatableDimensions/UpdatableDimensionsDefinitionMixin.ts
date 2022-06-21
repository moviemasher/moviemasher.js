import { PreloadableDefinitionClass } from "../Preloadable/Preloadable"
import { UpdatableDimensionsDefinition, UpdatableDimensionsDefinitionClass } from "./UpdatableDimensions"

export function UpdatableDimensionsDefinitionMixin<T extends PreloadableDefinitionClass>(Base: T): UpdatableDimensionsDefinitionClass & T {
  return class extends Base implements UpdatableDimensionsDefinition {
    width = 0
    height = 0
  }
}
