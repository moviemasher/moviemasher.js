import { DefinitionType, DefinitionTypes, EventType, TrackType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Any, Interval, JsonObject, LoadPromise } from "../../declarations"
import { Default } from "../../Setup/Default"
import { Is } from "../../Utilities/Is"
import { TimeRange } from "../../Utilities/TimeRange"
import { Time } from "../../Utilities/Time"
import { Track, TrackClass, TrackObject, TrackOptions } from "../Track"
import { Definition, DefinitionTimes } from "../Definition/Definition"
import { Clip, ClipDefinition } from "../Mixin/Clip/Clip"
import { Visible } from "../Mixin/Visible/Visible"
import { Audible } from "../Mixin/Audible/Audible"
import { MovieMasher } from "../../MovieMasher"
import { AudibleContext } from "../../Playing/AudibleContext"
import { VisibleContext } from "../../Playing/VisibleContext"
import { ContextFactory } from "../../Playing/ContextFactory"
import { Composition } from "../../Playing/Composition/Composition"
import { ChangeAction } from "../../Editing/Action/ChangeAction"
import { InstanceClass } from "../Instance"
import { Mash, MashDefinition, MashOptions } from "./Mash"
import { Id } from "../../Utilities/Id"
import { Definitions } from "../Definitions/Definitions"
import { Action } from "../../Editing/Action/Action";
import { TrackRange } from "../../Utilities/TrackRange"

class MashClass extends InstanceClass implements Mash {
  constructor(...args: Any[]) {

    super(...args)
    this._id ||= Id()

    // console.log("Mash constructor", this.id)

    const object = args[0] || {}
    const {
      audio,
      backcolor,
      label,
      loop,
      media,
      quantize,
      video,
      audibleContext,
      buffer,
      gain,
      visibleContext,
    } = <MashOptions>object

    if (typeof loop === "boolean") this.loop = loop
    if (quantize && Is.aboveZero(quantize)) this.quantize = quantize
    if (label && Is.populatedString(label)) this.label = label
    if (backcolor && Is.populatedString(backcolor)) this._backcolor = backcolor

    if (media) media.forEach(definition => {
      const { id: definitionId, type } = definition
      if (!(type && Is.populatedString(type))) throw Errors.type + 'Mash.constructor media'

      const definitionType = <DefinitionType>type
      if (!DefinitionTypes.includes(definitionType)) throw Errors.type + definitionType

      if (!(definitionId && Is.populatedString(definitionId))) {
        throw Errors.invalid.definition.id + JSON.stringify(definition)
      }

      return MovieMasher[definitionType].definition(definition)
    })

    if (audio) this.audio.push(...audio.map((track, index) =>
      new TrackClass(this.trackOptions(track, index, TrackType.Audio))
    ))
    else this.audio.push(new TrackClass({ type: TrackType.Audio }))
    if (video) this.video.push(...video.map((track, index) =>
      new TrackClass(this.trackOptions(track, index, TrackType.Video))
    ))
    else this.video.push(new TrackClass({ type: TrackType.Video }))

    if (buffer && Is.aboveZero(buffer)) this.buffer = buffer
    if (typeof gain !== "undefined" && Is.positive(gain)) this._gain = gain

    if (audibleContext) this._audibleContext = audibleContext
    if (visibleContext) {
      // console.log("Mash constructor visibleContext")
      this._visibleContext = visibleContext
    }
  }

  addClipsToTrack(clips: Clip[], trackIndex = 0, insertIndex = 0, frames? : number[]): void {
    // console.log(this.constructor.name, "addClipsToTrack", trackIndex, insertIndex)
    this.assureClipsHaveFrames(clips)
    const [clip] = clips
    const newTrack = this.clipTrackAtIndex(clip, trackIndex)
    if (!newTrack) throw Errors.invalid.track

    const oldTrack = Is.positive(clip.track) && this.clipTrack(clip)

    this.emitIfFramesChange(() => {
      if (oldTrack && oldTrack !== newTrack) {
        // console.log("addClipsToTrack", newTrack.index, oldTrack.index)
        oldTrack.removeClips(clips)
      }
      if (frames) clips.forEach((clip, index) => { clip.frame = frames[index] })
      newTrack.addClips(clips, insertIndex)
    })
  }

