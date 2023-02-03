import { Size, sizeAboveZero } from "../../Utility/Size"
import { PreloadableDefinitionClass } from "../Preloadable/Preloadable"
import { UpdatableSizeDefinition, UpdatableSizeDefinitionClass } from "./UpdatableSize"
import { isAboveZero } from "../../Utility/Is"

export function UpdatableSizeDefinitionMixin<T extends PreloadableDefinitionClass>(Base: T): UpdatableSizeDefinitionClass & T {
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
        return transcoding.loadedMedia
      })
      // console.log(this.constructor.name, "previewSize transcoding", transcoding)
      if (!transcoding) return this.sourceSize

      const { loadedMedia } = transcoding
      if (!sizeAboveZero(loadedMedia)) return 

      const { width, height } = loadedMedia
      if (!(isAboveZero(width) && isAboveZero(height))) return 

      return { width, height }
    }

    get sourceSize(): Size | undefined {
      const probing = this.probings.find(probing => {
        return probing.info
      })
      // console.log(this.constructor.name, "sourceSize probing", probing, this.probings)
      if (!probing) return

      const { width, height } = probing.info!
      if (!(isAboveZero(width) && isAboveZero(height))) return 

      return { width, height }
    }
    

    // toJSON() : UnknownObject {
    //   const json = super.toJSON()
    //   const { sourceSize, previewSize } = this
    //   if (sourceSize) json.sourceSize = this.sourceSize
    //   if (previewSize) json.previewSize = this.previewSize
    //   return json
    // }
  }
}
