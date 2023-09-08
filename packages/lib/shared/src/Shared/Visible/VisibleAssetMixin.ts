import type { Asset, Constrained, Size, VisibleAsset } from '@moviemasher/runtime-shared'

import { PROBE } from '@moviemasher/runtime-shared'
import { isAboveZero } from '../SharedGuards.js'

export function VisibleAssetMixin
<T extends Constrained<Asset>>(Base: T): 
T & Constrained<VisibleAsset> {
  return class extends Base implements VisibleAsset {
    alpha?: boolean 
    
    get sourceSize(): Size | undefined {
      const decoding = this.decodings.find(decoding => decoding.type === PROBE)
      if (decoding) {
        const { data } = decoding
        if (data) {
          const { width, height } = data
          if (isAboveZero(width) && isAboveZero(height)) return { width, height }
        }
      } else {
        console.log(this.constructor.name, 'sourceSize no probing', decoding, this.decodings.length)
      }
      return undefined
    }
  }
}
