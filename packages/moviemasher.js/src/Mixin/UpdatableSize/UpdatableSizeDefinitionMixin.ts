import { Size, sizeAboveZero } from "../../Utility/Size"
import { UpdatableSizeDefinition, UpdatableSizeDefinitionClass } from "./UpdatableSize"
import { isAboveZero } from "../../Utility/Is"
import { ContentDefinitionClass } from "../../Media/Content/Content"

export function UpdatableSizeDefinitionMixin<T extends ContentDefinitionClass>(Base: T): UpdatableSizeDefinitionClass & T {
  return class extends Base implements UpdatableSizeDefinition {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      console.log(this.constructor.name, object)
      // const { sourceSize, previewSize } = object as UpdatableSizeDefinitionObject

      // if (sizeAboveZero(previewSize)) this.previewSize = previewSize
      // if (sizeAboveZero(sourceSize)) this.sourceSize = sourceSize
    }
    
    alpha?: boolean 
    

    get previewSize(): Size | undefined {
      const transcoding = this.transcodings.find(transcoding => {
        return transcoding.clientMedia
      })
      // console.log(this.constructor.name, "previewSize transcoding", transcoding)
      if (!transcoding) return this.sourceSize

      const { clientMedia } = transcoding
      if (!sizeAboveZero(clientMedia)) return 

      const { width, height } = clientMedia
      if (!(isAboveZero(width) && isAboveZero(height))) return 

      return { width, height }
    }

    get sourceSize(): Size | undefined {
      const decoding = this.decodings.find(object => object.info)
      if (!decoding) return

      const { width, height } = decoding.info!
      if (!(isAboveZero(width) && isAboveZero(height))) return 

      return { width, height }
    }
    

    // toJSON() : UnknownRecord {
    //   const json = super.toJSON()
    //   const { sourceSize, previewSize } = this
    //   if (sourceSize) json.sourceSize = this.sourceSize
    //   if (previewSize) json.previewSize = this.previewSize
    //   return json
    // }
  }
}
