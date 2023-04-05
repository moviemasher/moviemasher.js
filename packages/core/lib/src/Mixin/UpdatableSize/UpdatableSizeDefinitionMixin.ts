import type {ContentDefinitionClass} from '../../Media/Content/Content.js'
import type {Size} from '../../Utility/Size.js'
import type {UpdatableSizeDefinition, UpdatableSizeDefinitionClass} from './UpdatableSize.js'

import { sizeAboveZero} from '../../Utility/Size.js'
import {isAboveZero} from '../../Utility/Is.js'
import {isProbing} from '../../Plugin/Decode/Probe/Probing/ProbingFunctions.js'
import {TypeProbe} from '../../Plugin/Decode/Decoding/Decoding.js'

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
        return transcoding.request.response
      })
      // console.log(this.constructor.name, 'previewSize transcoding', transcoding)
      if (!transcoding) return this.sourceSize

      const { response: clientMedia } = transcoding.request
      if (!sizeAboveZero(clientMedia)) return 

      const { width, height } = clientMedia
      if (!(isAboveZero(width) && isAboveZero(height))) return 

      return { width, height }
    }

    get sourceSize(): Size | undefined {
      const probing = this.decodings.find(decoding => decoding.type === TypeProbe)
      if (isProbing(probing)) {
        const { data } = probing
        const { width, height } = data
        if (!(isAboveZero(width) && isAboveZero(height))) return 

        return { width, height }
      }
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
