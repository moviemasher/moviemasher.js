import type {ClientAudio, ClientAudioNode} from '../../Helpers/ClientMedia/ClientMedia.js'
import type {UnknownRecord} from '../../Types/Core.js'
import type {UpdatableDurationDefinition, UpdatableDurationDefinitionClass, UpdatableDurationDefinitionObject} from './UpdatableDuration.js'

import {assertClientAudio, assertClientVideo, isClientAudio} from '../../Helpers/ClientMedia/ClientMediaFunctions.js'
import {AudibleContextInstance} from '../../Context/AudibleContext.js'
import {ContentDefinitionClass} from '../../Media/Content/Content.js'
import {DataGroup, propertyInstance} from '../../Setup/Property.js'
import {DataType, Duration, TypeAudio, TypeVideo} from '../../Setup/Enums.js'
import {endpointFromUrl} from '../../Helpers/Endpoint/EndpointFunctions.js'
import {isAboveZero, isDefiniteError, isUndefined} from '../../Utility/Is.js'
import {isProbing} from '../../Plugin/Decode/Probe/Probing/ProbingFunctions.js'
import {requestAudioPromise} from '../../Helpers/Request/RequestFunctions.js'
import {timeFromSeconds} from '../../Helpers/Time/TimeUtilities.js'
import {TypeProbe} from '../../Plugin/Decode/Decoding/Decoding.js'

export function UpdatableDurationDefinitionMixin<T extends ContentDefinitionClass>(Base: T): UpdatableDurationDefinitionClass & T {
  return class extends Base implements UpdatableDurationDefinition {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      const { loop } = object as UpdatableDurationDefinitionObject
    
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
        name: 'gain', defaultValue: 1.0, type: DataType.Percent, 
        min: 0, max: 2.0, step: 0.01 
      }))
      this.properties.push(propertyInstance({ 
        name: 'speed', defaultValue: 1.0, type: DataType.Percent, 
        min: 0.1, max: 2.0, step: 0.1,
        group: DataGroup.Timing,
      }))
      this.properties.push(propertyInstance({ 
        name: 'startTrim', defaultValue: 0, type: DataType.Frame,
        step: 1, min: 0,
        group: DataGroup.Timing,
      }))
      this.properties.push(propertyInstance({ 
        name: 'endTrim', defaultValue: 0, type: DataType.Frame,
        step: 1, min: 0,
        group: DataGroup.Timing,
      }))
    }

    audibleSource(): ClientAudioNode | undefined {
      const { loadedAudio } = this
      if (loadedAudio) {
        // console.log(this.constructor.name, 'audibleSource loadedAudio')
        return AudibleContextInstance.createBufferSource(loadedAudio)
      }
    }

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
      if (!duration) return Duration.Unknown

      return timeFromSeconds(this.duration, quantize, 'floor').frame
    }

    loadedAudio?: ClientAudio
    
    get preloadAudioPromise(): Promise<void> {
      if (this.loadedAudio) return Promise.resolve()

      const transcoding = this.preferredTranscoding(TypeAudio, TypeVideo)
      const { request } = transcoding
      const { response } = request
      if (isClientAudio(response)) {
        this.loadedAudio = response
        return Promise.resolve()
      }
      return requestAudioPromise(request).then(orError => {
        if (isDefiniteError(orError)) return 

        const { data } = orError
        if (isClientAudio(data)) {
          this.loadedAudio = data
          return
        }
        assertClientVideo(data)

        const { src } = data
        const endpoint = endpointFromUrl(src)
        const request = { endpoint }
        return requestAudioPromise(request).then(orError => {
          if (isDefiniteError(orError)) return 

          const { data: audio } = orError
          assertClientAudio(audio)
          
          this.loadedAudio = audio
        })
      })
    }

    loop = false

    toJSON() : UnknownRecord {
      const { loop } = this
      return { ...super.toJSON(), loop }
    }
  }
}
