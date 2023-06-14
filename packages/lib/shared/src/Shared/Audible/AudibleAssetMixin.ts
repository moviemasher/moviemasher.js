import type {UnknownRecord} from '@moviemasher/runtime-shared'

import { DataGroupTiming } from "../../Setup/DataGroupConstants.js"
import { propertyInstance } from "../../Setup/PropertyFunctions.js"
import { DurationUnknown } from "../../Setup/EnumConstantsAndFunctions.js"
import { DataTypeFrame, DataTypePercent } from "../../Setup/DataTypeConstants.js"
import {isAboveZero} from '../SharedGuards.js'
import { isUndefined } from "@moviemasher/runtime-shared"
import {isProbing} from '../../Plugin/Decode/Probe/Probing/ProbingFunctions.js'
import {timeFromSeconds} from '../../Helpers/Time/TimeUtilities.js'
import {TypeProbe} from '@moviemasher/runtime-shared'
import { Constrained } from '@moviemasher/runtime-shared'
import { Asset, AudibleAsset, AudibleAssetObject } from '@moviemasher/runtime-shared'

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

    initializeProperties(object: AudibleAssetObject): void {
      const { loop } = object  
     
      // if (audio || audioUrl ) {//|| loadedAudio
      //   this.audio = true
      //   if (isPopulatedString(audioUrl)) this.audioUrl = audioUrl
      //   if (waveform) this.waveform = waveform
      // }
      // // console.log(this.constructor.name, 'audio', audio, this.audio, this.audioUrl)
      // if (isAboveZero(duration)) this.duration = duration
      // console.log(this.constructor.name, 'duration', duration, this.duration)
      if (loop) {
        this.loop = loop
        this.properties.push(propertyInstance({ name: 'loops', defaultValue: 1 }))
      }
      this.properties.push(propertyInstance({ 
        name: 'gain', defaultValue: 1.0, type: DataTypePercent, 
        min: 0, max: 2.0, step: 0.01 
      }))
      this.properties.push(propertyInstance({ 
        name: 'speed', defaultValue: 1.0, type: DataTypePercent, 
        min: 0.1, max: 2.0, step: 0.1,
        group: DataGroupTiming,
      }))
      this.properties.push(propertyInstance({ 
        name: 'startTrim', defaultValue: 0, type: DataTypeFrame,
        step: 1, min: 0,
        group: DataGroupTiming,
      }))
      this.properties.push(propertyInstance({ 
        name: 'endTrim', defaultValue: 0, type: DataTypeFrame,
        step: 1, min: 0,
        group: DataGroupTiming,
      }))
      super.initializeProperties(object)
    }
    
    loop = false

    toJSON() : UnknownRecord {
      const { loop } = this
      return { ...super.toJSON(), loop }
    }
  }
}



