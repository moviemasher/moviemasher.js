import type {Size} from '@moviemasher/runtime-shared'

import { sizeAboveZero } from "../../Utility/SizeFunctions.js"
import {isAboveZero} from '../SharedGuards.js'
import {isProbing} from '../../Plugin/Decode/Probe/Probing/ProbingFunctions.js'
import {TypeProbe} from '../../Plugin/Decode/Decoding/Decoding.js'
import { Constrained } from '@moviemasher/runtime-shared'
import { Asset, VisibleAsset } from '../Asset/AssetTypes.js'

export function VisibleAssetMixin
<T extends Constrained<Asset>>(Base: T): 
T & Constrained<VisibleAsset> {
  return class extends Base implements VisibleAsset {
    // constructor(...args: any[]) {
    //   const [object] = args
    //   super(object)
    //   // const { sourceSize, previewSize } = object as VisibleAssetObject

    //   // if (sizeAboveZero(previewSize)) this.previewSize = previewSize
    //   // if (sizeAboveZero(sourceSize)) this.sourceSize = sourceSize
    // }
    
    alpha?: boolean 
    
    get previewSize(): Size | undefined {
      const transcoding = this.transcodings.find(transcoding => {
        return transcoding.request.response
      })
      // console.log(this.constructor.name, 'previewSize transcoding', transcoding)
      if (!transcoding) return this.sourceSize

      const { response: response } = transcoding.request
      if (sizeAboveZero(response)) {
        const { width, height } = response
        if (isAboveZero(width) && isAboveZero(height)) return { width, height }
      }
      return undefined
    }

    get sourceSize(): Size | undefined {
      const probing = this.decodings.find(decoding => decoding.type === TypeProbe)
      if (isProbing(probing)) {
        const { data } = probing
        const { width, height } = data
        if (isAboveZero(width) && isAboveZero(height)) return { width, height }
      }
      return undefined
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

