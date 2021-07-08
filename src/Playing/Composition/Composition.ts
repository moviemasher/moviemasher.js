import { Errors} from "../../Setup/Errors"
import { Default } from "../../Setup/Default"
import { DefinitionType } from "../../Setup/Enums"
import { Pixel } from "../../Utilities/Pixel"
import { byTrack } from "../../Utilities/Sort"
import { Is } from "../../Utilities/Is"
import { Time } from "../../Utilities/Time"
import { AudibleContext, VisibleContext } from "../../Playing"
import { ContextFactory } from "../ContextFactory"
import { Audible } from "../../Mash/Mixin/Audible/Audible"
import { Visible } from "../../Mash/Mixin/Visible/Visible"
import { Transition } from "../../Mash/Transition/Transition"

interface ClipTiming {
  start : number
  duration : number
  offset : number
}

interface Source {
  gainNode: GainNode
  gainSource: AudioBufferSourceNode
}

interface CompositionObject {
  audibleContext? : AudibleContext
  buffer? : number
  gain? : number
  quantize? : number
  backcolor? : string
  visibleContext? : VisibleContext
}

class Composition {
  constructor(object : CompositionObject) {
    const {
      audibleContext,
      backcolor,
      buffer,
      gain,
      quantize,
      visibleContext
    } = object

    if (backcolor) this.backcolor = backcolor

    if (quantize && Is.aboveZero(quantize)) this.quantize = quantize

    if (audibleContext) this._audibleContext = audibleContext
    else this._audibleContext = ContextFactory.audible()

    if (visibleContext) this._visibleContext = visibleContext
    else this._visibleContext = ContextFactory.visible()

    if (typeof gain !== "undefined" && Is.positive(gain)) this._gain = gain

    if (buffer && Is.aboveZero(buffer)) this.buffer = buffer
  }

  adjustSourceGain(clip : Audible) : void {
    const source = this.sourcesByClip.get(clip)
    if (!source) return

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
    const timing = this.clipTiming(clip)
    const { start, duration } = timing
    gainNode.gain.cancelScheduledValues(0)
    clip.gainPairs.forEach(pair => {
      const [position, value] = pair
      gainNode.gain.linearRampToValueAtTime(this.gain * value, start + position * duration)
    })
  }

  private _audibleContext : AudibleContext

  get audibleContext() : AudibleContext { return this._audibleContext }

  set audibleContext(value : AudibleContext) { this._audibleContext = value }

  backcolor? : string

  buffer = Default.mash.buffer

  private bufferSource? : AudioBufferSourceNode

  private clipTiming(clip : Audible) : ClipTiming {
    const range = clip.timeRange(this.quantize)
    const zeroSeconds = this.contextSeconds - this.mashSeconds
    let offset = 0
    let start = zeroSeconds + range.seconds
    let duration = range.lengthSeconds

    if (clip.trim) {
      range.frame = clip.trim
      offset = range.seconds
    }
    const now = this.audibleContext.currentTime
    if (now > start) {
      const dif = now - start
      start = now
      offset += dif
      duration -= dif
    }
    return { duration, offset, start }
  }

  compositeAudible(clips : Audible[]) : boolean {
    if (!this.createSources(clips)) return false

    this.destroySources(clips)
    return true
  }

  compositeVisible(time : Time, clips : Visible[]) : void {
    // console.log(this.constructor.name, "compositeVisible", time, clips.length)
    const main = clips.filter(clip => clip.track === 0)
    this.drawBackground() // clear and fill with mash background color if defined
    if (main.length > 1) {
      const transitionClip = main.find(clip => clip.type === DefinitionType.Transition)
      if (!transitionClip) throw Errors.mainTrackOverlap

      const transitioned = main.filter(clip => clip.type !== DefinitionType.Transition)
      const transition = <Transition> transitionClip

      transition.mergeClipsIntoContextAtTime(
        transitioned, this.visibleContext, time, this.quantize, this.backcolor
      )
    } else {
      const [mainClip] = main
      if (mainClip) mainClip.mergeContextAtTime(time, this.quantize, this.visibleContext)
    }
    const tracked = clips.filter(clip => !main.includes(clip)).sort(byTrack)
    tracked.forEach(clip => {
      clip.mergeContextAtTime(time, this.quantize, this.visibleContext)
    })
  }

