import type { Asset, AudibleAsset, AudibleAssetObject, Constrained, UnknownRecord } from '@moviemasher/runtime-shared'

import { ASSET, PROBE, isUndefined, isProbing } from '@moviemasher/runtime-shared'
import { timeFromSeconds } from '../../Helpers/Time/TimeUtilities.js'
import { DataTypeBoolean, DataTypePercent } from '../../Setup/DataTypeConstants.js'
import { DurationUnknown } from '../../Setup/DurationConstants.js'
import { propertyInstance } from '../../Setup/PropertyFunctions.js'
import { assertAboveZero, isAboveZero } from '../SharedGuards.js'

export function AudibleAssetMixin
<T extends Constrained<Asset>>(Base: T): 
T & Constrained<AudibleAsset> {
  return class extends Base implements AudibleAsset {
    private _audio?: boolean
    get audio(): boolean { 
      if (isUndefined(this._audio)) {
        this._audio = this.decodings.some(object => object.data?.audible)
      }
      return Boolean(this._audio)
    }
    set audio(value: boolean) { this._audio = value }


    audioUrl = ''

    private _duration = 0
    get duration(): number {
      if (!isAboveZero(this._duration)) {
        const probing = this.decodings.find(decoding => decoding.type === PROBE)
        // console.debug(this.constructor.name, 'duration', probing, probing?.data?.duration)
        if (isProbing(probing)) {
          const { data } = probing
          const { duration } = data
          if (isAboveZero(duration)) this._duration = duration
        
        } else {
          // console.warn(this.constructor.name, 'no duration no probing', this.decodings)
        }
      }
      return this._duration
    }
    set duration(value: number) { this._duration = value }

    frames(quantize: number): number {
      const { duration } = this
      if (!duration) return DurationUnknown

      assertAboveZero(quantize)
      const { frame } = timeFromSeconds(duration, quantize, 'floor')
      // console.log(this.constructor.name, 'frames', frame, { duration, quantize })

      return frame
    }

    override initializeProperties(object: AudibleAssetObject): void {
      const { audio } = this
      if (audio) { 
        this.properties.push(propertyInstance({ 
          targetId: ASSET,
          name: 'loop', type: DataTypeBoolean,
        }))
        this.properties.push(propertyInstance({ 
          targetId: ASSET, name: 'muted', type: DataTypeBoolean, 
        }))
        this.properties.push(propertyInstance({ 
          targetId: ASSET, name: 'gain', type: DataTypePercent,
          defaultValue: 1.0, min: 0, max: 2.0, step: 0.01 
        }))
      }
      super.initializeProperties(object)
    }
    
    loop = false

    toJSON() : UnknownRecord {
      const { loop } = this
      return { ...super.toJSON(), loop }
    }
  }
}



