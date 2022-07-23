import { Size, sizeCover } from "../../Utility/Size"
import { isAboveZero } from "../../Utility/Is"
import { PreloadableDefinitionClass } from "../Preloadable/Preloadable"
import { UpdatableSizeDefinition, UpdatableSizeDefinitionClass, UpdatableSizeDefinitionObject } from "./UpdatableSize"

export function UpdatableSizeDefinitionMixin<T extends PreloadableDefinitionClass>(Base: T): UpdatableSizeDefinitionClass & T {
  return class extends Base implements UpdatableSizeDefinition {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      const { width, height } = object as UpdatableSizeDefinitionObject
      if (isAboveZero(width)) this.width = width
      if (isAboveZero(height)) this.height = height
    }


    width = 0
    height = 0

    coverSize(dimensions: Size): Size {
      const { width, height } = this
      return sizeCover({ width, height }, dimensions)
    }
  }
}