  addTrack(trackType: TrackType): Track {
    const array = this[trackType]
    // console.log("addTrack", trackType, array.length)
    const options = { type: trackType, index: array.length }
    const track = new TrackClass(options)
    array.push(track)
    this.visibleContext.emit(EventType.Track)
    return track
  }

  private assureClipsHaveFrames(clips: Clip[]): void {
    clips.filter(clip => !Is.positive(clip.frames)).forEach(clip => {
      const definition = <ClipDefinition>clip.definition
      const duration = definition.duration
      clip.frames = Time.fromSeconds(duration, this.quantize, 'floor').frame
    })
  }

  private _audibleContext?: AudibleContext

  get audibleContext(): AudibleContext {
    if (!this._audibleContext) {
      this._audibleContext = ContextFactory.audible()
      if (this._composition) this.composition.audibleContext = this._audibleContext
    }
    return this._audibleContext
  }

  set audibleContext(value: AudibleContext) {
    if (this._audibleContext !== value) {
      this._audibleContext = value
      if (this._composition) this.composition.audibleContext = value
    }
  }

  audio: Track[] = []

  private _backcolor = Default.mash.backcolor

  get backcolor(): string { return this._backcolor }

  set backcolor(value: string) {
    this._backcolor = value
    if (this._composition) this.composition.backcolor = value
  }
  private _buffer = Default.mash.buffer

  get buffer(): number { return this._buffer }

  set buffer(value: number) {
    if (!Is.aboveZero(value)) throw Errors.invalid.argument + 'buffer ' + value

    if (this._buffer !== value) {
      this._buffer = value
      if (this._composition) this.composition.buffer = value
    }
  }

  get bufferFrames(): number { return this.buffer * this.quantize }

  private get bufferTime(): Time { return Time.fromSeconds(this.buffer) }

  private _bufferTimer?: Interval

  changeClipFrames(clip: Clip, value: number): void {
    let limitedValue = Math.max(1, value) // frames value must be > 0

    const max = clip.maxFrames(this.quantize) // only audible returns nonzero
    if (Is.aboveZero(max)) limitedValue = Math.min(max, limitedValue)

    const track = this.clipTrack(clip)
    this.emitIfFramesChange(() => {
      clip.frames = limitedValue
      track.sortClips(track.clips)
    })
  }

  changeClipTrimAndFrames(clip: Audible, value: number, frames: number): void {
    let limitedValue = Math.max(0, value)

    const max = clip.maxFrames(this.quantize, 1) // do not remove last frame
    if (Is.aboveZero(max)) limitedValue = Math.min(max, limitedValue)

    const newFrames = frames - limitedValue
    const track = this.clipTrack(clip)
    this.emitIfFramesChange(() => {
      clip.trim = limitedValue
      clip.frames = newFrames
      track.sortClips(track.clips)
    })
  }

  clipIntersects(clip: Clip, range: TimeRange): boolean {
    return clip.timeRange(this.quantize).intersects(range)
  }

  clipTrack(clip: Clip): Track {
    return this.clipTrackAtIndex(clip, clip.track)
  }

  clipTrackAtIndex(clip: Clip, index = 0): Track {
    return this.trackOfTypeAtIndex(clip.trackType, index)
  }

  get clips(): Clip[] { return this.clipsInTracks() }

  //   const rangeTracks = this.tracksInRange(trackRange)
  //   const inTracks = this.clipsInTracks(rangeTracks)
  //   if (!timeRange) return inTracks

  //   return this.filterIntersecting(inTracks, timeRange)
  // }


  private clipsAtTimes(start: Time, end?: Time): Clip[] {
    const objects: Clip[] = this.clipsVisible(start, end)
    if (end) objects.push(...this.clipsAudible(start, end))
    return [...new Set(objects)]
  }

  private clipsAudible(start: Time, end?: Time): Audible[] {
    const range = end && TimeRange.fromTimes(start, end)
    return this.clipsAudibleInTracks.filter(clip => {
      const clipRange = clip.timeRange(this.quantize)
      if (range) return clipRange.intersects(range)

      return clipRange.intersectsTime(start)
    })
  }

