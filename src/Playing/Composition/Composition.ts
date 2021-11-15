import { Errors} from "../../Setup/Errors"
import { Default } from "../../Setup/Default"
import { DefinitionType, EventType } from "../../Setup/Enums"
import { pixelColor } from "../../Utilities/Pixel"
import { byTrack } from "../../Utilities/Sort"
import { Is } from "../../Utilities/Is"
import { Time } from "../../Utilities/Time"
import { Audible } from "../../Mash/Mixin/Audible/Audible"
import { Visible } from "../../Mash/Mixin/Visible/Visible"
import { Transition } from "../../Mash/Transition/Transition"
import { Cache } from "../../Loading/Cache"
import { AudibleSource } from "../.."

interface Source {
  gainNode: GainNode
  gainSource: AudibleSource
}

interface CompositionObject {
  buffer? : number
  gain? : number
  quantize? : number
  backcolor? : string
}

class Composition {
  constructor(object : CompositionObject) {
    const { backcolor, buffer, gain, quantize } = object
    if (backcolor) this.backcolor = backcolor
    if (quantize && Is.aboveZero(quantize)) this.quantize = quantize
    if (typeof gain !== "undefined" && Is.positive(gain)) this._gain = gain
    if (buffer && Is.aboveZero(buffer)) this.buffer = buffer
  }

  adjustSourceGain(clip : Audible) : void {
    const source = this.sourcesByClip.get(clip)
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
    const timing = clip.startOptions(this.startedContextAt - this.startedMashAt, this.quantize)
    const { start, duration } = timing

    console.log(this.constructor.name, "adjustSourceGain", clip.label, timing, this.startedContextAt - this.startedMashAt, this.quantize)


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

  compositeVisible(time : Time, clips : Visible[]) : void {
    const main = clips.filter(clip => clip.track === 0)
    this.drawBackground() // clear and fill with mash background color if defined
    if (main.length > 1) {
      const transitionClip = main.find(clip => clip.type === DefinitionType.Transition)
      if (!transitionClip) throw Errors.mainTrackOverlap

      const transitioned = main.filter(clip => clip.type !== DefinitionType.Transition)
      const transition = <Transition> transitionClip

      transition.mergeClipsIntoContextAtTime(
        transitioned, Cache.visibleContext, time, this.quantize, this.backcolor
      )
    } else {
      const [mainClip] = main
      if (mainClip) mainClip.mergeContextAtTime(time, this.quantize, Cache.visibleContext)
    }
    const tracked = clips.filter(clip => !main.includes(clip)).sort(byTrack)
    tracked.forEach(clip => {
      clip.mergeContextAtTime(time, this.quantize, Cache.visibleContext)
    })
    Cache.audibleContext.emit(EventType.Draw)
  }

  compositeVisibleRequest(time : Time, clips : Visible[]) : void {
    if (Is.populatedArray(clips)) {
      // console.log(this.constructor.name, "compositeVisibleRequest calling requestAnimationFrame", time, clips.length)
      requestAnimationFrame(() => this.compositeVisible(time, clips))
      return
    }
    this.drawBackground()
  }


  private createSources(clips: Audible[]): boolean {
    // console.log("Composition.createSources", clips.length)

    const filtered = clips.filter(clip => !this.sourcesByClip.has(clip))
    return filtered.every(clip => {
      const sourceNode = clip.loadedAudible()
      if (!sourceNode) {
        console.debug(this.constructor.name, "createSources loadedAudible undefined", clip.id)
        return false
      }

      const timing = clip.startOptions(this.startedContextAt - this.startedMashAt, this.quantize)
      const { start, duration, offset } = timing
      console.log(this.constructor.name, "createSources", clip.label, timing, this.startedContextAt - this.startedMashAt, this.quantize)
      if (Is.positive(start) && Is.aboveZero(duration)) {
        sourceNode.loop = clip.definition.loops
        const gainNode = Cache.audibleContext.createGain()
        sourceNode.connect(gainNode)
        gainNode.connect(Cache.audibleContext.destination)
        sourceNode.start(start, offset, duration)

        this.sourcesByClip.set(clip, { gainSource: sourceNode, gainNode })
        this.adjustSourceGain(clip)
      }
      return true
    })
  }

  private destroySources(clipsToKeep: Audible[] = []): void {
    const sourceClips = [...this.sourcesByClip.keys()]
    const clipsToRemove = sourceClips.filter(clip => !clipsToKeep.includes(clip))
    clipsToRemove.forEach(clip => {
      const source = this.sourcesByClip.get(clip)
      if (!source) return

      const { gainSource, gainNode } = source
      gainNode.disconnect(Cache.audibleContext.destination)
      gainSource.disconnect(gainNode)
    })
    clipsToRemove.forEach(clip => this.sourcesByClip.delete(clip))
  }

  private drawBackground() : void {
    Cache.visibleContext.clear()
    if (!this.backcolor) return

    Cache.visibleContext.drawFill(pixelColor(this.backcolor))
  }

  private _gain = Default.mash.gain

  get gain() : number { return this._gain }

  set gain(value : number) {
    if (this._gain === value) return

    this._gain = value

    if (this.playing) {
      [...this.sourcesByClip.keys()].forEach(clip => this.adjustSourceGain(clip))
    }
    Cache.audibleContext.emit(EventType.Volume)
  }


  playing = false

  quantize = Default.mash.quantize

  get seconds() : number {
    const ellapsed = Cache.audibleContext.currentTime - this.startedContextAt
    return ellapsed + this.startedMashAt
  }

  private sourcesByClip = new Map<Audible, Source>()

  startContext(): void {
    // console.log(this.constructor.name, "startContext")
    if (this.bufferSource) throw Errors.internal + 'bufferSource startContext'
    if (this.playing) throw Errors.internal + 'playing'

    const buffer = Cache.audibleContext.createBuffer(1)
    this.bufferSource = Cache.audibleContext.createBufferSource(buffer)
    this.bufferSource.loop = true
    this.bufferSource.connect(Cache.audibleContext.destination)
    this.bufferSource.start(0)
  }

  startPlaying(time : Time, clips: Audible[]) : boolean {
    if (!this.bufferSource) throw Errors.internal + 'bufferSource startPlaying'
    if (this.playing) throw Errors.internal + 'playing'

    const { seconds } = time
    this.playing = true
    this.startedMashAt = seconds

    this.startedContextAt = Cache.audibleContext.currentTime
    console.log(this.constructor.name, "startPlaying startedContextAt", this.startedContextAt)

    if (!this.createSources(clips)) {
      this.stopPlaying()
      return false
    }
    // console.log(this.constructor.name, "startPlaying", this.startedMashAt, this.startedContextAt)
    return true
  }

  // position of masher (in seconds) when startPlaying called
  private startedMashAt = 0

  // currentTime of context (in seconds) was created when startPlaying called
  private startedContextAt = 0

  stopPlaying(): void {
    // console.log(this.constructor.name, "stopPlaying")
    if (!this.playing) return

    this.playing = false
    if (this.bufferSource) this.bufferSource.stop()

    this.destroySources()
    this.startedMashAt = 0
    this.startedContextAt = 0

    if (!this.bufferSource) return

    this.bufferSource.disconnect(Cache.audibleContext.destination)
    delete this.bufferSource
  }
}

export { Composition }
