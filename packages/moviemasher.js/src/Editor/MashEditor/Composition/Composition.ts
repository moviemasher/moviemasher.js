import { Errors} from "../../../Setup/Errors"
import { Default } from "../../../Setup/Default"
import { DefinitionType, EventType } from "../../../Setup/Enums"
import { pixelColor } from "../../../Utilities/Pixel"
import { sortByTrack } from "../../../Utilities/Sort"
import { Is } from "../../../Utilities/Is"
import { Time } from "../../../Helpers/Time"
import { Audible } from "../../../Mixin/Audible/Audible"
import { Visible } from "../../../Mixin/Visible/Visible"
import { Transition } from "../../../Media/Transition/Transition"
import { cacheAudibleContext } from "../../../Loader/Cache"
import { Emitter } from "../../../Helpers/Emitter"
import { ContextFactory } from "../../../Context/ContextFactory"

interface CompositionObject {
  buffer? : number
  gain? : number
  quantize? : number
  backcolor?: string
  emitter?: Emitter
}

class Composition {
  constructor(object : CompositionObject) {
    const { emitter, backcolor, buffer, gain, quantize } = object
    if (backcolor) this.backcolor = backcolor
    if (quantize && Is.aboveZero(quantize)) this.quantize = quantize
    if (typeof gain !== "undefined" && Is.positive(gain)) this._gain = gain
    if (buffer && Is.aboveZero(buffer)) this.buffer = buffer
    if (emitter) this.emitter = emitter
  }

  adjustSourceGain(clip : Audible) : void {
    const source = cacheAudibleContext.getSource(clip.id)
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

  compositeAudible(clips: Audible[]): boolean {
    // console.log(this.constructor.name, "compositeAudible", clips.length)
    if (!this.createSources(clips)) {
      // if (clips.length) console.log(this.constructor.name, "compositeAudible didn't createSources")
      return false
    }

    this.destroySources(clips)
    return true
  }

  compositeVisible(time: Time, clips: Visible[]): void {
    this.drawBackground() // clear and fill with mash background color if defined

    const clipsByTrack = new Map<number, Visible>()
    const transitionsByTrack = new Map<number, Transition>()
    const transitioningTracks: number[] = []

    const transitionClips: Transition[] = []
    const visibleTracks: number[] = []
    clips.sort(sortByTrack).forEach(clip => {
      const { type } = clip
      if (type === DefinitionType.Transition) {
        const transition = <Transition>clip
        transitionsByTrack.set(transition.fromTrack, transition)
        transitionsByTrack.set(transition.toTrack, transition)

        transitioningTracks.push(transition.fromTrack, transition.toTrack)
        transitionClips.push(transition)
      } else {
        visibleTracks.push(clip.track)
        clipsByTrack.set(clip.track, clip)
      }
    })

    visibleTracks.forEach(track => {
      if (transitioningTracks.includes(track)) {
        const transition = transitionsByTrack.get(track)
        if (!transition) throw Errors.internal

        const { fromTrack, toTrack } = transition
        const transitioned: Visible[] = []
        const fromClip = clipsByTrack.get(fromTrack)
        if (fromClip) transitioned.push(fromClip)
        const toClip = clipsByTrack.get(toTrack)
        if (toClip) transitioned.push(toClip)

        if (!transitioned.length) return

        // console.log("drawing clips at track", transitioned.map(clip => clip.track), track)
        transition.mergeClipsIntoContextAtTime(
          transitioned, this.visibleContext, time, this.quantize, this.backcolor
        )
        clipsByTrack.delete(fromTrack)
        clipsByTrack.delete(toTrack)
        return
      }
      const clip = clipsByTrack.get(track)
      if (clip) {
        // console.log("drawing clip at track", clip.track, track)
        clip.mergeContextAtTime(time, this.quantize, this.visibleContext)
      }
    })
    this.emitter?.emit(EventType.Draw)
  }

  compositeVisibleRequest(time : Time, clips : Visible[]) : void {
    requestAnimationFrame(() => this.compositeVisible(time, clips))
  }


  private createSources(clips: Audible[], time?:Time): boolean {
    const filtered = clips.filter(clip => !cacheAudibleContext.hasSource(clip.id))
    // if (filtered.length) console.log("Composition.createSources", filtered.length, "of", clips.length, "need audio source")
    return filtered.every(clip => {
      const sourceNode = clip.loadedAudible()
      if (!sourceNode) {
        console.debug(this.constructor.name, "createSources loadedAudible undefined", clip.id)
        return false
      }
      if (!this.playing && !time) return

      const startSeconds = this.playing ? this.seconds : time?.seconds || 0
      const timing = clip.startOptions(startSeconds, this.quantize)
      const { start, duration, offset } = timing
      // console.log(this.constructor.name, "createSources", clip.label, timing, this.contextSecondsWhenStarted - this.startedMashAt, this.quantize)
      if (Is.positive(start) && Is.aboveZero(duration)) {
        const { definition, id } = clip
        const { loops } = definition
        cacheAudibleContext.startAt(id, sourceNode, start, duration, offset, loops)
        this.playingClips.push(clip)
        this.adjustSourceGain(clip)
      }
      return true
    })
  }

  private destroySources(clipsToKeep: Audible[] = []): void {
    const sourceClips = [...this.playingClips]
    const clipsToRemove = sourceClips.filter(clip => !clipsToKeep.includes(clip))

    clipsToRemove.forEach(clip => cacheAudibleContext.deleteSource(clip.id))
    this.playingClips = clipsToKeep
    // console.log(this.constructor.name, "destroySources removed", clipsToRemove.length, "kept", this.playingClips.length)
  }

  private drawBackground() : void {
    this.visibleContext.clear()
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

  quantize = Default.mash.quantize

  get seconds(): number {
    const ellapsed = cacheAudibleContext.currentTime - this.contextSecondsWhenStarted
    const started = ellapsed + this.startedMashAt
    // console.log("seconds", started, "=", this.startedMashAt, "+", ellapsed, '=', audibleContext.currentTime, '-', this.contextSecondsWhenStarted)
    return started
  }

  startContext(): void {
    // console.log(this.constructor.name, "startContext")
    if (this.bufferSource) throw Errors.internal + 'bufferSource startContext'
    if (this.playing) throw Errors.internal + 'playing'

    const buffer = cacheAudibleContext.createBuffer(this.buffer)
    this.bufferSource = cacheAudibleContext.createBufferSource(buffer)
    this.bufferSource.loop = true
    this.bufferSource.connect(cacheAudibleContext.destination)
    this.bufferSource.start(0)
  }

  // called when playhead starts moving
  startPlaying(time : Time, clips: Audible[]) : boolean {
    if (!this.bufferSource) throw Errors.internal + 'bufferSource startPlaying'
    if (this.playing) throw Errors.internal + 'playing'

    const { seconds } = time
    this.playing = true
    this.startedMashAt = seconds
    this.contextSecondsWhenStarted = cacheAudibleContext.currentTime
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

    this.bufferSource.disconnect(cacheAudibleContext.destination)
    delete this.bufferSource
  }

  visibleContext = ContextFactory.visible()
}

export { Composition, CompositionObject }
