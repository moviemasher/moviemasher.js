import {
  Interval, LoadPromise, Size, UnknownObject, VisibleContextData, GraphFiles
} from "../../declarations"
import {
  AVType, DefinitionType, EventType, GraphType, TrackType
} from "../../Setup/Enums"
import { Definition } from "../../Base/Definition"
import { EmptyMethod } from "../../Setup/Constants"
import { Errors } from "../../Setup/Errors"
import { Default } from "../../Setup/Default"
import { colorValid } from "../../Utility/Color"
import { idGenerate } from "../../Utility/Id"
import { isAboveZero, isPopulatedString, isPositive } from "../../Utility/Is"
import { sortByLayer, sortByTrack } from "../../Utility/Sort"
import { Emitter } from "../../Helpers/Emitter"
import { Time, Times, TimeRange } from "../../Helpers/Time/Time"
import { Preloader } from "../../Preloader/Preloader"
import { Factory } from "../../Definitions/Factory/Factory"
import { Clip, Clips } from "../../Mixin/Clip/Clip"
import { Visible } from "../../Mixin/Visible/Visible"
import { Audible, AudibleContent, AudibleContents } from "../../Mixin/Audible/Audible"
import { Track, TrackArgs, TrackObject } from "../../Media/Track/Track"
import { Transition } from "../../Media/Transition/Transition"
import { ChangeAction } from "../../Editor/MashEditor/Actions/Action/ChangeAction"
import { Action } from "../../Editor/MashEditor/Actions/Action/Action"
import { Composition } from "./Composition/Composition"
import { Contents, Mash, MashArgs } from "./Mash"
import { FilterGraphObject, FilterGraphOptions } from "./FilterGraph/FilterGraph"
import {
  Transformable, TransformableContent, TransformableContents
} from "../../Mixin/Transformable/Transformable"
import { FilterGraphs, FilterGraphsArgs } from "./FilterGraphs/FilterGraphs"
import { FilterGraphsClass } from "./FilterGraphs/FilterGraphsClass"
import { timeFromArgs, timeFromSeconds, timeRangeFromArgs, timeRangeFromTime, timeRangeFromTimes } from "../../Helpers/Time/TimeUtilities"


class MashClass implements Mash {
  constructor(args: MashArgs) {
    const {
      createdAt,
      tracks,
      backcolor,
      id,
      label,
      quantize,
      frame,
      definitions,
      ...rest
    } = args

    if (id) this._id = id
    Object.assign(this.data, rest)

    if (quantize && isAboveZero(quantize)) this.quantize = quantize
    if (label && isPopulatedString(label)) this.label = label
    if (backcolor && isPopulatedString(backcolor)) this._backcolor = backcolor
    if (createdAt) this.createdAt = createdAt
    if (frame) this._frame = frame
    let videoTrackCount = 0
    if (tracks) tracks.forEach(track => {
      const trackArgs: TrackArgs = {
        trackType: TrackType.Video,
        ...track, definitions, layer: this.trackCount(track.trackType)
      }
      const isVideoTrack = trackArgs.trackType === TrackType.Video
      if (isVideoTrack) videoTrackCount++

      if (typeof track.dense === 'undefined') {
        trackArgs.dense = videoTrackCount === 1
      }
      const instance = Factory.track.instance(trackArgs)
      instance.assureFrames(this.quantize)
      instance.sortClips()

      this.tracks.push(instance)
    })
    this.assureTrackOfType(TrackType.Video)
    this.assureTrackOfType(TrackType.Audio)
    this.tracks.sort(sortByLayer)
  }

  addClipToTrack(clip: Clip, trackIndex = 0, insertIndex = 0, frame? : number): void {
    const newTrack = this.clipTrackAtIndex(clip, trackIndex)
    if (!newTrack) throw Errors.invalid.track

    const oldTrack = isPositive(clip.track) && this.clipTrack(clip)

    newTrack.assureFrames(this.quantize, [clip])
    this.emitIfFramesChange(() => {
      if (oldTrack && oldTrack !== newTrack) {
        oldTrack.removeClip(clip)
      }
      if (typeof frame !== 'undefined') clip.frame = frame
      newTrack.addClip(clip, insertIndex)
    })
  }

