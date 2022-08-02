import { Size, sizeAboveZero, sizeCover } from "../../Utility/Size"
import { isAboveZero } from "../../Utility/Is"
import { PreloadableDefinitionClass } from "../Preloadable/Preloadable"
import { UpdatableSizeDefinition, UpdatableSizeDefinitionClass, UpdatableSizeDefinitionObject } from "./UpdatableSize"
import { UnknownObject } from "../../declarations"

export function UpdatableSizeDefinitionMixin<T extends PreloadableDefinitionClass>(Base: T): UpdatableSizeDefinitionClass & T {
  return class extends Base implements UpdatableSizeDefinition {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      const { sourceSize, previewSize } = object as UpdatableSizeDefinitionObject

      if (sizeAboveZero(previewSize)) this.previewSize = previewSize
      if (sizeAboveZero(sourceSize)) this.sourceSize = sourceSize
    }

    previewSize?: Size 

    sourceSize?: Size 

    toJSON() : UnknownObject {
      const json = super.toJSON()
      const { sourceSize, previewSize } = this
      if (sourceSize) json.sourceSize = this.sourceSize
      if (previewSize) json.previewSize = this.previewSize
      return json
    }
  }
}
