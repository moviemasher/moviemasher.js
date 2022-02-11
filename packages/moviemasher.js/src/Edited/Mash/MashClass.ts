import {
  Any, Interval, LoadPromise, Size,
  FilterGraph, FilterChain, GraphFilter, UnknownObject, VisibleContextData, FilterGraphs, FilterGraphArgs, FilterGraphsArgs, FilterChainArgs, GraphFile, FilesArgs, FilesOptions
} from "../../declarations"
import { AVType, EventType, GraphType, TrackType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Default } from "../../Setup/Default"
import { isAboveZero, isPopulatedString, isPositive } from "../../Utility/Is"
import { TimeRange } from "../../Helpers/TimeRange"
import { Time } from "../../Helpers/Time"
import { Definition } from "../../Base/Definition"
import { Clip, ClipDefinition } from "../../Mixin/Clip/Clip"
import { Visible } from "../../Mixin/Visible/Visible"
import { Audible } from "../../Mixin/Audible/Audible"
import { Composition } from "../../Editor/MashEditor/Composition"
import { ChangeAction } from "../../Editor/MashEditor/Actions/Action/ChangeAction"
import { Mash, MashObject } from "./Mash"
import { idGenerate } from "../../Utility/Id"
import { Action } from "../../Editor/MashEditor/Actions/Action/Action"
import { Emitter } from "../../Helpers/Emitter"
import { sortByLayer } from "../../Utility/Sort"
import { Factory } from "../../Definitions/Factory/Factory"
import { colorValid } from "../../Utility/Color"
import { Track, TrackObject } from "../../Media/Track/Track"
import { Preloader } from "../../Preloader/Preloader"
import { EmptyMethod } from "../../Setup/Constants"

interface TimeRangeClips {
  clips: Clip[]
  timeRange: TimeRange
}

class MashClass implements Mash {
  constructor(...args: Any[]) {
    const object = args[0] || {}
    const {
      createdAt,
      tracks,
      backcolor,
      id,
      label,
      quantize,
      ...rest
    } = <MashObject>object

    if (id) this._id = id
    Object.assign(this.data, rest)

    if (quantize && isAboveZero(quantize)) this.quantize = quantize
    if (label && isPopulatedString(label)) this.label = label
    if (backcolor && isPopulatedString(backcolor)) this._backcolor = backcolor
    if (createdAt) this.createdAt = createdAt

    if (tracks) tracks.forEach(track => {
      track.layer = this.trackCount(track.trackType)
      const instance = Factory.track.instance(track)
      this.assureClipsHaveFrames(instance.clips)
      this.tracks.push(instance)
    })

    this.assureTrackOfType(TrackType.Video)
    this.assureTrackOfType(TrackType.Audio)
    this.tracks.sort(sortByLayer)

  }