  addTrack(trackType: TrackType): Track {
    const options : TrackObject = { trackType: trackType, layer: this.trackCount(trackType) }
    const track = Factory.track.instance(options)
    // console.log(this.constructor.name, "addTrack", track)
    this.tracks.push(track)
    this.tracks.sort(sortByLayer)
    this.emitter?.emit(EventType.Track)
    return track
  }

  private assureTrackOfType(trackType: TrackType): void {
     if (!this.trackCount(trackType)) {
      this.tracks.push(Factory.track.instance({ trackType: trackType }))
    }
  }

  private _backcolor = Default.mash.backcolor

  get backcolor(): string { return this._backcolor }

  set backcolor(value: string) {
    if (!colorValid(value)) throw Errors.invalid.value

    this._backcolor = value
    if (this._composition) this.composition.backcolor = value
  }

  private _buffer = Default.mash.buffer

  get buffer(): number { return this._buffer }

  set buffer(value: number) {
    if (!isAboveZero(value)) throw Errors.invalid.argument + 'buffer ' + value

    if (this._buffer !== value) {
      this._buffer = value
      if (this._composition) this.composition.buffer = value
    }
  }

  get bufferFrames(): number { return this.buffer * this.quantize }

  private bufferStart() {
    if (this._bufferTimer) return

    this._bufferTimer = setInterval(() => {
      this.loadPromiseUnlessBuffered
      this.compositeAudibleClips(this.clipsAudibleInTimeRange(this.timeToBuffer))

    }, Math.round((this.buffer * 1000) / 2))
  }

  private bufferStop() {
    if (!this._bufferTimer) return

    clearInterval(this._bufferTimer)
    delete this._bufferTimer
  }

  private get bufferTime(): Time { return timeFromSeconds(this.buffer) }

  private _bufferTimer?: Interval

  changeClipFrames(clip: Clip, value: number): void {
    let limitedValue = Math.max(1, value) // frames value must be > 0

    const max = clip.maxFrames(this.quantize) // only audible returns nonzero
    if (isAboveZero(max)) limitedValue = Math.min(max, limitedValue)

    const track = this.clipTrack(clip)
    this.emitIfFramesChange(() => {
      clip.frames = limitedValue
      track.sortClips(track.clips)
    })
  }