  compositeVisibleRequest(time : Time, clips : Visible[]) : void {
    if (Is.populatedArray(clips)) {
      // console.log(this.constructor.name, "compositeVisibleRequest calling requestAnimationFrame", time, clips.length)
      requestAnimationFrame(() => this.compositeVisible(time, clips))
      return
    }
    this.drawBackground()
  }

  private contextSeconds = 0

  private createSources(clips : Audible[]) : boolean {
    const filtered = clips.filter(clip => !this.sourcesByClip.has(clip))
    return filtered.every(clip => {
      const { definition } = clip
      const buffer = definition.loadedAudible()
      if (!buffer) return false

      const timing = this.clipTiming(clip)
      const { start, duration, offset } = timing
      if (Is.positive(start) && Is.aboveZero(duration)) {
        const gainSource = this.audibleContext.createBufferSource()
        gainSource.buffer = buffer
        gainSource.loop = clip.definition.loops
        const gainNode = this.audibleContext.createGain()
        gainSource.connect(gainNode)
        gainNode.connect(this.audibleContext.destination)
        gainSource.start(start, offset, duration)

        this.sourcesByClip.set(clip, { gainSource, gainNode })
        this.adjustSourceGain(clip)
      }
      return true
    })
  }

  private destroySources(clipsToKeep : Audible[] = []) : void {
    this.sourcesByClip.forEach((source, clip) => {
      if (clipsToKeep.includes(clip)) return

      const { gainSource, gainNode } = source
      gainNode.disconnect(this.audibleContext.destination)
      gainSource.disconnect(gainNode)
      this.sourcesByClip.delete(clip)
    })
  }

  private drawBackground() : void {
    this.visibleContext.clear()
    if (!this.backcolor) return

    this.visibleContext.drawFill(Pixel.color(this.backcolor))
  }

  private _gain = Default.mash.gain

  get gain() : number { return this._gain }

  set gain(value : number) {
    if (this._gain !== value) {
      this._gain = value
      if (!this.playing) return

      [...this.sourcesByClip.keys()].forEach(clip => this.adjustSourceGain(clip))
    }
  }

  private mashSeconds = 0

  playing = false

  quantize = Default.mash.quantize

  get seconds() : number {
    if (!this.audibleContext) throw Errors.internal + 'audibleContext'

    const ellapsed = this.audibleContext.currentTime - this.contextSeconds
    return ellapsed + this.mashSeconds
  }

  private sourcesByClip = new Map<Audible, Source>()

  startContext() : void {
    if (this.bufferSource) throw Errors.internal + 'bufferSource'
    if (this.playing) throw Errors.internal + 'playing'
    this.bufferSource = this.audibleContext.createBufferSource()
    this.bufferSource.loop = true
    this.bufferSource.buffer = this.audibleContext.createBuffer(this.buffer)
    this.bufferSource.connect(this.audibleContext.destination)
    this.bufferSource.start(0)
  }

  startPlaying(time : Time, clips: Audible[]) : boolean {
    // console.log(this.constructor.name, "startPlaying")
    if (!this.bufferSource) throw Errors.internal + 'bufferSource'
    if (this.playing) throw Errors.internal + 'playing'

    const { seconds } = time
    this.playing = true
    this.mashSeconds = seconds

    this.contextSeconds = this.audibleContext.currentTime

    if (!this.createSources(clips)) {
      this.stopPlaying()
      return false
    }
    // console.log(this.constructor.name, "startPlaying", this.mashSeconds, this.contextSeconds)
    return true
  }

  stopPlaying() : void {
    // console.log(this.constructor.name, "stopPlaying")
    if (!this.playing) return

    this.playing = false
    if (this.bufferSource) this.bufferSource.stop()

    this.destroySources()
    this.mashSeconds = 0
    this.contextSeconds = 0

    if (!this.bufferSource) return

    this.bufferSource.disconnect(this.audibleContext.destination)
    delete this.bufferSource
  }

  private _visibleContext : VisibleContext

  get visibleContext() : VisibleContext { return this._visibleContext }

  set visibleContext(value : VisibleContext) { this._visibleContext = value }

}

export { Composition }
