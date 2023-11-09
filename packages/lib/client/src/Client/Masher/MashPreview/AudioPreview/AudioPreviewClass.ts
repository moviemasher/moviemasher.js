import type { AudioPreviewArgs, ClientAudibleInstance, StartOptions } from '@moviemasher/runtime-client'
import type { Clip, Time, TimeRange } from '@moviemasher/runtime-shared'

import { Default, isAboveZero, isPositive, isTimeRange } from '@moviemasher/lib-shared'
import { ERROR, errorThrow } from '@moviemasher/runtime-shared'
import { isClientAudibleInstance } from '../../../../asset/Audible/ClientAudibleInstanceGuards.js'
import { AudibleContextInstance } from '../../../Mash/Context/AudibleContext.js'

export class AudioPreviewClass {
  constructor(object: AudioPreviewArgs) {
    const { buffer, gain } = object
    if (isPositive(gain)) this.gain = gain
    if (isAboveZero(buffer)) this.buffer = buffer
  }

  adjustClipGain(clip: Clip, _quantize: number): void {
    const timeRange = clip.timeRange
    const avs = this.clipSources(clip)
    avs.forEach(av => { this.adjustSourceGain(av, timeRange) })
  }

  private adjustSourceGain(av: ClientAudibleInstance, timeRange: TimeRange | StartOptions): void {
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

  private clipSources(clip: Clip): ClientAudibleInstance[] {
    const avs: ClientAudibleInstance[] = []
    const { container, content } = clip
    if (isClientAudibleInstance(container) && !container.muted) avs.push(container)
    if (isClientAudibleInstance(content) && !content.muted) avs.push(content)
    return avs
  }

  private createSources(clips: Clip[], _quantize: number, time?:Time): boolean {
    // console.log(this.constructor.name, 'createSources', clips.length, 'clip(s)', quantize, time, this.playing)

    if (!this.playing && !time) return false

    const addingClips = clips.filter(clip => !this.playingClips.includes(clip))
    // console.log(this.constructor.name, 'createSources', addingClips.length, 'addingClip(s)')
    if (!addingClips.length) return true

    let okay = true
    addingClips.forEach(clip => {
      const avs = this.clipSources(clip)
      const timeRange = clip.timeRange
      const filtered = avs.filter(av => !AudibleContextInstance.hasSource(av.id))
      okay &&= filtered.every(av => {
        const startSeconds = this.playing ? this.seconds: time?.seconds || 0
        const options = av.startOptions(startSeconds, timeRange)
        const { start, duration, offset } = options

        if (isPositive(start) && isAboveZero(duration)) {
          const { asset, id } = av
          const source = asset.audibleSource()
          if (!source) {
            if (!start) {
              // console.log(this.constructor.name, 'createSources no audible source', asset.label)
              // wanted to start immediately but it's not loaded
              return !asset.audio
            }
            return true
          }
          const { loop } = asset 
          // console.log(this.constructor.name, 'createSources', options, loop)
          AudibleContextInstance.startAt(id, source, start, duration, offset, loop)

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
    return ellapsed + this.startedMashAt
  }

  startContext(): void {
    if (this.bufferSource) return errorThrow(ERROR.Internal) 
    if (this.playing) return errorThrow(ERROR.Internal) 

    const buffer = AudibleContextInstance.createBuffer(this.buffer)
    this.bufferSource = AudibleContextInstance.createBufferSource(buffer)
    this.bufferSource.loop = true
    this.bufferSource.connect(AudibleContextInstance.destination)
    this.bufferSource.start(0)
  }

  // called when playhead starts moving
  startPlaying(time: Time, clips: Clip[], quantize: number): boolean {
    if (!this.bufferSource) return errorThrow(ERROR.Internal) 
    if (this.playing) return errorThrow(ERROR.Internal)

    const { seconds } = time
    this.playing = true
    this.startedMashAt = seconds
    this.contextSecondsWhenStarted = AudibleContextInstance.currentTime

    if (!this.createSources(clips, quantize, time)) {    
      this.stopPlaying()
      return false
    }
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
