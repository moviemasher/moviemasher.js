import {
  Interval, LoadPromise, Size,
  FilterGraph, FilterChain, GraphFilter, UnknownObject, VisibleContextData,
  FilterGraphs, FilterGraphArgs, FilterGraphOptions, FilterChainArgs,
  FilesArgs, GraphFiles, FilterChains} from "../../declarations"
import { AVType, DefinitionType, EventType, GraphType, TrackType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Default } from "../../Setup/Default"
import { isAboveZero, isPopulatedString, isPositive } from "../../Utility/Is"
import { TimeRange } from "../../Helpers/TimeRange"
import { Time } from "../../Helpers/Time"
import { Definition } from "../../Base/Definition"
import { Clip, ClipDefinition, Clips } from "../../Mixin/Clip/Clip"
import { Visible, VisibleContent, VisibleContents } from "../../Mixin/Visible/Visible"
import { Audible } from "../../Mixin/Audible/Audible"
import { Composition } from "../../Editor/MashEditor/Composition"
import { ChangeAction } from "../../Editor/MashEditor/Actions/Action/ChangeAction"
import { Mash, MashArgs } from "./Mash"
import { idGenerate } from "../../Utility/Id"
import { Action } from "../../Editor/MashEditor/Actions/Action/Action"
import { Emitter } from "../../Helpers/Emitter"
import { sortByLayer, sortByTrack } from "../../Utility/Sort"
import { Factory } from "../../Definitions/Factory/Factory"
import { colorValid } from "../../Utility/Color"
import { Track, TrackArgs, TrackObject } from "../../Media/Track/Track"
import { Preloader } from "../../Preloader/Preloader"
import { EmptyMethod } from "../../Setup/Constants"
import { Transition } from "../../Media/Transition/Transition"