  private clipsInTracks(tracks?: Track[]): Clip[] {
    const clipTracks = tracks || this.tracks
    return clipTracks.map(track => track.clips).flat()
  }

  private filterIntersecting(clips: Clip[], timeRange: TimeRange): Clip[] {
    const range = timeRange.scale(this.quantize)
    return clips.filter(clip => this.clipIntersects(clip, range))

  }
  private get clipsAudibleInTracks(): Audible[] {
    return <Audible[]> this.clipsInTracks().filter(clip => clip.audible && !clip.muted)
  }

  private clipsAudibleInTimeRange(timeRange: TimeRange): Audible[] {
    return <Audible[]> this.filterIntersecting(this.clipsAudibleInTracks, timeRange)
  }

  private get clipsVideo(): Visible[] { return <Visible[]>this.video.flatMap(track => track.clips) }

  private clipsVisible(start: Time, end?: Time): Visible[] {
    const range = end && TimeRange.fromTimes(start, end)
    return this.clipsVideo.filter(clip => {
      const clipRange = clip.timeRange(this.quantize)
      if (range) return clipRange.intersects(range)

      return clipRange.intersectsTime(start)
    })
  }

  private clipsVisibleAtTime(time: Time): Visible[] {
    return this.clipsVisibleInTimeRange(TimeRange.fromTime(time))
  }

  clipsVisibleSlice(frame: number, frames: number): Visible[] {
    const range = TimeRange.fromArgs(frame, this.quantize, frames)
    return this.clipsVisibleInTimeRange(range)
  }

  private clipsVisibleInTimeRange(timeRange: TimeRange): Visible[] {
    const range = timeRange.scale(this.quantize)
    return this.clipsVideo.filter(clip => this.clipIntersects(clip, range))
  }

  compositeAudible(): boolean {
    const clips = this.clipsAudibleInTimeRange(this.timeRangeToBuffer)
    return this.composition.compositeAudible(clips)
  }

  private _composition?: Composition

  get composition(): Composition {
    if (!this._composition) {
      const options = {
        audibleContext: this.audibleContext,
        backcolor: this.backcolor,
        buffer: this.buffer,
        gain: this.gain,
        quantize: this.quantize,
        visibleContext: this.visibleContext,
      }
      this._composition = new Composition(options)
    }
    return this._composition
  }

  compositeVisible(): void {
    const { time } = this
    this.composition.compositeVisible(time, this.clipsVisibleAtTime(time))
  }

  compositeVisibleRequest(): void {
    const { time } = this
    this.composition.compositeVisibleRequest(time, this.clipsVisibleAtTime(time))
  }

  declare definition: MashDefinition

  destroy(): void {
    delete this._visibleContext
    delete this._audibleContext
    delete this._composition
  }

  private _drawAtInterval?: Interval

  private drawAtInterval(): void {
    // console.log(this.constructor.name, "drawAtInterval playing: ", this._playing)
    if (!this._playing) return
    const time = this.time.withFrame(this.time.frame + 1)
    const seconds = this.playing ? this.composition.seconds : time.seconds
    if (seconds < this.endTime.seconds) {
      if (seconds >= time.seconds) this.drawTime(time)
    } else {
      // console.log(this.constructor.name, "drawAtInterval finished at", seconds, this.endTime.seconds)
      if (this.loop) this.seekToTime(this.time.withFrame(0))
      else {
        this.paused = true
        this.visibleContext.emit(EventType.Ended)
      }
    }
  }

  drawnTime?: Time

  private drawTime(time: Time): void {
    const timeChange = time !== this.time
    this.drawnTime = time
    this.compositeVisibleRequest()
    this.visibleContext.emit(timeChange ? EventType.Time : EventType.Loaded)
  }

  get duration(): number { return Time.fromArgs(this.frames, this.quantize).seconds }

  private emitIfFramesChange(method: () => void): void {
    const origFrames = this.frames
    method()
    const { frames } = this
    if (origFrames !== frames) {
      this.visibleContext.emit(EventType.Duration)
      if (this.frame > frames) this.seekToTime(Time.fromArgs(frames, this.quantize))
    }
  }

  get endTime(): Time { return Time.fromArgs(this.frames, this.quantize) }

  get frame(): number { return this.time.scale(this.quantize, "floor").frame }