  changeClipTrimAndFrames(clip: Audible, value: number, frames: number): void {
    let limitedValue = Math.max(0, value)

    const max = clip.maxFrames(this.quantize, 1) // do not remove last frame
    if (isAboveZero(max)) limitedValue = Math.min(max, limitedValue)

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

  clipIntersects(clip: Clip, range: Time): boolean {
    if (!clip.frames) return true

    return clip.timeRange(this.quantize).intersects(range)
  }

  clipTrack(clip: Clip): Track {
    return this.clipTrackAtIndex(clip, clip.track)
  }

  clipTrackAtIndex(clip: Clip, index = 0): Track {
    return this.trackOfTypeAtIndex(clip.trackType, index)
  }

  get clips(): Clips { return this.clipsInTracks() }

  private clipsAudible(time: Time): Audible[] {
    return this.clipsAudibleInTracks.filter(clip => {
      return this.clipIntersects(clip, time)
    })
  }

  clipsInTimeOfType(time: Time, avType = AVType.Both): Clip[] {
    const clips: Clips = []
    if (avType !== AVType.Audio) clips.push(...this.clipsVisible(time))
    if (avType !== AVType.Video) clips.push(...this.clipsAudible(time))

    return clips
  }

  private clipsInTracks(tracks?: Track[]): Clips {
    const clipTracks = tracks || this.tracks
    return clipTracks.map(track => track.clips).flat()
  }

  private get clipsAudibleInTracks(): Audible[] {
    return <Audible[]> this.clipsInTracks().filter(clip => clip.audible && !clip.muted)
  }

  private clipsAudibleInTimeRange(timeRange: Time): Audible[] {
    return <Audible[]> this.filterIntersecting(this.clipsAudibleInTracks, timeRange)
  }

  private get clipsVideo(): Visible[] {
    const tracks = this.tracks.filter(track => track.trackType !== TrackType.Audio)
    return <Visible[]>tracks.flatMap(track => track.clips)
  }

  private clipsVisible(time: Time): Visible[] {
    return this.clipsVideo.filter(clip => {
      if (!clip.frames) return true

      return this.clipIntersects(clip, time)
    })
  }

  private compositeVisible(time: Time): void {
    const { composition, quantize } = this
    const graphType = GraphType.Canvas
    const args: FilterGraphsArgs = {
      preloading: false,
      times: [time],
      graphType,
      videoRate: quantize,
      size: this.imageSize,
      avType: AVType.Video,
      mash: this,
    }
    const filterGraphs = new FilterGraphsClass(args)
    const filterGraph = filterGraphs.filterGraphsVisible[0]
    const { filterChains } = filterGraph
    composition.drawBackground() // clear and fill with mash background color if defined
    filterChains.forEach(chain => {
      composition.visibleContext.draw(chain.visibleContext!.canvas)
    })
    this.emitter?.emit(EventType.Draw)
  }

  compositeVisibleRequest(time : Time) : void {
    requestAnimationFrame(() => this.compositeVisible(time))
  }

  private compositeAudibleClips(clips: Clips): void {
    if (this._paused) return

    const audibleClips = clips.filter(clip => clip.audible && !clip.muted)
    if (audibleClips.length) {
      this.composition.compositeAudible(<Audible[]>audibleClips)
    }
  }

  private _composition?: Composition

  get composition(): Composition {
    if (!this._composition) {
      const options = {
        backcolor: this.backcolor,
        buffer: this.buffer,
        gain: this.gain,
        quantize: this.quantize,
        emitter: this.emitter,
        preloader: this.preloader,
      }
      this._composition = new Composition(options)
    }
    return this._composition
  }

  contents(time: Time, avType = AVType.Both): Contents {
    const scaled = time.scale(this.quantize)
    const visibleByTrack: Record<number, Transformable> = {}
    const audibleByTrack: Record<number, Audible> = {}
    const transByTrack: Record<number, Transition> = {}
    const clips = this.clipsInTimeOfType(scaled, avType)
    //this.clipsInTimeRange(scaled, avType).sort(sortByTrack)
    // console.log(this.constructor.name, "contents", scaled, avType, clips.length)
    clips.forEach(clip => {
      const { track } = clip
      switch (clip.type) {
        case DefinitionType.Transition: {
          if (avType !== AVType.Audio) transByTrack[track] = clip as Transition
          break
        }
        case DefinitionType.Audio: {
          if (avType !== AVType.Video) audibleByTrack[track] = clip as Audible
          break
        }
        default: {
          if (avType === AVType.Audio) {
            if (clip.audible) audibleByTrack[track] = clip as Audible
          } else visibleByTrack[track] = clip as Transformable
        }
      }
    })
    const keys = [...Object.keys(visibleByTrack), ...Object.keys(audibleByTrack)]
    const tracks = keys.map(Number)
    const audibleContents: AudibleContents = []
    const visibleContents: TransformableContents = []
    tracks.forEach(track => {
      const visible = visibleByTrack[track]
      const audible = audibleByTrack[track]
      if (audible) {
        const audibleContent: AudibleContent = { audible, track }
        audibleContents.push(audibleContent)
      }
      if (visible) {
        const visibleContent: TransformableContent = { transformable: visible, track }
        visibleContents.push(visibleContent)
        const transition = transByTrack[track]
         if (transition) {
          visibleContent.transition = transition
          const other = visibleByTrack[track + 1]
          if (other) {
            delete visibleByTrack[track + 1]
            const visibleStartsAfterOther = visible.frame > other.frame
            const otherContent: TransformableContent = { transformable: other, transition, track: track + 1 }
            visibleContents.push(otherContent)
            if (visibleStartsAfterOther) {
              otherContent.from = true
              otherContent.track = track
              visibleContent.track = track + 1
            } else {
              visibleContent.from = true
              otherContent.track = track + 1
            }
          }
        }
      }
    })
    const contents: Contents = [...visibleContents, ...audibleContents].sort(sortByTrack)
    return contents
  }

  createdAt = ''

  data: UnknownObject = {}

  get definitions() : Definition[] {
    return [...new Set(this.clipsInTracks().flatMap(clip => clip.definitions))]
  }

  destroy(): void {
    this.paused = true
    this.clearDrawInterval()
    delete this._composition
  }

  draw(): void {
    const { time } = this
    this.compositeVisible(time)
  }

  private drawInterval?: Interval

  private drawRequest(): void {
    const { time } = this
    this.compositeVisibleRequest(time)
  }

  private drawTime(time: Time): void {
    const timeChange = time !== this.time
    this.drawnTime = time
    this.drawRequest()
    this.emitter?.emit(timeChange ? EventType.Time : EventType.Loaded)
  }

  private drawWhilePlayerNotPlaying() {
    const now = performance.now()
    const ellapsed = now - this.drawnSeconds
    if (ellapsed < 1.0 / this.quantize) return

    this.drawnSeconds = now
    const { time } = this
    const clips = this.clipsVisible(time)
    const streamableClips = clips.filter(clip => clip.definition.streamable)
    if (!streamableClips.length) return

    const filterGraphArgs = this.filterGraphsOptions({ time })
    const files = this.graphFilesUnloaded(filterGraphArgs)

    const loading = files.length
    if (loading) return

    this.drawRequest()
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
        this.emitter?.emit(EventType.Ended)
      }
    } else {
      // are we at or beyond the next frame?
      if (seconds >= nextFrameTime.seconds) {
        const compositionTime = timeFromSeconds(seconds, this.time.fps)

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
      this.emitter?.emit(EventType.Duration)
      if (this.frame > frames) this.seekToTime(timeFromArgs(frames, this.quantize))
    }
  }