interface TimeRangeClips {
  clips: Clips
  timeRange: TimeRange
}

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
    if (tracks) tracks.forEach(track => {
      const trackArgs: TrackArgs = {
        ...track, definitions, layer: this.trackCount(track.trackType)
      }
      const instance = Factory.track.instance(trackArgs)
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

  private assureClipsHaveFrames(clips: Clips): void {
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

  private visibleContents(timeRange: TimeRange): VisibleContents {
    const scaled = timeRange.scale(this.quantize)
    const both = this.clipsVisibleInTimeRange(scaled)
    const videos = both.filter(clip => clip.type !== DefinitionType.Transition)
    const videosByTrack = Object.fromEntries(videos.map(video => ([video.track, video])))
    const transitionTypes = both.filter(clip => clip.type === DefinitionType.Transition)
    const transitions = transitionTypes.map(clip => clip as Transition)

    const contents: VisibleContents = []
    const tracks: string[] = []
    transitions.forEach(transition => {
      const { fromTrack, toTrack } = transition
      const from = videosByTrack[fromTrack]
      const to = videosByTrack[toTrack]
      const fromOrTo = from || to
      if (!fromOrTo) return

      const someTracks: number[] = []
      if (to) someTracks.push(to.track)
      if (from) someTracks.push(from.track)
      tracks.push(...someTracks.map(String))
      const track = Math.min(...someTracks)
      const visibleTransition: VisibleContent = {
        visible: transition, track, from, to, transition
      }
      contents.push(visibleTransition)
    })
    const others = Object.keys(videosByTrack).filter(track => !tracks.includes(track))
    contents.push(...others.map(track => (
      { track: Number(track), visible: videosByTrack[track] }
    )))
    return contents.sort(sortByTrack)
  }


  private clipsAtTimes(start: Time, end?: Time): Clips {
    const objects: Clips = this.clipsVisible(start, end)
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

  clipsInTimeRange(timeRange?: TimeRange, avType = AVType.Both): Clip[] {
    const range = timeRange || this.timeRange
    const [start, end] = range.times

    const clips: Clips = []
    if (avType !== AVType.Audio) clips.push(...this.clipsVisible(start, end))
    if (avType !== AVType.Video) clips.push(...this.clipsAudible(start, end))

    return clips
  }

  private clipsInTracks(tracks?: Track[]): Clips {
    const clipTracks = tracks || this.tracks
    return clipTracks.map(track => track.clips).flat()
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
      if (!clip.frames) return true

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
    const { time, composition } = this
    composition.compositeVisible(time, this.visibleContents(TimeRange.fromTime(time)))
  }

  private drawInterval?: Interval

  private drawRequest(): void {
    const { time, composition } = this
    composition.compositeVisibleRequest(time, this.visibleContents(TimeRange.fromTime(time)))
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

    const filterGraphArgs = this.filterGraphsArgs(TimeRange.fromTime(time))
    const files = this.unloadedGraphFiles(filterGraphArgs)

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

  private filterGraph(args: FilterGraphArgs): FilterGraph {
    const { size, timeRange, avType, justGraphFiles } = args
    const { quantize, backcolor } = this
    const avTypes = new Set<AVType>()
    const filterChains: FilterChains = []

    const filterGraph: FilterGraph = {
      avType,
      duration: timeRange.lengthSeconds,
      filterChains
    }
    if (avType !== AVType.Audio) {
      if (!justGraphFiles) {
        const sizeString = `${size.width}x${size.height}`
        const colorFilter: GraphFilter = {
          filter: 'color', options: { color: backcolor, size: sizeString },
          outputs: ['BACK']
        }
        let filterChain: FilterChain = {
          graphFiles: [],
          graphFilters: [colorFilter],
        }
        filterChains.push(filterChain)
      }

      const visibleContents = this.visibleContents(timeRange)
      const { length } = visibleContents
      visibleContents.forEach((visibleContent, index) => {
        const { visible, transition, to, from } = visibleContent
        const layerArgs: FilterChainArgs = {
          index, length,
          preloader: this.preloader,
          ...args,
          filterGraph,
          clip: visible,
          quantize,
        }

        if (transition) {
          if (to?.audible || from?.audible) avTypes.add(AVType.Audio)
          if (to?.visible || from?.visible) avTypes.add(AVType.Video)
          filterChains.push(transition.transitionFilterChains(layerArgs, from, to, backcolor))
        } else {
          if (visible.audible) avTypes.add(AVType.Audio)
          if (visible.visible) avTypes.add(AVType.Video)
          filterChains.push(visible.filterChain(layerArgs))
        }
      })
    }
    if (avType !== AVType.Video) {
      // TODO: add audio

    }

    if (avTypes.size === 1) filterGraph.avType = [...avTypes][0]
    return filterGraph
  }

  filterGraphs(args: FilterGraphOptions): FilterGraphs {

    return this.timeRanges(args).map(timeRange => {
      const filterGraphArgs: FilterGraphArgs = {
        justGraphFiles: false,
        graphType: GraphType.Canvas,
        ...args, timeRange
      }
      return this.filterGraph(filterGraphArgs)
    })
  }

  private filterIntersecting(clips: Clips, timeRange: TimeRange): Clips {
    const range = timeRange.scale(this.quantize)
    return clips.filter(clip => this.clipIntersects(clip, range))
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
    options.justGraphFiles = true
    const filterGraphs = this.filterGraphs(options)
    const filterChains = filterGraphs.flatMap(filterGraph => filterGraph.filterChains)
    const graphFiles = filterChains.flatMap(filterChain => filterChain.graphFiles)
    return graphFiles
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
    const promise = this.preloadPromise
    if (promise) promise.then(() => { this.draw() })
    else this.draw()
  }

  private _id = ''

  get id(): string { return this._id ||= idGenerate() }

  label = ''

  private unloadedGraphFiles(options: FilterGraphOptions): GraphFiles {
    const graphFiles = this.graphFiles(options)
    if (!graphFiles.length) return []

    const { preloader } = this

    const files = graphFiles.filter(file => !preloader.loadedFile(file))
    return files
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

  private _preloader?: Preloader
  get preloader(): Preloader {
    if (!this._preloader) throw Errors.internal + 'mash preloader false'

    return this._preloader
  }
  set preloader(value: Preloader) { this._preloader = value }

  private filterGraphsArgs(timeRange: TimeRange, avType = AVType.Both): FilterGraphOptions {
    const filterGraphsArgs: FilterGraphOptions = {
      timeRange,
      avType,
      graphType: GraphType.Canvas,
      size: this.imageSize,
      videoRate: this.quantize
}
    return filterGraphsArgs
  }

  private get preloadPromise(): LoadPromise | undefined {
    const [start, end] = this.startAndEnd
    const timeRange = end ? TimeRange.fromTimes(start, end) : TimeRange.fromTime(start)
    const avType = (this.paused || timeRange.frames === 1) ? AVType.Video : AVType.Both
    const filterGraphsArgs = this.filterGraphsArgs(timeRange, avType)
    const files = this.unloadedGraphFiles(filterGraphsArgs)
    if (!files.length) return

    return this.preloader.loadFilesPromise(files).then(EmptyMethod)
  }

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
    const promise = this.preloadPromise
    if (promise) return promise.then(() => { this.restartAfterStop(time, paused, seeking) })
    this.restartAfterStop(time, paused, seeking)
  }

  get time() : Time {
    return this.seekTime || this.drawnTime || Time.fromArgs(this._frame, this.quantize)
  }

  get timeRange(): TimeRange {
    return TimeRange.fromTime(this.time, this.endTime.scale(this.time.fps).frame)
  }

  private timeRanges(args: FilterGraphOptions): TimeRange[] {
    const { timeRange } = args
    const range = timeRange || this.timeRange
    const [start, end] = range.times

    const fullRangeClips = this.clipsAtTimes(start, end)
    const startTime = start.scale(this.quantize)
    if (!end) return [TimeRange.fromTime(startTime)]

    const result: TimeRange[] = []

    const endTime = end.scale(this.quantize)
    const fullRange = TimeRange.fromTimes(startTime, endTime)
    const { frameTimes } = fullRange
    let identifiers = '~'

    frameTimes.forEach(time => {
      let timeRange = TimeRange.fromTime(time)
      const clips = this.filterIntersecting(fullRangeClips, timeRange)
      const ids = clips.map(clip => clip.id).join('~')
      if (identifiers === ids) {
        timeRange = timeRange.addFrames(1)
      } else {
        identifiers = ids
        result.push(timeRange)
      }
    })
    return result
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