  get frames(): number {
    return Math.max(0, ...this.tracks.map(track => track.frames))
  }

  private _gain = Default.mash.gain

  get gain(): number { return this._gain }

  set gain(value: number) {
    if (!Is.positive(value)) throw Errors.invalid.argument + 'gain ' + value

    if (this._gain !== value) {
      this._gain = value
      this.composition.gain = value
    }
  }

  handleAction(action: Action): void {
    this.visibleContext.emit(EventType.Action, { action })

    if (action instanceof ChangeAction) {
      const changeAction = <ChangeAction>action
      const { property } = changeAction
      if (property === "gain") {
        if (this.playing && Is.aboveZero(this.gain)) {
          this.composition.adjustSourceGain(<Audible>changeAction.target)
        }
        return
      }
    }
    this.stopLoadAndDraw()
  }
  get startAndEnd(): Time[] {
    const { time } = this
    const times = [time]
    if (!this.paused) times.push(time.add(this.bufferTime))
    return times
  }

  load(): LoadPromise {
    const [start, end] = this.startAndEnd
    // console.log(this.constructor.name, "load", start, end)
    const promises = this.clipsAtTimes(start, end).map(clip =>
      clip.load(this.quantize, start, end)
    )
    return Promise.all(promises).then()
  }

  loadAndComposite(): void { this.load().then(() => { this.compositeVisibleRequest() }) }

  get loadedDefinitions(): DefinitionTimes {
    const map = <DefinitionTimes>new Map()
    const [start, end] = this.startAndEnd
    this.clipsAtTimes(start, end).forEach(clip => {
      const { definitions } = clip
      const times = [clip.definitionTime(this.quantize, start)]
      if (end) times.push(clip.definitionTime(this.quantize, end))

      definitions.forEach(definition => {
        if (!map.has(definition)) map.set(definition, [])
        const definitionTimes = map.get(definition)
        if (!definitionTimes) throw Errors.internal

        definitionTimes.push(times)
      })
    })
    return map
  }

  loop = false

  maxTracks(type?: TrackType): number {
    return type ? this[type].length : this.audio.length + this.video.length
  }

  get media() : Definition[] {
    return [...new Set(this.clipsInTracks().flatMap(clip => clip.definitions))]
  }

  private _paused = true

  get paused() : boolean { return this._paused }

  set paused(value : boolean) {
    const forcedValue = value || !this.frames
    // console.log(this.constructor.name, "set paused", forcedValue)
    if (this._paused === forcedValue) return

    this._paused = forcedValue
    if (forcedValue) {
      this.playing = false
      if (this._bufferTimer) {
        clearInterval(this._bufferTimer)
        delete this._bufferTimer
      }
      // console.log("Mash emit", EventType.Pause)

      this.visibleContext.emit(EventType.Pause)
    } else {
      this.composition.startContext()
      if (!this._bufferTimer) {
        this._bufferTimer = setInterval(() => { this.load() }, Math.round(this.buffer / 2))
      }
      this.load().then(() => { this.playing = true })
      // console.log("Mash emit", EventType.Play)
      this.visibleContext.emit(EventType.Play)
    }

  }

  private _playing = false

  get playing() : boolean { return this._playing }

  set playing(value : boolean) {
    // console.log(this.constructor.name, "set playing", value)
    if (this._playing !== value) {
      if (value) {

        const clips = this.clipsAudibleInTimeRange(this.timeRangeToBuffer)
        if (!this.composition.startPlaying(this.time, clips)) {
          // console.log(this.constructor.name, "set playing", value, "audio not cached", this.time, clips.length)
          // audio was not cached
          return
        }
        this._drawAtInterval = setInterval(() => { this.drawAtInterval()}, 500 / this.time.fps)
        this.visibleContext.emit(EventType.Playing)
      } else {
        this.composition.stopPlaying()
        if (this._drawAtInterval) {
          clearInterval(this._drawAtInterval)
          delete this._drawAtInterval
        }
      }
      this._playing = value
    }
  }

  removeClipsFromTrack(clips : Clip[]) : void {
    const [clip] = clips
    const track = this.clipTrack(clip)
    this.emitIfFramesChange(() => { track.removeClips(clips) })
  }