  private _emitter?: Emitter

  get emitter(): Emitter | undefined { return this._emitter }

  set emitter(value: Emitter | undefined) {
    this._emitter = value
    if (this._composition) this._composition.emitter = value
  }

  get endTime(): Time { return timeFromArgs(this.frames, this.quantize) }


  filterGraphs(args: FilterGraphOptions): FilterGraphs {
    // console.log(this.constructor.name, "filterGraphs", args)
    const times = this.timeRanges(args)
    // console.log(this.constructor.name, "filterGraphs", ...times)
    const filterGraphsArgs: FilterGraphsArgs = {
      preloading: false,
      graphType: GraphType.Canvas,
      ...args,
      times,
      mash: this,
    }
    return new FilterGraphsClass(filterGraphsArgs)
  }

  private filterGraphsOptions(args: FilterGraphObject): FilterGraphOptions {
    const { time, avType, graphType, size, videoRate, ...rest } = args
    const definedTime = time || this.time
    const definedAVType = avType || (definedTime.isRange ? AVType.Both : AVType.Video)
    const defindedGraphType = graphType || GraphType.Canvas
    const definedSize = size || this.imageSize
    const definedRate = videoRate || definedTime.fps
    // console.log(this.constructor.name, "filterGraphsOptions", avType, "->", definedAVType)
    const filterGraphsOptions: FilterGraphOptions = {
      ...rest,
      time: definedTime,
      avType: definedAVType,
      graphType: defindedGraphType,
      size: definedSize,
      videoRate: definedRate,
    }
    return filterGraphsOptions
  }

  private filterIntersecting(clips: Clips, time: Time): Clips {
    const scaled = time.scale(this.quantize)
    return clips.filter(clip => this.clipIntersects(clip, scaled))
  }

  private _frame = 0 // initial frame supplied to constructor

  get frame(): number { return this.time.scale(this.quantize, "floor").frame }

  get frames(): number {
    if (!this.tracks.length) return 0

    const frames = this.tracks.map(track => track.frames)
    if (Math.min(...frames) < 0) return -1

    return Math.max(0, ...frames)
  }

  private _gain = Default.mash.gain

  get gain(): number { return this._gain }

  set gain(value: number) {
    if (!isPositive(value)) throw Errors.invalid.argument + 'gain ' + value

    if (this._gain !== value) {
      this._gain = value
      if (this._composition) this.composition.gain = value
    }
  }

