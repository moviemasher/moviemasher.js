import { StartOptions } from "../../../declarations"
import { Errors} from "../../../Setup/Errors"
import { Default } from "../../../Setup/Default"
import { isAboveZero, isPositive, isTimeRange } from "../../../Utility/Is"
import { Time, TimeRange } from "../../../Helpers/Time/Time"
import { Loader } from "../../../Loader/Loader"
import { AudibleContextInstance } from "../../../Context/AudibleContext"
import { isUpdatableDuration, UpdatableDuration, UpdatableDurationDefinition } from "../../../Mixin"
import { Clip } from "../../../Edited/Mash/Track/Clip/Clip"

export interface AudioPreviewArgs {
  buffer? : number
  gain? : number
  preloader: Loader
}


export class AudioPreview {
  constructor(object : AudioPreviewArgs) {
    const { buffer, gain, preloader } = object
    if (isPositive(gain)) this.gain = gain
    if (isAboveZero(buffer)) this.buffer = buffer
    this.preloader = preloader
  }

  adjustClipGain(clip: Clip, quantize: number): void {
    const timeRange = clip.timeRange(quantize)
    const avs = this.clipSources(clip)
    avs.forEach(av => { this.adjustSourceGain(av, timeRange) })
  }

  private adjustSourceGain(av: UpdatableDuration, timeRange: TimeRange | StartOptions): void {
    const source = AudibleContextInstance.getSource(av.id)
      if (!source) {
        // console.log(this.constructor.name, "adjustSourceGain no source", clip.id)
        return
      }

      const { gainNode } = source
      if (this.gain === 0.0) {
        gainNode.gain.value = 0.0
        return
      }

      const gain = av.gain

      if (isPositive(gain)) {
        gainNode.gain.value = this.gain * gain
        return
      }

      // position/gain pairs...
      const options = isTimeRange(timeRange) ? av.startOptions(this.seconds, timeRange) : timeRange
      const { start, duration } = options

      gainNode.gain.cancelScheduledValues(0)
      av.gainPairs.forEach(pair => {
        const [position, value] = pair
        gainNode.gain.linearRampToValueAtTime(this.gain * value, start + position * duration)
      })
  }

  backcolor? : string

  buffer = Default.mash.buffer

  private bufferSource? : AudioBufferSourceNode

  clear() {  }

  private clipSources(clip: Clip): UpdatableDuration[] {
    const avs: UpdatableDuration[] = []
    const { container, content } = clip
    if (isUpdatableDuration(container) && !container.muted) avs.push(container)
    if (isUpdatableDuration(content) && !content.muted) avs.push(content)
    return avs
  }
  
  compositeAudible(clips: Clip[], quantize: number): boolean {
    // console.log(this.constructor.name, "compositeAudible", clips.length)
    if (!this.createSources(clips, quantize)) return false

    this.destroySources(clips)
    return true
  }

  private createSources(clips: Clip[], quantize: number, time?:Time): boolean {
    // console.log(this.constructor.name, "createSources", clips.length, "clip(s)", quantize, time, this.playing)

    if (!this.playing && !time) return false

    const addingClips = clips.filter(clip => !this.playingClips.includes(clip))
    this.playingClips.push(...addingClips)
    // console.log(this.constructor.name, "createSources", addingClips.length, "addingClip(s)")

    return addingClips.every(clip => {
      const avs = this.clipSources(clip)

      const timeRange = clip.timeRange(quantize)

      const filtered = avs.filter(av => !AudibleContextInstance.hasSource(av.id))
      return filtered.every(av => {
        const startSeconds = this.playing ? this.seconds : time?.seconds || 0
        const options = av.startOptions(startSeconds, timeRange)
        const { start, duration, offset } = options

        if (isPositive(start) && isAboveZero(duration)) {
          const audibleSource = av.audibleSource(this.preloader)
          if (!audibleSource) {
            if (!start) {
              // wanted to start immediately but it's not loaded
              return false
            }
            return true
          }
          const { definition, id } = av

          const { loop } = definition as UpdatableDurationDefinition
          // console.log(this.constructor.name, "createSources", options, loop)
          AudibleContextInstance.startAt(id, audibleSource, start, duration, offset, loop)

          this.adjustSourceGain(av, options)
        } else console.error(this.constructor.name, "createSources", options)
        return true
      })
    })
  }

  private destroySources(clipsToKeep: Clip[] = []): void {
    const sourceClips = [...this.playingClips]
    const clipsToRemove = sourceClips.filter(clip => !clipsToKeep.includes(clip))

    clipsToRemove.forEach(clip => {
      const avs = this.clipSources(clip)
      avs.forEach(av => AudibleContextInstance.deleteSource(av.id))
    })
    this.playingClips = clipsToKeep
    // console.log(this.constructor.name, "destroySources removed", clipsToRemove.length, "kept", this.playingClips.length)
  }

  gain = Default.mash.gain

  setGain(value : number, quantize: number) {
    if (this.gain === value) return

    this.gain = value

    if (this.playing) {
      this.playingClips.forEach(clip => this.adjustClipGain(clip, quantize))
    }

  }

  private playing = false

  private playingClips: Clip[] = []

  preloader: Loader

  get seconds(): number {
    const ellapsed = AudibleContextInstance.currentTime - this.contextSecondsWhenStarted
    const started = ellapsed + this.startedMashAt
    // console.log("seconds", started, "=", this.startedMashAt, "+", ellapsed, '=', audibleContext.currentTime, '-', this.contextSecondsWhenStarted)
    return started
  }

  startContext(): void {
    // console.log(this.constructor.name, "startContext")
    if (this.bufferSource) throw Errors.internal + 'bufferSource startContext'
    if (this.playing) throw Errors.internal + 'playing'

    const buffer = AudibleContextInstance.createBuffer(this.buffer)
    this.bufferSource = AudibleContextInstance.createBufferSource(buffer)
    this.bufferSource.loop = true
    this.bufferSource.connect(AudibleContextInstance.destination)
    this.bufferSource.start(0)
  }

  // called when playhead starts moving
  startPlaying(time: Time, clips: Clip[], quantize: number) : boolean {
    if (!this.bufferSource) throw Errors.internal + 'bufferSource startPlaying'
    if (this.playing) throw Errors.internal + 'playing'

    const { seconds } = time
    this.playing = true
    this.startedMashAt = seconds
    this.contextSecondsWhenStarted = AudibleContextInstance.currentTime
    // console.log(this.constructor.name, "startPlaying", "startedMashAt", this.startedMashAt, "contextSecondsWhenStarted", this.contextSecondsWhenStarted)

    if (!this.createSources(clips, quantize, time)) {
      this.stopPlaying()
      return false
    }
    // console.log(this.constructor.name, "startPlaying", this.startedMashAt, this.contextSecondsWhenStarted)
    return true
  }

  // position of masher (in seconds) when startPlaying called
  private startedMashAt = 0

  // currentTime of context (in seconds) was created when startPlaying called
  private contextSecondsWhenStarted = 0

  stopPlaying(): void {
    // console.log(this.constructor.name, "stopPlaying")
    if (!this.playing) return

    this.playing = false
    if (this.bufferSource) this.bufferSource.stop()

    this.destroySources()
    this.startedMashAt = 0
    this.contextSecondsWhenStarted = 0

    if (!this.bufferSource) return

    this.bufferSource.disconnect(AudibleContextInstance.destination)
    delete this.bufferSource
  }

}
