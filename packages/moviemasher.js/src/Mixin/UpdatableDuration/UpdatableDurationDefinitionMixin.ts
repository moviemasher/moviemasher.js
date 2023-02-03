import { AudibleContextInstance } from "../../Context/AudibleContext"
import { AudibleSource, LoadedAudio, UnknownObject } from "../../declarations"
import { timeFromSeconds } from "../../Helpers/Time/TimeUtilities"
import { assertLoadedVideo, isLoadedAudio, Loader } from "../../Loader/Loader"
import { DataType, DefinitionType, Duration } from "../../Setup/Enums"
import { DataGroup, propertyInstance } from "../../Setup/Property"
import { isAboveZero, isPopulatedString, isUndefined } from "../../Utility/Is"
import { PreloadableDefinitionClass } from "../Preloadable/Preloadable"
import { UpdatableDurationDefinition, UpdatableDurationDefinitionClass, UpdatableDurationDefinitionObject } from "./UpdatableDuration"
import { urlPrependProtocol } from "../../Utility/Url"
import { Transcoding } from "../../Media/Transcoding/Transcoding"
import { endpointFromUrl } from "../../Utility/Endpoint"
import { requestAudioPromise } from "../../Utility/Request"

export function UpdatableDurationDefinitionMixin<T extends PreloadableDefinitionClass>(Base: T): UpdatableDurationDefinitionClass & T {
  return class extends Base implements UpdatableDurationDefinition {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      const { 
        audioUrl, audio, loop, duration, waveform 
      } = object as UpdatableDurationDefinitionObject
    
      if (audio || audioUrl ) {//|| loadedAudio
        this.audio = true
        if (isPopulatedString(audioUrl)) this.audioUrl = audioUrl
        if (waveform) this.waveform = waveform
      }
      // console.log(this.constructor.name, "audio", audio, this.audio, this.audioUrl)
      if (isAboveZero(duration)) this.duration = duration
      // console.log(this.constructor.name, "duration", duration, this.duration)
      if (loop) {
        this.loop = loop
        this.properties.push(propertyInstance({ name: 'loops', defaultValue: 1 }))
      }
      this.properties.push(propertyInstance({ 
        name: "gain", defaultValue: 1.0, type: DataType.Percent, 
        min: 0, max: 2.0, step: 0.01 
      }))
      this.properties.push(propertyInstance({ 
        name: "speed", defaultValue: 1.0, type: DataType.Percent, 
        min: 0.1, max: 2.0, step: 0.1,
        group: DataGroup.Timing,
      }))
      this.properties.push(propertyInstance({ 
        name: "startTrim", defaultValue: 0, type: DataType.Frame,
        step: 1, min: 0,
        group: DataGroup.Timing,
      }))
      this.properties.push(propertyInstance({ 
        name: "endTrim", defaultValue: 0, type: DataType.Frame,
        step: 1, min: 0,
        group: DataGroup.Timing,
      }))
    }

    audibleSource(): AudibleSource | undefined {
      const { loadedAudio } = this
      if (loadedAudio) {
        // console.log(this.constructor.name, "audibleSource loadedAudio")
        return AudibleContextInstance.createBufferSource(loadedAudio)
      }
    }

    private _audio?: boolean
    get audio(): boolean { 
      if (isUndefined(this._audio)) {
        this._audio = this.probings.some(object => object.info?.audible)
      }
      return Boolean(this._audio)
    }
    set audio(value: boolean) { this._audio = value }


    audioUrl = ''

    private _duration = 0
    get duration(): number {
      if (!isAboveZero(this._duration)) {
        for (const probing of this.probings) {
          if (probing?.info?.duration) {
            this._duration = probing.info.duration
            break
          }
        }
      }
      return this._duration
    }
    set duration(value: number) { this._duration = value }

    frames(quantize: number): number {
      const { duration } = this
      // console.log(this.constructor.name, "frames duration =", duration)
      if (!duration) return Duration.Unknown

      return timeFromSeconds(this.duration, quantize, 'floor').frame
    }

    loadedAudio?: LoadedAudio
    
    get loadedAudioPromise(): Promise<LoadedAudio> {
      if (this.loadedAudio) return Promise.resolve(this.loadedAudio)

      const transcoding = this.preferredTranscoding(DefinitionType.Audio, DefinitionType.Video)
      return transcoding.loadedMediaPromise.then(media => {
        if (isLoadedAudio(media)) {
          this.loadedAudio = media
          return media
        }
        assertLoadedVideo(media)

        const { src } = media
        const endpoint = endpointFromUrl(src)
        const request = { endpoint }
        return requestAudioPromise(request).then(audio => {
          this.loadedAudio = audio
          return audio
        })
      })
    }

    loop = false

    toJSON() : UnknownObject {
      const json = super.toJSON()
      const { duration, audio, loop, waveform, audioUrl, url } = this
      if (duration) json.duration = duration
      if (audio) json.audio = audio
      if (loop) json.loop = loop
      if (waveform) json.waveform = waveform
      if (url) json.url = url
      else if (audioUrl) json.audioUrl = audioUrl
      return json
    }

    urlAudible(editing = false): string { 
      // console.log(this.constructor.name, "urlAudible", editing, this.audioUrl)
      if (editing) {
        return urlPrependProtocol('audio', this.audioUrl || this.url) 
      }
      return this.source
    }
    
    waveform?: string
  }
}