  graphFiles(options: FilterGraphOptions): GraphFiles {
    const overridden: FilterGraphOptions = { ...options, preloading: true }
    const filterGraphs = this.filterGraphs(overridden)
    const graphFiles = filterGraphs.graphFiles
    // console.log(this.constructor.name, "graphFiles", graphFiles.length, overridden)
    return graphFiles
  }

  private graphFilesUnloaded(options: FilterGraphOptions): GraphFiles {
    const graphFiles = this.graphFiles(options)
    if (!graphFiles.length) return []

    const { preloader } = this
    return graphFiles.filter(file => !preloader.loadedFile(file))
  }


  handleAction(action: Action): void {
    this.emitter?.emit(EventType.Action)

    if (action instanceof ChangeAction) {
      const changeAction = <ChangeAction>action
      const { property } = changeAction
      if (property === "gain") {
        if (this.playing && isAboveZero(this.gain)) {
          this.composition.adjustSourceGain(<Audible>changeAction.target)
        }
        return
      }
    }
    this.stopLoadAndDraw()
  }

  private handleDrawInterval(): void {
    if (this._playing) this.drawWhilePlaying()
    else this.drawWhilePlayerNotPlaying()
  }

  get imageData() : VisibleContextData { return this.composition.visibleContext.imageData }

  get imageSize() : Size { return this.composition.visibleContext.size }

  set imageSize(value: Size) {
    const { width, height } = value
    if (!(isAboveZero(width) && isAboveZero(height))) throw Errors.invalid.size

    this.composition.visibleContext.size = value
    const promise = this.loadPromiseUnlessBuffered
    if (promise) promise.then(() => { this.draw() })
    else this.draw()
  }

  private _id = ''

  get id(): string { return this._id ||= idGenerate() }

  label = ''

  loadPromise(args: FilterGraphObject = {}): LoadPromise {
    const { time, ...rest } = args
    const preloadTime = time || this.timeToBuffer
    const object: FilterGraphObject = { ...rest, time: preloadTime }
    const filterGraphsOptions = this.filterGraphsOptions(object)
    const files = this.graphFilesUnloaded(filterGraphsOptions)
    if (!files.length) return Promise.resolve()

    return this.preloader.loadFilesPromise(files).then(EmptyMethod)
  }

  private get loadPromiseUnlessBuffered(): LoadPromise | undefined {
    const args: FilterGraphObject = { time: this.timeToBuffer }
    const filterGraphsOptions = this.filterGraphsOptions(args)
    const files = this.graphFilesUnloaded(filterGraphsOptions)
    if (!files.length) return

    // console.log(this.constructor.name, "loadPromiseUnlessBuffered files:", ...files)
    return this.preloader.loadFilesPromise(files).then(EmptyMethod)
  }

