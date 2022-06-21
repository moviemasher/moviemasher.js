import { PreloadableClass } from "../Preloadable/Preloadable"
import { UpdatableDimensions, UpdatableDimensionsClass } from "./UpdatableDimensions"

export function UpdatableDimensionsMixin<T extends PreloadableClass>(Base: T): UpdatableDimensionsClass & T {
  return class extends Base implements UpdatableDimensions {}
}
