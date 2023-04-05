import { AudioPreviewArgs, StartOptions } from './AudioPreview.js'
import { Default } from '../../../../Setup/Default.js'
import { isAboveZero, isPositive, isTimeRange } from '../../../../Utility/Is.js'
import { Time, TimeRange } from '../../../../Helpers/Time/Time.js'
import { AudibleContextInstance } from '../../../../Context/AudibleContext.js'
import { assertUpdatableDurationDefinition, isUpdatableDuration, UpdatableDuration } from '../../../../Mixin/UpdatableDuration/UpdatableDuration.js'
import { Clip } from '../../../../Media/Mash/Track/Clip/Clip.js'
import { ErrorName } from '../../../../Helpers/Error/ErrorName.js'
import { errorThrow } from '../../../../Helpers/Error/ErrorFunctions.js'

export class AudioPreviewClass {
  constructor(object: AudioPreviewArgs) {
    const { buffer, gain } = object
    if (isPositive(gain)) this.gain = gain
    if (isAboveZero(buffer)) this.buffer = buffer
  }

  adjustClipGain(clip: Clip, quantize: number): void {
    const timeRange = clip.timeRange(quantize)
    const avs = this.clipSources(clip)
    avs.forEach(av => { this.adjustSourceGain(av, timeRange) })
  }

  private adjustSourceGain(av: UpdatableDuration, timeRange: TimeRange | StartOptions): void {
    const source = AudibleContextInstance.getSource(av.id)
      if (!source) {
        // console.log(this.constructor.name, 'adjustSourceGain no source', clip.id)
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
      const options = isTimeRange(timeRange) ? av.startOptions(this.seconds, timeRange): timeRange
      const { start, duration } = options

      gainNode.gain.cancelScheduledValues(0)
      av.gainPairs.forEach(pair => {
        const [position, value] = pair
        gainNode.gain.linearRampToValueAtTime(this.gain * value, start + position * duration)
      })
  }

  buffer = Default.mash.buffer
  
  bufferClips(clips: Clip[], quantize: number): boolean {
    // console.log(this.constructor.name, 'compositeAudible', clips.length)
    if (!this.createSources(clips, quantize)) return false

    this.destroySources(clips)
    return true
  }

  private bufferSource?: AudioBufferSourceNode

  clear() {  }

  private clipSources(clip: Clip): UpdatableDuration[] {
    const avs: UpdatableDuration[] = []
    const { container, content } = clip
    if (isUpdatableDuration(container) && !container.muted) avs.push(container)
    if (isUpdatableDuration(content) && !content.muted) avs.push(content)
    return avs
  }

  private createSources(clips: Clip[], quantize: number, time?:Time): boolean {
    // console.log(this.constructor.name, 'createSources', clips.length, 'clip(s)', quantize, time, this.playing)

    if (!this.playing && !time) return false

    const addingClips = clips.filter(clip => !this.playingClips.includes(clip))
    // console.log(this.constructor.name, 'createSources', addingClips.length, 'addingClip(s)')
    if (!addingClips.length) return true

    let okay = true
    addingClips.forEach(clip => {
      const avs = this.clipSources(clip)
      const timeRange = clip.timeRange(quantize)
      const filtered = avs.filter(av => !AudibleContextInstance.hasSource(av.id))
      okay &&= filtered.every(av => {
        const startSeconds = this.playing ? this.seconds: time?.seconds || 0
        const options = av.startOptions(startSeconds, timeRange)
        const { start, duration, offset } = options

        if (isPositive(start) && isAboveZero(duration)) {
          const { definition, id } = av
          assertUpdatableDurationDefinition(definition)
          const audibleSource = definition.audibleSource()
          if (!audibleSource) {
            if (!start) {
              console.log(this.constructor.name, 'createSources no audible source', definition.label)
              // wanted to start immediately but it's not loaded
              return false
            }
            return true
          }
          const { loop } = definition 
          // console.log(this.constructor.name, 'createSources', options, loop)
          AudibleContextInstance.startAt(id, audibleSource, start, duration, offset, loop)

          this.adjustSourceGain(av, options)
        } else console.error(this.constructor.name, 'createSources', options)
        return true
      })
    })
    this.playingClips.push(...addingClips)
    return okay
  }

  private destroySources(clipsToKeep: Clip[] = []): void {
    const sourceClips = [...this.playingClips]
    const clipsToRemove = sourceClips.filter(clip => !clipsToKeep.includes(clip))

    clipsToRemove.forEach(clip => {
      const avs = this.clipSources(clip)
      avs.forEach(av => AudibleContextInstance.deleteSource(av.id))
    })
    this.playingClips = clipsToKeep
    // console.log(this.constructor.name, 'destroySources removed', clipsToRemove.length, 'kept', this.playingClips.length)
  }

  gain = Default.mash.gain

  setGain(value: number, quantize: number) {
    if (this.gain === value) return

    this.gain = value

    if (this.playing) {
      this.playingClips.forEach(clip => this.adjustClipGain(clip, quantize))
    }

  }

  private playing = false

  private playingClips: Clip[] = []

  get seconds(): number {
    const ellapsed = AudibleContextInstance.currentTime - this.contextSecondsWhenStarted
    const started = ellapsed + this.startedMashAt
    // console.log('seconds', started, '=', this.startedMashAt, '+', ellapsed, '=', audibleContext.currentTime, '-', this.contextSecondsWhenStarted)
    return started
  }

  startContext(): void {
    // console.log(this.constructor.name, 'startContext')
    if (this.bufferSource) return errorThrow(ErrorName.Internal) 
    if (this.playing) return errorThrow(ErrorName.Internal) 

    const buffer = AudibleContextInstance.createBuffer(this.buffer)
    this.bufferSource = AudibleContextInstance.createBufferSource(buffer)
    this.bufferSource.loop = true
    this.bufferSource.connect(AudibleContextInstance.destination)
    this.bufferSource.start(0)
  }

  // called when playhead starts moving
  startPlaying(time: Time, clips: Clip[], quantize: number): boolean {
    if (!this.bufferSource) return errorThrow(ErrorName.Internal) 
    if (this.playing) return errorThrow(ErrorName.Internal)

    const { seconds } = time
    this.playing = true
    this.startedMashAt = seconds
    this.contextSecondsWhenStarted = AudibleContextInstance.currentTime
    // console.log(this.constructor.name, 'startPlaying', 'startedMashAt', this.startedMashAt, 'contextSecondsWhenStarted', this.contextSecondsWhenStarted)

    if (!this.createSources(clips, quantize, time)) {    
      // console.log(this.constructor.name, 'startPlaying stalled')

      this.stopPlaying()
      return false
    }
    // console.log(this.constructor.name, 'startPlaying', this.startedMashAt, this.contextSecondsWhenStarted)
    return true
  }

  // position of masher (in seconds) when startPlaying called
  private startedMashAt = 0

  // currentTime of context (in seconds) was created when startPlaying called
  private contextSecondsWhenStarted = 0

  stopContext(): void {
    if (!this.bufferSource) return

    this.bufferSource.stop()
    this.bufferSource.disconnect(AudibleContextInstance.destination)
    delete this.bufferSource
  }

  stopPlaying(): void {
    // console.log(this.constructor.name, 'stopPlaying')
    if (!this.playing) return

    this.playing = false
    this.destroySources()
    this.startedMashAt = 0
    this.contextSecondsWhenStarted = 0
  }
}