  loop = false

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
      this.emitter?.emit(EventType.Pause)
    } else {
      this.composition.startContext()
      this.bufferStart()
      const promise = this.loadPromiseUnlessBuffered
      if (promise) promise.then(() => { this.playing = true })
      else this.playing = true
      // console.log("Mash emit", EventType.Play)
      this.emitter?.emit(EventType.Play)
    }
  }

  private _playing = false

  get playing() : boolean { return this._playing }

  set playing(value : boolean) {
    // console.trace(this.constructor.name, "set playing", value)
    if (this._playing !== value) {
      this._playing = value
      if (value) {
        const clips = this.clipsAudibleInTimeRange(this.timeToBuffer)
        // console.log("playing", value, this.time)
        if (!this.composition.startPlaying(this.time, clips)) {
          // console.log(this.constructor.name, "set playing", value, "audio not cached", this.time, clips.length)
          // audio was not cached

          this._playing = false
          return
        }
        this.emitter?.emit(EventType.Playing)
      } else this.composition.stopPlaying()
    }
  }

  private _preloader?: Preloader
  get preloader(): Preloader {
    if (!this._preloader) throw Errors.internal + 'mash preloader false'

    return this._preloader
  }
  set preloader(value: Preloader) { this._preloader = value }

  removeClipFromTrack(clip : Clip) : void {
    const track = this.clipTrack(clip)
    this.emitIfFramesChange(() => { track.removeClip(clip) })
  }

  removeTrack(trackType: TrackType): void {
    const track = this.trackOfTypeAtIndex(trackType, this.trackCount(trackType) - 1)
    const index = this.tracks.indexOf(track)
    if (!isPositive(index)) throw Errors.internal + 'index'

    this.emitIfFramesChange(() => { this.tracks.splice(index, 1) })
    this.emitter?.emit(EventType.Track)
  }

  private restartAfterStop(time:Time, paused:boolean, seeking?: boolean): void {
    if (time === this.time) { // otherwise we must have gotten a seek call
      if (seeking) {
        delete this.seekTime
        this.emitter?.emit(EventType.Seeked)
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
      this.emitter?.emit(EventType.Seeking)
      this.emitter?.emit(EventType.Time)
      if (!this.drawInterval) this.setDrawInterval()
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
    const array = [time]
    if (!this.paused) array.push(time.add(this.bufferTime))
    return array
  }

  private stopLoadAndDraw(seeking? : boolean) : LoadPromise | undefined {
    const { time, paused, playing } = this

    if (playing) this.playing = false
    const promise = this.loadPromiseUnlessBuffered
    if (promise) return promise.then(() => { this.restartAfterStop(time, paused, seeking) })
    this.restartAfterStop(time, paused, seeking)
  }

  get time() : Time {
    return this.seekTime || this.drawnTime || timeFromArgs(this._frame, this.quantize)
  }

  get timeRange(): TimeRange {
    const { endTime, time } = this
    const scaled = endTime.scale(time.fps)
    const range = timeRangeFromTime(time, scaled.frame)
    // console.log(this.constructor.name, "timeRange", range, time, endTime)
    return range
  }

  timeRanges(args: FilterGraphOptions): Times {
    const { time: startTime, graphType, avType } = args
    const time = startTime || this.time
    const { quantize } = this

    const start = time.scale(this.quantize, 'floor')
    const end = start.isRange ? start.timeRange.endTime : undefined

    const fullRangeClips = this.clipsInTimeOfType(time, avType)
    const { length } = fullRangeClips
    if (!length) return []

    if (
      length === 1
      || !start.isRange
      || graphType === GraphType.Canvas
      || avType === AVType.Audio
    ) return [time] // note: not scaled

    const frames = new Set<number>()
    fullRangeClips.forEach(clip => {
      frames.add(Math.max(clip.frame, start.frame))
      frames.add(Math.min(clip.frame + clip.frames, end!.frame))
    })
    const uniqueFrames = [...frames].sort()
    let frame = uniqueFrames.shift()!
    const ranges = uniqueFrames.map(uniqueFrame => {
      const range = timeRangeFromArgs(frame, quantize, uniqueFrame - frame)
      frame = uniqueFrame
      return range
    })
    return ranges
  }

  private get timeToBuffer() : Time {
    const { time, quantize, buffer, paused } = this
    if (paused) return timeFromArgs(time.scale(quantize, 'floor').frame, quantize)

    return timeRangeFromTimes(time, timeFromSeconds(buffer + time.seconds, time.fps))
  }

  toJSON(): UnknownObject {
    const json: UnknownObject = {
      label: this.label,
      quantize: this.quantize,
      backcolor: this.backcolor,
      tracks: this.tracks,
      createdAt: this.createdAt,
      ...this.data,
    }
    if (this._id) json.id = this.id
    return json
  }

  trackCount(type?: TrackType): number {
    if (type) return this.tracksOfType(type).length

    return this.tracks.length
  }

  trackOfTypeAtIndex(type : TrackType, index = 0) : Track {
    if (!isPositive(index)) {
      // console.error(Errors.invalid.track, index, index?.constructor.name)
      throw Errors.invalid.track
    }

    return this.tracksOfType(type)[index]
  }

  tracks: Track[] = []

  private tracksOfType(trackType: TrackType): Track[] {
    return this.tracks.filter(track => track.trackType === trackType)
  }
}

export { MashClass }
