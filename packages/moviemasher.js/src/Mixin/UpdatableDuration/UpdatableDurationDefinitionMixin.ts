import { AudibleContextInstance } from "../../Context/AudibleContext"
import { AudibleSource, LoadedAudio, UnknownObject } from "../../declarations"
import { timeFromSeconds } from "../../Helpers/Time/TimeUtilities"
import { isLoadedAudio, Loader } from "../../Loader/Loader"
import { DataType, Duration } from "../../Setup/Enums"
import { DataGroup, propertyInstance } from "../../Setup/Property"
import { isAboveZero, isPopulatedString } from "../../Utility/Is"
import { PreloadableDefinitionClass } from "../Preloadable/Preloadable"
import { UpdatableDurationDefinition, UpdatableDurationDefinitionClass, UpdatableDurationDefinitionObject } from "./UpdatableDuration"
import { urlPrependProtocol } from "../../Utility/Url"

export function UpdatableDurationDefinitionMixin<T extends PreloadableDefinitionClass>(Base: T): UpdatableDurationDefinitionClass & T {
  return class extends Base implements UpdatableDurationDefinition {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      const { 
        audioUrl, audio, loop, duration, waveform, loadedAudio
      } = object as UpdatableDurationDefinitionObject
      if (audio || audioUrl || loadedAudio) {
        this.audio = true
        if (isPopulatedString(audioUrl)) this.audioUrl = audioUrl
        if (waveform) this.waveform = waveform
      if (loadedAudio) this.loadedAudio = loadedAudio
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

    audibleSource(preloader: Loader): AudibleSource | undefined {
      const { loadedAudio } = this
      if (loadedAudio) {
        // console.log(this.constructor.name, "audibleSource loadedAudio")
        return AudibleContextInstance.createBufferSource(loadedAudio)
      }

      const { audioUrl } = this
      if (!isPopulatedString(audioUrl)) {
        // console.log(this.constructor.name, "audibleSource no audioUrl")
        this.audio = false
        return
      }
      const protocolUrl = urlPrependProtocol('audio', audioUrl)
      // console.log(this.constructor.name, "audibleSource", protocolUrl)
      const cache = preloader.getCache(protocolUrl)
      if (!cache) {
        // console.log(this.constructor.name, "audibleSource not cached", protocolUrl)
        return
      }

      const { error, result } = cache
      if (error || !isLoadedAudio(result)) {
        // console.log(this.constructor.name, "audibleSource error", error, protocolUrl, result)
        this.audio = false
        this.audioUrl = ''
        return
      }
  
      this.loadedAudio = result
      
      // console.log(this.constructor.name, "audibleSource cached", protocolUrl)
      return AudibleContextInstance.createBufferSource(result)
    }

    audio = false

    audioUrl = ''

    duration = 0

    frames(quantize: number): number {
      const { duration } = this
      // console.log(this.constructor.name, "frames duration =", duration)
      if (!duration) return Duration.Unknown

      return timeFromSeconds(this.duration, quantize, 'floor').frame
    }

    loadedAudio?: LoadedAudio

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
