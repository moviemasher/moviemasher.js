import { CommandType, DefinitionType, DefinitionTypes, EventType, TrackType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Any, InputCommand, InputCommandPromise, Interval, JsonObject, LoadPromise } from "../../declarations"
import { Default } from "../../Setup/Default"
import { Is } from "../../Utilities/Is"
import { TimeRange } from "../../Utilities/TimeRange"
import { Time } from "../../Utilities/Time"
import { Track, TrackClass, TrackObject, TrackOptions } from "../Track"
import { Definition, DefinitionTimes } from "../Definition/Definition"
import { Clip, ClipDefinition } from "../Mixin/Clip/Clip"
import { Visible } from "../Mixin/Visible/Visible"
import { Audible } from "../Mixin/Audible/Audible"
import { Factory } from "../../Factory"
import { Composition } from "../../Playing/Composition/Composition"
import { ChangeAction } from "../../Editing/Action/ChangeAction"
import { InstanceBase } from "../Instance"
import { Mash, MashDefinition, MashOptions } from "./Mash"
import { Id } from "../../Utilities/Id"
import { Definitions } from "../Definitions/Definitions"
import { Action } from "../../Editing/Action/Action"
import { Cache } from "../../Loading/Cache"

interface TimeRangeClips {
  clips: Clip[]
  timeRange: TimeRange
}
class MashClass extends InstanceBase implements Mash {
  constructor(...args: Any[]) {
    super(...args)
    this._id ||= Id()


    const object = args[0] || {}
    const {
      audio,
      backcolor,
      label,
      loop,
      media,
      quantize,
      video,
      buffer,
      gain,
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

      return Factory[definitionType].definition(definition)
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

    this.setDrawInterval()
    // console.debug(this.constructor.name, "constructor", this.identifier, this)
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
    Cache.audibleContext.emit(EventType.Track)
    return track
  }

  private assureClipsHaveFrames(clips: Clip[]): void {
    clips.filter(clip => !Is.positive(clip.frames)).forEach(clip => {
      const definition = <ClipDefinition>clip.definition
      clip.frames = definition.frames(this.quantize)
    })
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

  private bufferStart() {
    if (this._bufferTimer) return

    this._bufferTimer = setInterval(() => {
      // console.debug(this.constructor.name, "bufferTimer calling load")
      this.loadPromise
    }, Math.round((this.buffer * 1000) / 2))
  }

  private bufferStop() {
    if (!this._bufferTimer) return

    clearInterval(this._bufferTimer)
    delete this._bufferTimer
  }

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

  clearDrawInterval():void {
    if (this.drawInterval) {
      clearInterval(this.drawInterval)
      this.drawInterval = undefined
    }
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

  clipsVisible(start: Time, end?: Time): Visible[] {
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

  private clipsVisibleInTimeRange(timeRange: TimeRange): Visible[] {
    const range = timeRange.scale(this.quantize)
    return this.clipsVideo.filter(clip => this.clipIntersects(clip, range))
  }

  private compositeAudible(clips? : Audible[]): boolean {
    const audibleClips = clips || this.clipsAudibleInTimeRange(this.timeRangeToBuffer)
    return this.composition.compositeAudible(audibleClips)
  }

  private compositeAudibleClips(clips: Clip[]): void {
    if (this._paused) return

    const audibleClips = clips.filter(clip => clip.audible && !clip.muted)
    if (audibleClips.length) this.compositeAudible(<Audible[]> audibleClips)
  }

  private _composition?: Composition

  get composition(): Composition {
    if (!this._composition) {
      const options = {
        backcolor: this.backcolor,
        buffer: this.buffer,
        gain: this.gain,
        quantize: this.quantize,
      }
      this._composition = new Composition(options)
    }
    return this._composition
  }

  compositeVisible(): void {
    const { time } = this
    this.composition.compositeVisible(time, this.clipsVisibleAtTime(time))
  }

  compositeVisibleRequest(clips?: Visible[]): void {
    const { time, composition } = this
    composition.compositeVisibleRequest(time, clips || this.clipsVisibleAtTime(time))
  }

  declare definition: MashDefinition

  destroy(): void {
    this.paused = true
    this.clearDrawInterval()
    delete this._composition
  }

  private drawInterval?: Interval

  private drawTime(time: Time): void {
    const timeChange = time !== this.time
    this.drawnTime = time
    this.compositeVisibleRequest()
    Cache.audibleContext.emit(timeChange ? EventType.Time : EventType.Loaded)
  }

  private drawWhileNotPlaying() {
    const now = performance.now()
    const ellapsed = now - this.drawnSeconds
    if (ellapsed < 1.0 / this.quantize) return

    this.drawnSeconds = now
    const { time } = this
    const clips = this.clipsVisible(time)
    const streamableClips = clips.filter(clip => clip.definition.streamable)
    if (!streamableClips.length) return

    const loading = clips.some(clip => clip.clipUrls(this.quantize, time).some(url =>
      !Cache.cached(url)
    ))
    if (loading) return

    this.compositeVisibleRequest()
  }

  private drawWhilePlaying() {
    // what time does the audio context think it is?
    const { seconds } = this.composition

    // what time would masher consider to be in next frame?
    const nextFrameTime = this.time.withFrame(this.time.frame + 1)

    // are we beyond the end of mash?
    if (seconds >= this.endTime.seconds) {

      // should we loop back to beginning?
      if (this.loop) this.seekToTime(this.time.withFrame(0))
      else {
        this.paused = true
        Cache.audibleContext.emit(EventType.Ended)
      }
    } else {

      // are we at or beyond the next frame?
      if (seconds >= nextFrameTime.seconds) {

        const compositionTime = Time.fromSeconds(seconds, this.time.fps)
        const difference = compositionTime.frame - this.time.frame
        if (difference > 1) console.debug(this.constructor.name, "drawWhilePlaying dropped frames", difference - 1)
        // go to where the audio context thinks we are
        this.drawTime(compositionTime)
      }
    }
  }

  drawnSeconds = 0

  drawnTime?: Time

  get duration(): number { return this.endTime.seconds }

  private emitIfFramesChange(method: () => void): void {
    const origFrames = this.frames
    method()
    const { frames } = this
    if (origFrames !== frames) {
      Cache.audibleContext.emit(EventType.Duration)
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
    Cache.audibleContext.emit(EventType.Action)

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

  private handleDrawInterval(): void {
    if (this._playing) this.drawWhilePlaying()
    else this.drawWhileNotPlaying()
  }

  private seqmentsAtTimes(type: CommandType, start: Time, end?: Time): TimeRangeClips[] {
    const fullRangeClips = this.clipsAtTimes(start, end)
    const startTime = start.scale(this.quantize)
    if (!end) return [{ clips: fullRangeClips, timeRange: TimeRange.fromTime(startTime) }]

    const result: TimeRangeClips[] = []

    const endTime = end.scale(this.quantize)
    const fullRange = TimeRange.fromTimes(startTime, endTime)
    const { times } = fullRange
    let identifiers = '~'
    let timeRangeClips: TimeRangeClips

    times.forEach(time => {
      const timeRange = TimeRange.fromTime(time)
      const clips = this.filterIntersecting(fullRangeClips, timeRange)
      const ids = clips.map(clip => clip.identifier).join('~')
      if (identifiers === ids) {
        timeRangeClips.timeRange = timeRangeClips.timeRange.addFrames(1)
      } else {
        identifiers = ids
        timeRangeClips = { timeRange, clips }
        result.push(timeRangeClips)
      }
    })


    return result
  }

  private inputCommand(type: CommandType, start: Time, end?: Time): InputCommand {
    const segments = this.seqmentsAtTimes(type, start, end)
    return segments.map(({clips, timeRange}) => {
      const inputCommand: InputCommand = { inputs: []}

      return inputCommand
    })
  }

  inputCommandPromise(type: CommandType, start: Time, end?: Time): InputCommandPromise {
    const promise: InputCommandPromise = new Promise(resolve => {
      const clips = this.clipsAtTimes(start, end)
      const loads = clips.map(clip => clip.loadClip(this.quantize, start, end))
      const promises = loads.filter(Boolean)
      if (promises.length) Promise.all(promises).then(() => {
        resolve(this.inputCommand(type, start, end))
      })
      else resolve(this.inputCommand(type, start, end))
    })
    return promise
  }
  get loadPromise(): LoadPromise | undefined {
    const [start, end] = this.startAndEnd
    // console.log(this.constructor.name, "load", start, end)
    const clips = this.clipsAtTimes(start, end)
    const loads = clips.map(clip => clip.loadClip(this.quantize, start, end))
    const promises = loads.filter(Boolean)
    if (promises.length) return Promise.all(promises).then(() => {
      this.compositeAudibleClips(clips)
    })

    this.compositeAudibleClips(clips)
  }

  get loadUrls(): string[] {
    const [start, end] = this.startAndEnd
    // console.log(this.constructor.name, "load", start, end)
    const clips = this.clipsAtTimes(start, end)
    const urls = clips.flatMap(clip => clip.clipUrls(this.quantize, start, end))

    // console.trace(this.constructor.name, "loadUrls", this.identifier, start, end, urls)
    return urls
  }

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
      this.bufferStop()
      if (this._bufferTimer) {
        clearInterval(this._bufferTimer)
        delete this._bufferTimer
      }
      Cache.audibleContext.emit(EventType.Pause)
    } else {
      this.composition.startContext()
      this.bufferStart()
      const promise = this.loadPromise
      if (promise) promise.then(() => { this.playing = true })
      else this.playing = true
      // console.log("Mash emit", EventType.Play)
      Cache.audibleContext.emit(EventType.Play)
    }
  }

  private _playing = false

  get playing() : boolean { return this._playing }

  set playing(value : boolean) {
    // console.trace(this.constructor.name, "set playing", value)
    if (this._playing !== value) {
      this._playing = value
      if (value) {
        const clips = this.clipsAudibleInTimeRange(this.timeRangeToBuffer)
        if (!this.composition.startPlaying(this.time, clips)) {
          // console.log(this.constructor.name, "set playing", value, "audio not cached", this.time, clips.length)
          // audio was not cached

          this._playing = false
          return
        }
        Cache.audibleContext.emit(EventType.Playing)
      } else this.composition.stopPlaying()
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
    Cache.audibleContext.emit(EventType.Track)
  }

  private restartAfterStop(time:Time, paused:boolean, seeking?: boolean): void {
     if (time === this.time) { // otherwise we must have gotten a seek call
        if (seeking) {
          delete this.seekTime
          Cache.audibleContext.emit(EventType.Seeked)
        }
        this.drawTime(time)
        if (!paused) {
          this.composition.startContext()
          this.playing = true
        }
      }
  }

  quantize = Default.mash.quantize

  private seekTime? : Time

  seekToTime(time: Time): LoadPromise | undefined {
    // console.debug(this.constructor.name, "seekToTime", time)
    if (this.seekTime !== time) {
      this.seekTime = time
      Cache.audibleContext.emit(EventType.Seeking)
      Cache.audibleContext.emit(EventType.Time)
    }
    return this.stopLoadAndDraw(true)
  }

  setDrawInterval():void {
    this.clearDrawInterval()
    this.drawInterval = setInterval(() => { this.handleDrawInterval()}, 500 / this.time.fps)
  }

  get stalled() : boolean { return !this.paused && !this.playing }

  get startAndEnd(): Time[] {
    const { time } = this
    const times = [time]
    if (!this.paused) times.push(time.add(this.bufferTime))
    return times
  }

  private stopLoadAndDraw(seeking? : boolean) : LoadPromise | undefined {
    const { time, paused, playing } = this

    if (playing) this.playing = false
    const promise = this.loadPromise
    if (promise) return promise.then(() => { this.restartAfterStop(time, paused, seeking) })
    this.restartAfterStop(time, paused, seeking)
  }

  get time() : Time {
    return this.seekTime || this.drawnTime || Time.fromArgs(0, this.quantize)
  }

  get timeRange(): TimeRange {
    return TimeRange.fromTime(this.time, this.endTime.scale(this.time.fps).frame)
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

  video : Track[] = []
}

export { MashClass }