  addClipToTrack(clip: Clip, trackIndex = 0, insertIndex = 0, frame? : number): void {
    this.assureClipsHaveFrames([clip])
    const newTrack = this.clipTrackAtIndex(clip, trackIndex)
    if (!newTrack) throw Errors.invalid.track

    const oldTrack = isPositive(clip.track) && this.clipTrack(clip)

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

  private assureClipsHaveFrames(clips: Clip[]): void {
    clips.filter(clip => !isPositive(clip.frames)).forEach(clip => {
      const definition = <ClipDefinition>clip.definition
      clip.frames = definition.frames(this.quantize)
    })
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
      // console.debug(this.constructor.name, "bufferTimer calling load")
      this.preloadPromise
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

  private get clipsVideo(): Visible[] {
    const tracks = this.tracks.filter(track => track.trackType !== TrackType.Audio)
    return <Visible[]>tracks.flatMap(track => track.clips)
  }

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

  private compositeAudibleClips(clips: Clip[]): void {
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

  compositeVisible(): void {
    const { time, composition } = this
    const clips = this.clipsVisibleAtTime(time)
    composition.compositeVisible(time, clips)
  }

  compositeVisibleRequest(): void {
    const { time, composition } = this
    const clips = this.clipsVisibleAtTime(time)
    composition.compositeVisibleRequest(time, clips)
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

  private drawInterval?: Interval

  private drawTime(time: Time): void {
    const timeChange = time !== this.time
    this.drawnTime = time
    this.compositeVisibleRequest()
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

    const files = this.unloadedGraphFiles({ timeRange: TimeRange.fromTime(time) })

    const loading = files.length
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
        this.emitter?.emit(EventType.Ended)
      }
    } else {

      // are we at or beyond the next frame?
      if (seconds >= nextFrameTime.seconds) {

        const compositionTime = Time.fromSeconds(seconds, this.time.fps)
        // const difference = compositionTime.frame - this.time.frame
        // if (difference > 1) console.debug(this.constructor.name, "drawWhilePlaying dropped frames", difference - 1)
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
      if (this.frame > frames) this.seekToTime(Time.fromArgs(frames, this.quantize))
    }
  }

  private _emitter?: Emitter

  get emitter(): Emitter | undefined { return this._emitter }

  set emitter(value: Emitter | undefined) {
    this._emitter = value
    if (this._composition) this._composition.emitter = value
  }

  get endTime(): Time { return Time.fromArgs(this.frames, this.quantize) }

  filterGraph(args: FilterGraphArgs): FilterGraph {
    const { size, timeRange, avType } = args
    const { quantize, backcolor } = this
    const types = new Set<AVType>()

    const filterGraph: FilterGraph = {
      avType,
      duration: timeRange.lengthSeconds,
      filterChains: []
    }
    const sizeString = `${size.width}x${size.height}`
    const colorFilter: GraphFilter = {
      filter: 'color', options: { color: backcolor, size: sizeString },
      outputs: ['L0']
    }
    let filterChain: FilterChain = {
      files: [],
      inputs: [],
      filters: [colorFilter],
    }
    filterGraph.filterChains.push(filterChain)
    const { frames, startTime, endTime } = timeRange

    const clips = this.clipsAtTimes(startTime, frames > 1 ? endTime : undefined)
    let inputCount = 0
    const filterChains = clips.flatMap((clip, index) => {
      if (clip.audible) types.add(AVType.Audio)
      if (clip.visible) types.add(AVType.Video)

      const layerArgs: FilterChainArgs = {
        ...args,
        layerIndex: index + 1,
        clipTimeRange: clip.timeRange(quantize),
        timeRange,
        inputCount, prevFilterChain: filterChain
      }
      const chains = clip.filterChains(layerArgs)
      chains.forEach(chain => { inputCount += chain.inputs.length })

      return chains
    })
    filterGraph.filterChains.push(...filterChains)
    if (types.size === 1) filterGraph.avType = [...types][0]
    return filterGraph
  }

  filterGraphs(args: FilterGraphsArgs): FilterGraphs {
    return this.timeRangeClipsAtTimes(args).map(({ timeRange }) => {
      return this.filterGraph({ ...args, timeRange })
    })
  }

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

  graphFiles(options: FilesOptions): GraphFile[] {
    const { timeRange, graphType, avType } = options

    const range = timeRange || this.timeRange
    const start = range.startTime
    const end = range.endTime

    const args: FilesArgs = {
      start, end,
      quantize: this.quantize,
      graphType: graphType || GraphType.Canvas,
      avType: avType || AVType.Video
    }

    const clips: Clip[] = []
    if (avType !== AVType.Audio) clips.push(...this.clipsVisible(start, end))
    if (avType !== AVType.Video) clips.push(...this.clipsAudible(start, end))


    return clips.flatMap(clip => clip.files(args))
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

    // console.log("Mash.imageSize", value, this.composition.visibleContext.size)

    const promise = this.preloadPromise
    if (promise) promise.then(() => { this.compositeVisible() })
    else this.compositeVisible()
  }

  private _id = ''

  get id(): string { return this._id ||= idGenerate() }


  label = ''

  // private oldloadPromise(timeOrRange: Time, avType?: AVType): LoadPromise  {
  //   const range = timeOrRange instanceof TimeRange
  //   const start = range ? timeOrRange.startTime : timeOrRange
  //   const end = range ? timeOrRange.endTime : undefined

  //   const loading: Clip[] = []
  //   if (avType !== AVType.Audio) loading.push(...this.clipsVisible(start, end))
  //   if (avType !== AVType.Video) loading.push(...this.clipsAudible(start, end))

  //   const clips = [... new Set(loading)]
  //   const voidOrPromises = clips.map(clip => clip.loadClip(this.quantize, start, end))
  //   const promises = voidOrPromises.filter(Boolean)
  //   switch (promises.length) {
  //     case 0: return Promise.resolve()
  //     case 1: {
  //       const [promise] = promises
  //       return promise!
  //     }
  //     default: return Promise.all(promises).then()
  //   }
  // }


  unloadedGraphFiles(options: FilesOptions): GraphFile[]{

    options.timeRange ||= this.timeRange
    options.graphType ||= GraphType.Canvas
    if (!options.avType && options.timeRange!.frames === 1) options.avType = AVType.Video

    const graphFiles = this.graphFiles(options)
    if (!graphFiles.length) return []

    const { preloader } = this

    const files = graphFiles.filter(file => !preloader.loadedFile(file))
    return files
  }

  loadPromise(options: FilesOptions): LoadPromise {
    const files = this.unloadedGraphFiles(options)
    if (!files.length) return Promise.resolve()

    return this.preloader.loadFilesPromise(files).then(EmptyMethod)
  }

  // private get loadUrls(): string[] {
  //   const [start, end] = this.startAndEnd
  //   const clips = this.clipsAtTimes(start, end)
  //   return clips.flatMap(clip => clip.clipUrls(this.quantize, start, end))
  // }

  // private get loadedDefinitions(): DefinitionTimes {
  //   const map = <DefinitionTimes>new Map()
  //   const [start, end] = this.startAndEnd
  //   this.clipsAtTimes(start, end).forEach(clip => {
  //     const { definitions } = clip
  //     const times = [clip.definitionTime(this.quantize, start)]
  //     if (end) times.push(clip.definitionTime(this.quantize, end))

  //     definitions.forEach(definition => {
  //       if (!map.has(definition)) map.set(definition, [])
  //       const definitionTimes = map.get(definition)
  //       if (!definitionTimes) throw Errors.internal

  //       definitionTimes.push(times)
  //     })
  //   })
  //   return map
  // }

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
      const promise = this.preloadPromise
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
        const clips = this.clipsAudibleInTimeRange(this.timeRangeToBuffer)
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

  _preloader?: Preloader
  get preloader(): Preloader {
    if (!this._preloader) throw Errors.internal + 'mash preloader false'

    return this._preloader
  }
  set preloader(value: Preloader) { this._preloader = value }

  private get preloadPromise(): LoadPromise | undefined {
    const [start, end] = this.startAndEnd
    const timeRange = end ? TimeRange.fromTimes(start, end) : TimeRange.fromTime(start)

    const options: FilesOptions = { timeRange }
    if (this.paused) options.avType = AVType.Video
    const files = this.unloadedGraphFiles(options)
    if (!files.length) return

    return this.preloader.loadFilesPromise(files).then(EmptyMethod)
  }



  //   // console.log(this.constructor.name, "load", start, end)


  //   const clips = this.clipsAtTimes(start, end)
  //   const loads = clips.map(clip => clip.loadClip(this.quantize, start, end))
  //   const promises = loads.filter(Boolean)

  //   if (promises.length) return Promise.all(promises).then(() => {
  //     this.compositeAudibleClips(clips)
  //   })
  //   this.compositeAudibleClips(clips)

  //   // switch (promises.length) {
  //   //   case 0: return
  //   //   case 1: return promises[0] || undefined
  //   //   default: return Promise.all(promises).then()
  //   // }
  // }

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

  size(time?: Time): Size | undefined {
    const visibleTime = time || this.time
    const visibleClips = this.clipsVisibleAtTime(visibleTime)
    const sizes = visibleClips.map(clip => clip.definition.size(this.preloader)).filter(Boolean) as Size[]
    if (!sizes.length) return

    if (sizes.some(size => size.width === 0 || size.height === 0)) return { width: 0, height: 0 }

    return {
      width: Math.max(...sizes.map(size => size.width)),
      height: Math.max(...sizes.map(size => size.height))
    }
  }

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

  private timeRangeClipsAtTimes(args: FilterGraphsArgs): TimeRangeClips[] {
    const { timeRange } = args
    const range = timeRange || this.timeRange
    const start = range.startTime
    const end = range.endTime

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
      const ids = clips.map(clip => clip.id).join('~')
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
    const promise = this.preloadPromise
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

  toJSON() : UnknownObject {
    return {
      label: this.label,
      quantize: this.quantize,
      backcolor: this.backcolor,
      id: this.id,
      tracks: this.tracks,
      createdAt: this.createdAt,
      ...this.data,
    }
  }

  trackCount(type?: TrackType): number {
    if (type) return this.tracksOfType(type).length

    return this.tracks.length
  }

  trackOfTypeAtIndex(type : TrackType, index = 0) : Track {
    if (!isPositive(index)) {
      console.error(Errors.invalid.track, index, index?.constructor.name)
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
