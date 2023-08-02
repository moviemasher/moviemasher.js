import type {UnknownRecord} from '@moviemasher/runtime-shared'

import { propertyInstance } from "../../Setup/PropertyFunctions.js"
import { DurationUnknown } from '../../Setup/DurationConstants.js'
import { DataTypeBoolean, DataTypePercent } from "../../Setup/DataTypeConstants.js"
import {isAboveZero} from '../SharedGuards.js'
import { isUndefined } from "@moviemasher/runtime-shared"
import {isProbing} from '../../Plugin/Decode/Probe/Probing/ProbingFunctions.js'
import {timeFromSeconds} from '../../Helpers/Time/TimeUtilities.js'
import {TypeProbe} from '@moviemasher/runtime-shared'
import { Constrained } from '@moviemasher/runtime-shared'
import { Asset, AudibleAsset, AudibleAssetObject } from '@moviemasher/runtime-shared'
import { TypeAsset } from '@moviemasher/runtime-client'

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
        const probing = this.decodings.find(decoding => decoding.type === TypeProbe)
        if (isProbing(probing)) {
          const { data } = probing
          const { duration } = data
          if (isAboveZero(duration)) this._duration = duration
        }
      }
      return this._duration
    }
    set duration(value: number) { this._duration = value }

    frames(quantize: number): number {
      const { duration } = this
      // console.log(this.constructor.name, 'frames duration =', duration)
      if (!duration) return DurationUnknown

      return timeFromSeconds(this.duration, quantize, 'floor').frame
    }

    override initializeProperties(object: AudibleAssetObject): void {
      const { audio } = this
      if (audio) { 
        this.properties.push(propertyInstance({ 
          targetId: TypeAsset,
          name: 'loop', type: DataTypeBoolean,
        }))
        this.properties.push(propertyInstance({ 
          targetId: TypeAsset, name: 'muted', type: DataTypeBoolean, 
        }))
        this.properties.push(propertyInstance({ 
          targetId: TypeAsset, name: 'gain', type: DataTypePercent,
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



