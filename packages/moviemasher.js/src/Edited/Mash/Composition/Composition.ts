import { Errors} from "../../../Setup/Errors"
import { Default } from "../../../Setup/Default"
import { EventType } from "../../../Setup/Enums"
import { pixelColor } from "../../../Utility/Pixel"
import { Is } from "../../../Utility/Is"
import { Time } from "../../../Helpers/Time/Time"
import { Audible } from "../../../Mixin/Audible/Audible"
import { Emitter } from "../../../Helpers/Emitter"
import { ContextFactory } from "../../../Context/ContextFactory"
import { Preloader } from "../../../Preloader/Preloader"
import { AudibleContextInstance } from "../../../Context/AudibleContext"

interface CompositionObject {
  buffer? : number
  gain? : number
  quantize? : number
  backcolor?: string
  emitter?: Emitter
  preloader: Preloader
}

class Composition {
  constructor(object : CompositionObject) {
    const { emitter, backcolor, buffer, gain, quantize, preloader } = object
    if (backcolor) this.backcolor = backcolor
    if (quantize && Is.aboveZero(quantize)) this.quantize = quantize
    if (typeof gain !== "undefined" && Is.positive(gain)) this._gain = gain
    if (buffer && Is.aboveZero(buffer)) this.buffer = buffer
    if (emitter) this.emitter = emitter
    this.preloader = preloader
  }

  adjustSourceGain(clip : Audible) : void {
    const source = AudibleContextInstance.getSource(clip.id)
    if (!source) {
      // console.log(this.constructor.name, "adjustSourceGain no source", clip.id)
      return
    }

    const { gainNode } = source
    if (this.gain === 0.0) {
      gainNode.gain.value = 0.0
      return
    }

    const gain = clip.gain

    if (Is.positive(gain)) {
      gainNode.gain.value = this.gain * gain
      return
    }

    // position/gain pairs...
    const timing = clip.startOptions(this.seconds, this.quantize)
    const { start, duration } = timing

    gainNode.gain.cancelScheduledValues(0)
    clip.gainPairs.forEach(pair => {
      const [position, value] = pair
      gainNode.gain.linearRampToValueAtTime(this.gain * value, start + position * duration)
    })
  }

  backcolor? : string

  buffer = Default.mash.buffer

  private bufferSource? : AudioBufferSourceNode

  clear() {  this.visibleContext.clear() }

  compositeAudible(clips: Audible[]): boolean {
    // console.log(this.constructor.name, "compositeAudible", clips.length)
    if (!this.createSources(clips)) {
      // if (clips.length) console.log(this.constructor.name, "compositeAudible didn't createSources")
      return false
    }

    this.destroySources(clips)
    return true
  }

  private createSources(clips: Audible[], time?:Time): boolean {
    if (!this.playing && !time) return false

    const filtered = clips.filter(clip => !AudibleContextInstance.hasSource(clip.id))
    if (filtered.length) console.log("Composition.createSources", filtered.length, "of", clips.length, "need audio source")


    return filtered.every(clip => {
      const startSeconds = this.playing ? this.seconds : time?.seconds || 0
      const timing = clip.startOptions(startSeconds, this.quantize)
      const { start, duration, offset } = timing


      // console.log(this.constructor.name, "createSources", clip.label, timing, this.contextSecondsWhenStarted - this.startedMashAt, this.quantize)
      if (Is.positive(start) && Is.aboveZero(duration)) {
        const audibleSource = clip.audibleSource(this.preloader)
        if (!audibleSource) {
          if (!start) {
            // wanted to start immediately but it's not loaded
            // console.debug(this.constructor.name, "createSources audibleSource undefined", clip.definitionId)
            return false
          }
          return true
        }
        const { definition, id } = clip
        const { loops } = definition

        AudibleContextInstance.startAt(id, audibleSource, start, duration, offset, loops)
        this.playingClips.push(clip)
        this.adjustSourceGain(clip)
      }
      return true
    })
  }

  private destroySources(clipsToKeep: Audible[] = []): void {
    const sourceClips = [...this.playingClips]
    const clipsToRemove = sourceClips.filter(clip => !clipsToKeep.includes(clip))

    clipsToRemove.forEach(clip => AudibleContextInstance.deleteSource(clip.id))
    this.playingClips = clipsToKeep
    // console.log(this.constructor.name, "destroySources removed", clipsToRemove.length, "kept", this.playingClips.length)
  }

  drawBackground() : void {
    this.clear()
    if (!this.backcolor) return

    this.visibleContext.drawFill(pixelColor(this.backcolor))
  }

  emitter?: Emitter

  private _gain = Default.mash.gain

  get gain() : number { return this._gain }

  set gain(value : number) {
    if (this._gain === value) return

    this._gain = value

    if (this.playing) {
      this.playingClips.forEach(clip => this.adjustSourceGain(clip))
    }
    this.emitter?.emit(EventType.Volume)
  }

  private playing = false

  private playingClips: Audible[] = []

  preloader: Preloader

  quantize = Default.mash.quantize

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
  startPlaying(time : Time, clips: Audible[]) : boolean {
    if (!this.bufferSource) throw Errors.internal + 'bufferSource startPlaying'
    if (this.playing) throw Errors.internal + 'playing'

    const { seconds } = time
    this.playing = true
    this.startedMashAt = seconds
    this.contextSecondsWhenStarted = AudibleContextInstance.currentTime
    // console.log(this.constructor.name, "startPlaying", "startedMashAt", this.startedMashAt, "contextSecondsWhenStarted", this.contextSecondsWhenStarted)

    if (!this.createSources(clips, time)) {
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

  visibleContext = ContextFactory.visible()
}

export { Composition, CompositionObject }
