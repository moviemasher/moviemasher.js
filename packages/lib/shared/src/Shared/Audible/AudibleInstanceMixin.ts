import type { AudibleAsset, AudibleInstance, AudibleInstanceObject, Constrained, Instance, IntrinsicOptions, Numbers, Property, Scalar, Time, UnknownRecord, Value } from '@moviemasher/runtime-shared'

import { TypeContent, isString } from '@moviemasher/runtime-shared'
import { timeFromSeconds } from '../../Helpers/Time/TimeUtilities.js'
import { CommaChar, DOT } from '../../Setup/Constants.js'
import { DataTypeBoolean, DataTypeFrame, DataTypeNumber, DataTypePercent } from '../../Setup/DataTypeConstants.js'
import { propertyInstance } from '../../Setup/PropertyFunctions.js'
import { arrayOfNumbers } from '../../Utility/ArrayFunctions.js'
import { assertAboveZero, isAboveZero, isPositive, isPropertyId } from '../SharedGuards.js'

export const gainFromString = (gain: Value): number | Numbers[] => {
  if (isString(gain)) {
    if (gain.includes(CommaChar)) {
      const floats = gain.split(CommaChar).map(string => parseFloat(string))
      const z = floats.length / 2
      return arrayOfNumbers(z).map(i => [floats[i * 2], floats[i * 2 + 1]])
    }  
    const parsed = Number(gain)
    if (isPositive(parsed)) return parsed
  } else if (isPositive(gain)) return gain
  return 1.0
}

export function AudibleInstanceMixin
<T extends Constrained<Instance>>(Base: T): 
T & Constrained<AudibleInstance> {
  return class extends Base implements AudibleInstance {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      const { gain } = object as AudibleInstanceObject

      if (typeof gain != 'undefined') {
        const parsed = gainFromString(gain)
        if (isPositive(parsed)) this.gain = parsed
        else {
          this.gain = -1
          this.gainPairs = parsed
        }
      }
    }
    
    declare asset: AudibleAsset

    assetTime(mashTime: Time): Time {
      const superTime = super.assetTime(mashTime)
      const { startTrim, endTrim, asset:definition, speed } = this
      const { duration } = definition
      assertAboveZero(duration)

      const durationTime = timeFromSeconds(duration, superTime.fps)
      const durationFrames = durationTime.frame - (startTrim + endTrim)
      const offset = superTime.frame % durationFrames
      return superTime.withFrame(offset + startTrim).divide(speed) 
    }

    declare endTrim: number

    frames(quantize: number): number {
      const { asset: definition, startTrim, endTrim } = this
      const frames = definition.frames(quantize)
      return frames - (startTrim + endTrim)
    }

    declare gain: number

    gainPairs: Numbers[] = []

    // graphFiles(args: PreloadArgs): GraphFiles {
    //   const { audible } = args
    //   if (!audible) return []
    //   if (!(this.mutable() && !this.muted)) return []

    //   const { asset: definition } = this
    //   const graphFile: GraphFile = {
    //     type: AUDIO, file: '', definition, input: true
    //   }
    //   return [graphFile]
    // }
    
    hasGain(): boolean {
      if (this.gain === 0) return true
      if (isPositive(this.gain)) return false

      if (this.gainPairs.length !== 2) return false

      const [first, second] = this.gainPairs
      if (first.length !== 2) return false
      if (second.length !== 2) return false
      if (Math.max(...first)) return false
      const [time, value] = second
      return time === 1 && value === 0
    }

    hasIntrinsicTiming = true
    

    override initializeProperties(object: unknown): void {
      const { asset } = this
      if (asset.audio) {
        this.properties.push(propertyInstance({ 
          targetId: TypeContent, name: 'muted', type: DataTypeBoolean, 
        }))
        if (asset.loop) {
          this.properties.push(propertyInstance({ 
            targetId: TypeContent, name: 'loops', type: DataTypeNumber, 
            defaultValue: 1, 
          }))
        }
        this.properties.push(propertyInstance({ 
          targetId: TypeContent, name: 'gain', type: DataTypePercent, 
          defaultValue: 1.0, min: 0, max: 2.0, step: 0.01 
        }))
      }
      this.properties.push(propertyInstance({ 
        targetId: TypeContent, name: 'speed', type: DataTypePercent, 
        defaultValue: 1.0, min: 0.1, max: 2.0, step: 0.1, 
      }))
      this.properties.push(propertyInstance({ 
        targetId: TypeContent, name: 'startTrim', type: DataTypeFrame,
        defaultValue: 0, step: 1, min: 0, 
      }))
      this.properties.push(propertyInstance({ 
        targetId: TypeContent, name: 'endTrim', type: DataTypeFrame,
        defaultValue: 0, step: 1, min: 0, 
      }))
      super.initializeProperties(object)
    }

    intrinsicsKnown(options: IntrinsicOptions): boolean {
      const superKnown = super.intrinsicsKnown(options)
      if (!superKnown) return false

      const { duration } = options
      if (!duration) return true
      
      return isAboveZero(this.asset.duration)
    }

    mutable() { return this.asset.audio }

    override setValue(id: string, value?: Scalar, property?: Property | undefined): void {
      super.setValue(id, value, property)
      if (property) return

      const name = isPropertyId(id) ? id.split(DOT).pop() : id

      switch (name) {
        case 'startTrim':
        case 'endTrim':
        case 'speed':
          // console.log(this.constructor.name, 'setValue', name, value)
            
          this.clip.resetTiming(this)
          break
      
      }
    }

    declare speed: number

    declare startTrim: number

    toJSON(): UnknownRecord {
      const json = super.toJSON()
      const { speed, gain } = this
      if (speed !== 1.0) json.speed = speed
      if (gain !== 1.0) json.gain = gain
      return json
    }
  }
}
