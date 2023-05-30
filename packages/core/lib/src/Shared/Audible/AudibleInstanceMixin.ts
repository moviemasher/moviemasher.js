import type { CommandFilter, CommandFilters, GraphFile, PreloadArgs, GraphFiles, VisibleCommandFilterArgs } from '../../Base/Code.js'
import type { Filter } from '../../Plugin/Filter/Filter.js'
import type { IntrinsicOptions } from '../Mash/Clip/Clip.js'
import type { Numbers, Scalar, UnknownRecord, ValueRecord, Value } from '@moviemasher/runtime-shared'
import type { Property } from '@moviemasher/runtime-shared'
import type { Time } from '@moviemasher/runtime-shared'
import type { Tweening } from '../../Helpers/TweenFunctions.js'
import type { Constrained } from '../../Base/Constrained.js'
import type { AudibleInstance, AudibleInstanceObject, Instance } from '../Instance/Instance.js'

import { arrayOfNumbers } from '../../Utility/ArrayFunctions.js'
import { assertAboveZero, assertPopulatedString, isAboveZero, isPositive, isString } from '../SharedGuards.js'
import { CommaChar } from '../../Setup/Constants.js'
import { commandFilesInput } from '../../Utility/CommandFilesFunctions.js'
import { filterFromId } from '../../Plugin/Filter/FilterFactory.js'
import { idGenerate } from '../../Utility/Id.js'
import { timeFromArgs, timeFromSeconds } from '../../Helpers/Time/TimeUtilities.js'
import { TypeAudio } from "@moviemasher/runtime-shared"
import { AudibleAsset } from '../Asset/Asset.js'

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
      const { startTrim, endTrim, asset:definition } = this
      const { duration } = definition
      assertAboveZero(duration)

      const durationTime = timeFromSeconds(duration, superTime.fps)
      const durationFrames = durationTime.frame - (startTrim + endTrim)
      const offset = superTime.frame % durationFrames
      return superTime.withFrame(offset + startTrim).divide(this.speed) 
    }

    frames(quantize: number): number {
      const { asset: definition, startTrim, endTrim } = this
      const frames = definition.frames(quantize)
      return frames - (startTrim + endTrim)
    }

    gain = 1.0

    gainPairs: Numbers[] = []

    graphFiles(args: PreloadArgs): GraphFiles {
      const { audible } = args
      if (!audible) return []
      if (!(this.mutable() && !this.muted)) return []

      const { asset: definition } = this
      const graphFile: GraphFile = {
        type: TypeAudio, file: '', definition, input: true
      }
      return [graphFile]
    }
    
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
    
    initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container = false): CommandFilters {
      const commandFilters: CommandFilters = []
      const { 
        time, quantize, commandFiles, clipTime, videoRate, duration 
      } = args

      const { id } = this
      // console.log(this.constructor.name, 'initialCommandFilters calling commandFilesInput', id)
      let filterInput = commandFilesInput(commandFiles, id, true)
      assertPopulatedString(filterInput, 'filterInput')
    
      const trimFilter = 'trim' 
      const trimId = idGenerate(trimFilter)
      const trimOptions: ValueRecord = {}
      if (duration) trimOptions.duration = duration
      const { frame } = this.assetTime(time)
      if (frame) trimOptions.start = timeFromArgs(frame, quantize).seconds

      const commandFilter: CommandFilter = { 
        inputs: [filterInput], 
        ffmpegFilter: trimFilter, 
        options: trimOptions, 
        outputs: [trimId]
      }
      commandFilters.push(commandFilter)
      filterInput = trimId
      if (duration) {
        const fpsFilter = 'fps'
        const fpsId = idGenerate(fpsFilter)
        const fpsCommandFilter: CommandFilter = { 
          ffmpegFilter: fpsFilter, 
          options: { fps: videoRate }, 
          inputs: [filterInput], outputs: [fpsId]
        }
        commandFilters.push(fpsCommandFilter)
        filterInput = fpsId
      } 
  
      const setptsFilter = 'setpts'
      const setptsId = idGenerate(setptsFilter)
      const setptsCommandFilter: CommandFilter = { 
        ffmpegFilter: setptsFilter, 
        options: { expr: 'PTS-STARTPTS' }, 
        inputs: [filterInput], outputs: [setptsId]
      }
      commandFilters.push(setptsCommandFilter) 
    
      return commandFilters
    }

    intrinsicsKnown(options: IntrinsicOptions): boolean {
      const superKnown = super.intrinsicsKnown(options)
      if (!superKnown) return false

      const { duration } = options
      if (!duration) return true
      
      return isAboveZero(this.asset.duration)
    }


    // instanceCachePromise(args: PreloadArgs): Promise<void> {
    //   console.log(this.constructor.name, 'loadPromise', args)
    //   const promises: Promise<void>[] = []
    //   const { asset } = this
    //   const { audio } = asset
    //   const { visible, audible, time, clipTime } = args


    //   const assetTime = this.definitionTime(time, clipTime)
    //   const assetArgs: AssetCacheArgs = { ...args, assetTime }
    //   return asset.assetCachePromise(assetArgs)
    //   // if (audio && audible) {
    //   //   promises.push(asset.preloadAudiblePromise(assetArgs))
    //   // }
      
    //   // if (visible) {
    //   //   promises.push(asset.preloadVisiblePromise(assetArgs))
    //   // } 
    //   // return Promise.all(promises).then(EmptyFunction)
    // }

    mutable() { return this.asset.audio }
  
    // selectedProperty(property: Property): boolean {
    //   const { name } = property
    //   switch(name) {
    //     case 'gain': return this.mutable() && !this.muted 
    //   }
    //   return super.selectedProperty(property)
    // }

    setValue(value: Scalar, name: string, property?: Property | undefined): void {
      super.setValue(value, name, property)
      if (property) return

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

    toJSON(): UnknownRecord {
      const json = super.toJSON()
      const { speed, gain } = this
      if (speed !== 1.0) json.speed = speed
      if (gain !== 1.0) json.gain = gain
      return json
    }

    declare startTrim: number
    declare endTrim: number

    private _trimFilter?: Filter
    get trimFilter() { return this._trimFilter ||= filterFromId('trim')}
    
  }
}