  removeTrack(trackType : TrackType) : void {
    const array = this[trackType]
    this.emitIfFramesChange(() => { array.pop() })
    this.visibleContext.emit(EventType.Track)
  }

  quantize = Default.mash.quantize

  private seekTime? : Time

  seekToTime(time: Time) : LoadPromise {
    if (this.seekTime !== time) {
      this.seekTime = time
      // console.log("seekToTime", time)
      this.visibleContext.emit(EventType.Seeking)
      this.visibleContext.emit(EventType.Time)
    }
    return this.stopLoadAndDraw(true)
  }

  get stalled() : boolean { return !this.paused && !this.playing }

  private stopLoadAndDraw(seeking? : boolean) : LoadPromise {
    const { time, paused, playing } = this

    if (playing) this.playing = false
    return this.load().then(() => {
      if (time === this.time) { // otherwise we must have gotten a seek call
        if (seeking) {
          delete this.seekTime
          this.visibleContext.emit(EventType.Seeked)
        }
        this.drawTime(time)
        if (!paused) {
          this.composition.startContext()
          this.playing = true
        }
      }
    })
  }

  get time() : Time {
    return this.seekTime || this.drawnTime || Time.fromArgs(0, this.quantize)
  }

  get timeRange(): TimeRange {
    const time = Time.fromArgs(this.frames, this.quantize)
    return TimeRange.fromTime(this.time, time.scale(this.time.fps).frame)
  }

  get timeRangeToBuffer() : TimeRange {
    const { time, quantize, buffer, paused } = this
    if (paused) {
      const singleFrame = TimeRange.fromArgs(time.scale(quantize, 'floor').frame, quantize, 1)
      // console.log(this.constructor.name, "timeRangeToBuffer paused", singleFrame)
      return singleFrame
    }

    const frames = TimeRange.fromTimes(time, Time.fromSeconds(buffer + time.seconds, time.fps))
    // console.log(this.constructor.name, "timeRangeToBuffer !PAUSED", frames)

    return frames
  }

  toJSON() : JsonObject {
    return {
      label: this.label,
      quantize: this.quantize,
      backcolor: this.backcolor || "",
      id: this.id,
      media: this.media,
      audio: this.audio,
      video: this.video,
    }
  }

  trackOfTypeAtIndex(type : TrackType, index = 0) : Track {
    if (!Is.positive(index)) {
      console.error(Errors.invalid.track, index, index?.constructor.name)
      throw Errors.invalid.track
    }
    return this[type][index]
  }

  private trackOptions(object : TrackObject, index : number, type : TrackType) : TrackOptions {
    const { clips } = object
    if (!(clips && Is.populatedArray(clips))) return { type, index }

    const objects = clips.map(clip => {
      const { id } = clip
      if (!id) throw Errors.id

      const definition = Definitions.fromId(id)
      const clipWithTrack = { track: index, ...clip }
      return <Clip> definition.instanceFromObject(clipWithTrack)
    })
    this.assureClipsHaveFrames(objects)
    return { type, index, clips: objects }
  }

  get tracks() : Track[] { return Object.values(TrackType).map(av => this[av]).flat() }

  // tracksInRange(trackRange?: TrackRange): Track[] | undefined {
  //   if (!trackRange) return
  //   const { type } = trackRange
  //   const range = trackRange.relative ? trackRange.withMax(this.maxTracks(type)) : trackRange

  //   const inRange = []
  //   if (type !== TrackType.Video) {
  //     inRange.push(...this.audio.slice(range.first, range.last))
  //   }
  //   if (type !== TrackType.Audio) {
  //     inRange.push(...this.video.slice(range.first, range.last))
  //   }
  //   return inRange
  // }

  video : Track[] = []

  private _visibleContext? : VisibleContext

  get visibleContext() : VisibleContext {
    if (!this._visibleContext) {
      // console.log("Mash get visibleContext creating")
      this._visibleContext = ContextFactory.visible()

      if (this._composition) this.composition.visibleContext = this._visibleContext
    }
    return this._visibleContext
  }

  set visibleContext(value : VisibleContext) {
    // console.log("Mash set visibleContext", value)
    if (this._visibleContext !== value) {
      this._visibleContext = value
      if (this._composition) this.composition.visibleContext = value
    }
  }
}

export { MashClass }
