import {
  Interval, Scalar, UnknownObject} from "../../declarations"
import { GraphFiles, GraphFileArgs, GraphFileOptions } from "../../MoveMe"
import { SelectedItems } from "../../Utility/SelectedProperty"
import {
  ActionType,
  AVType, DataType, EventType, GraphType, SelectType, TrackType
} from "../../Setup/Enums"
import { EmptyMethod } from "../../Setup/Constants"
import { Errors } from "../../Setup/Errors"
import { Default } from "../../Setup/Default"
import { assertPopulatedString, assertTrue, isAboveZero, isPopulatedString, isPositive, isString, isUndefined } from "../../Utility/Is"
import { sortByLayer } from "../../Utility/Sort"
import { Time, Times, TimeRange } from "../../Helpers/Time/Time"
import { isClip, Clip, Clips } from "../../Media/Clip/Clip"
import { isTrack, Track, TrackArgs, TrackObject } from "./Track/Track"
import { AudioPreview, AudioPreviewArgs } from "../../Editor/Preview/AudioPreview/AudioPreview"
import { Mash, MashArgs } from "./Mash"
import { FilterGraphs, FilterGraphsArgs, FilterGraphsOptions } from "./FilterGraphs/FilterGraphs"
import { FilterGraphsClass } from "./FilterGraphs/FilterGraphsClass"
import {
  timeFromArgs, timeFromSeconds, timeRangeFromArgs, timeRangeFromTime, timeRangeFromTimes
} from "../../Helpers/Time/TimeUtilities"
import { trackInstance } from "./Track/TrackFactory"
import { EditedClass } from "../EditedClass"
import { propertyInstance } from "../../Setup/Property"
import { Preview, PreviewArgs, PreviewOptions, Svg, Svgs } from "../../Editor/Preview/Preview"
import { PreviewClass } from "../../Editor/Preview/PreviewClass"
import { colorBlack } from "../../Utility/Color"
import { isContainer } from "../../Container/Container"
import { Cast } from "../Cast/Cast"
import { LayerMash } from "../Cast/Layer/Layer"
import { Actions } from "../../Editor/Actions/Actions"
import { NonePreview } from "../../Editor/Preview/NonePreview"
import { Selectables } from "../../Editor/Selectable"

export class MashClass extends EditedClass implements Mash {
  constructor(args: MashArgs) {
    super(args)

    const property = propertyInstance({ 
      name: 'backcolor', type: DataType.Rgb, defaultValue: colorBlack 
    })
    this.properties.push(property)
    
    const {
      createdAt,
      tracks,
      id,
      frame,
      rendering,
      label,
      backcolor,
      icon,
      preloader,
      ...rest
    } = args

    this.propertiesInitialize(args)
 
    if (!isString(label)) this.label = Default.mash.label
    if (!isString(backcolor)) this.backcolor = Default.mash.backcolor

    this.dataPopulate(rest)

    if (rendering && isPopulatedString(rendering)) this._rendering = rendering
    if (createdAt) this.createdAt = createdAt
    if (frame) this._frame = frame
    let videoTrackCount = 0
    if (tracks) tracks.forEach(trackObject => {
      const trackArgs: TrackArgs = {
        trackType: TrackType.Video,
        ...trackObject, layer: this.trackCount(trackObject.trackType)
      }
      const isVideoTrack = trackArgs.trackType === TrackType.Video
      if (isVideoTrack) videoTrackCount++

      if (typeof trackObject.dense === 'undefined') {
        trackArgs.dense = videoTrackCount === 1
      }
      const track = trackInstance(trackArgs)
      track.mash = this
      track.assureFrames(this.quantize)
      track.sortClips()

      this.tracks.push(track)
    })
    this.assureTrackOfType(TrackType.Video)
    this.assureTrackOfType(TrackType.Audio)
    this.tracks.sort(sortByLayer)
    this._preview = new NonePreview(this.previewArgs())
  }

  addClipToTrack(clip: Clip, trackIndex = 0, insertIndex = 0, frame?: number): void {
    const newTrack = this.clipTrackAtIndex(clip, trackIndex)
    if (!newTrack) throw Errors.invalid.track

    const oldTrack = isTrack(clip.track) && this.clipTrack(clip)

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
    const options: TrackObject = { 
      trackType: trackType, layer: this.trackCount(trackType) 
    }
    const track = trackInstance(options)
    track.mash = this
    // console.log(this.constructor.name, "addTrack", track)
    this.tracks.push(track)
    this.tracks.sort(sortByLayer)
    this.emitter?.emit(EventType.Track)
    return track
  }

  private assureTrackOfType(trackType: TrackType): void {
    if (!this.trackCount(trackType)) {
      const dense = trackType === TrackType.Video 
      const trackArgs = { trackType, dense }
      const track = trackInstance(trackArgs)
      track.mash = this
      this.tracks.push(track)
    }
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
      this.loadPromiseUnlessBuffered({ editing: true, visible: true, audible: true })
      this.compositeAudibleClips(this.clipsAudibleInTime(this.timeToBuffer))
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

  changeClipTrimAndFrames(clip: Clip, value: number, frames: number): void {
    let limitedValue = Math.max(0, value)

    const max = clip.maxFrames(this.quantize, 1) // do not remove last frame
    if (isAboveZero(max)) limitedValue = Math.min(max, limitedValue)

    const newFrames = frames - limitedValue
    const track = this.clipTrack(clip)
    this.emitIfFramesChange(() => {
      clip.setValue(limitedValue, 'trim')
      clip.frames = newFrames
      track.sortClips(track.clips)
    })
  }

  private clearDrawInterval(): void {
    if (!this.drawInterval) return

    clearInterval(this.drawInterval)
    this.drawInterval = undefined
  }

  clearPreview() {
    // console.log(this.constructor.name, "clearPreview")
    delete this._preview 
  }

  private clipIntersects(clip: Clip, range: Time): boolean {
    if (!clip.frames) return true

    return clip.timeRange(this.quantize).intersects(range)
  }

  clipTrack(clip: Clip): Track { return clip.track! }

  private clipTrackAtIndex(clip: Clip, index = 0): Track {
    return this.trackOfTypeAtIndex(clip.trackType, index)
  }

  get clips(): Clip[] {
    return this.tracks.map(track => track.clips).flat() as Clip[]
  }

  private get clipsAudible(): Clip[] {
    return this.clips.filter(clip => clip.mutable && clip.notMuted)
  }

  private clipsAudibleInTime(time: Time): Clip[] {
    return this.filterIntersecting(this.clipsAudible, time)
  }

  private clipsInTime(time: Time): Clip[] {
    return this.filterIntersecting(this.clips, time)
  }

  clipsInTimeOfType(time: Time, avType = AVType.Both): Clip[] {
    switch (avType) {
      case AVType.Both: return this.clipsInTime(time)
      case AVType.Audio: return this.clipsAudibleInTime(time)
      case AVType.Video: return this.clipsVisibleInTime(time)
    }
  }

  private get clipsVisible(): Clip[] {
    return this.clips.filter(clip => clip.container)
  }

  private clipsVisibleInTime(time: Time): Clip[] {
    return this.filterIntersecting(this.clipsVisible, time)
  }

  private drawingTime?: Time

  private compositeVisible(time: Time): void {
    this.drawingTime = time
    this.clearPreview()
    this.emitter?.emit(EventType.Draw)
  }

  compositeVisibleRequest(time: Time): void {
    // console.log(this.constructor.name, "compositeVisibleRequest", time)
    requestAnimationFrame(() => this.compositeVisible(time))
  }

  private compositeAudibleClips(clips: Clip[]): void {
    if (this._paused) return

    this.composition.compositeAudible(clips, this.quantize)
  }

  private _composition?: AudioPreview
  get composition(): AudioPreview {
    if (!this._composition) {
      const options: AudioPreviewArgs = {
        buffer: this.buffer,
        gain: this.gain,
        preloader: this.preloader,
      }
      // console.log(this.constructor.name, "composition creating")
      this._composition = new AudioPreview(options)
    }
    return this._composition
  }

  get definitionIds(): string[] {
    const { clips } = this
    const ids = clips.flatMap(clip => clip.definitionIds())
    const set = [...new Set(ids)]

    // console.log(this.constructor.name, "definitionIds", set.length)
    return set
  }

  destroy(): void {
    this.paused = true
    this.clearDrawInterval()
  }

  draw(): void {
    const { time } = this
    this.compositeVisible(time)
  }

  private drawInterval?: Interval

  private drawRequest(): void {
    // console.log(this.constructor.name, "drawRequest")
    const { time } = this
    this.compositeVisibleRequest(time)
  }

  private drawTime(time: Time): void {
    // console.log(this.constructor.name, "drawTime")
    const timeChange = time !== this.time
    this.drawnTime = time
    this.drawRequest()
    this.emitter?.emit(timeChange ? EventType.Time : EventType.Loaded)
  }

  private drawWhilePlayerNotPlaying() {
    // console.log(this.constructor.name, "drawWhilePlayerNotPlaying")
    const now = performance.now()
    const ellapsed = now - this.drawnSeconds
    if (ellapsed < 1.0 / this.quantize) return

    this.drawnSeconds = now
    const { time } = this
    const clips = this.clipsVisibleInTime(time)
    const streamableClips = clips.filter(clip => clip.definition.streamable)
    if (!streamableClips.length) return

    const files = this.graphFilesUnloaded({ time, editing: true, visible: true })

    const loading = files.length
    if (loading) return

    this.drawRequest()
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

  get endTime(): Time { return timeFromArgs(this.frames, this.quantize) }

  filterGraphs(options: FilterGraphsOptions = {}): FilterGraphs {
    const { backcolor, time, avType, graphType, size, videoRate, ...rest } = options
    const definedTime = time || this.time
    const definedAVType = avType || (definedTime.isRange ? AVType.Both : AVType.Video)
    const definedBackcolor = backcolor || this.backcolor
    const definedGraphType = graphType || GraphType.Mash
    const definedRate = videoRate || definedTime.fps
    const definedSize = size || this.imageSize
    // console.log(this.constructor.name, "filterGraphsOptions", avType, "->", definedAVType)
    const filterGraphsOptions: FilterGraphsArgs = {
      ...rest,
      times: this.timeRanges(definedAVType, definedTime),
      avType: definedAVType,
      graphType: definedGraphType,
      size: definedSize,
      videoRate: definedRate,
      mash: this,
      backcolor: definedBackcolor,
    }
    // console.log(this.constructor.name, "filterGraphs filterGraphsOptions", filterGraphsOptions)

    return new FilterGraphsClass(filterGraphsOptions)
  }

  private filterIntersecting(clips: Clips, time: Time): Clip[] {
    const scaled = time.scale(this.quantize)
    return clips.filter(clip => this.clipIntersects(clip, scaled)) as Clip[]
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
      if (this._composition) this.composition.setGain(value, this.quantize)
    }
  }

  graphFileArgs(options: GraphFileOptions = {}): GraphFileArgs {
    const { time, audible, visible, editing, streaming } = options

    const definedTime = time || this.time
    const { isRange } = definedTime
    const definedVisible = visible || !isRange
    const definedAudible = isRange && audible

    const args: GraphFileArgs = {
      editing,
      streaming,
      audible: definedAudible, visible: definedVisible,
      time: definedTime,
      quantize: this.quantize,
    }

    const okay = definedVisible || definedAudible
    if (!okay) console.log(this.constructor.name, "graphFileArgs", args)
    assertTrue(okay, "audible || visible")
    return args
  }

  graphFiles(options?: GraphFileOptions): GraphFiles {
    const args = this.graphFileArgs(options)
    const { time, audible, visible } = args
    const scaled = time.scale(this.quantize)
    const type = audible && visible ? AVType.Both : (audible ? AVType.Audio : AVType.Video)
    const clips = this.clipsInTimeOfType(scaled, type)
    // console.log(this.constructor.name, "graphFiles", args, clips.length, "clip(s)")
    return clips.flatMap(clip => clip.clipGraphFiles(args))
  }

  private graphFilesUnloaded(options: GraphFileOptions): GraphFiles {
    const graphFiles = this.graphFiles(options)
    if (!graphFiles.length) return []

    const { preloader } = this
    return graphFiles.filter(file => {
      const loaded = preloader.loadedFile(file)
      // console.log(this.constructor.name, "graphFilesUnloaded loaded = ", loaded, options)
      return !loaded
    })
  }

  private handleDrawInterval(): void {
    // console.log(this.constructor.name, "handleDrawInterval", this._playing)
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

  _layer?: LayerMash 
  get layer(): LayerMash { return this._layer! }
  set layer(value: LayerMash) { this._layer = value }
  
  loadPromise(args: GraphFileOptions = {}): Promise<void> {
    const promise = this.loadPromiseUnlessBuffered(args)
    // console.log(this.constructor.name, "loadPromise", args, "loadPromiseUnlessBuffered", promise)
    return promise || Promise.resolve()
  }

  loadingPromises: Promise<void>[] = []

  get loading(): boolean { return !!this.loadingPromises.length }

  private loadPromiseUnlessBuffered(options: GraphFileOptions = {}): Promise<void> | undefined {
    options.time ||= this.timeToBuffer

    const files = this.graphFilesUnloaded(options)
    if (!files.length) return

    if (files.every(file => this.preloader.loadedFile(file))) return

    const promise = this.preloader.loadFilesPromise(files).then(EmptyMethod)
    const removedPromise = promise.then(() => {
      const index = this.loadingPromises.indexOf(promise)
      if (index < 0) throw Errors.internal + "couldn't find promise~"

      this.loadingPromises.splice(index, 1)
    })
    this.loadingPromises.push(promise)
    return removedPromise
  }

  loop = false

  private _paused = true

  get paused(): boolean { return this._paused }

  set paused(value: boolean) {
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
      const promise = this.loadPromiseUnlessBuffered({
        editing: true, audible: true, visible: true
      })
      if (promise) promise.then(() => { this.playing = true })
      else this.playing = true
      // console.log("Mash emit", EventType.Play)
      this.emitter?.emit(EventType.Play)
    }
  }

  private _playing = false

  get playing(): boolean { return this._playing }

  set playing(value: boolean) {
    // console.trace(this.constructor.name, "set playing", value)
    if (this._playing !== value) {
      this._playing = value
      if (value) {
        const clips = this.clipsAudibleInTime(this.timeToBuffer)
        // console.log("playing", value, this.time)
        if (!this.composition.startPlaying(this.time, clips, this.quantize)) {
          // console.log(this.constructor.name, "set playing", value, "audio not cached", this.time, clips.length)
          // audio was not cached

          this._playing = false
          return
        }
        this.emitter?.emit(EventType.Playing)
        this.setDrawInterval()
      } else {
        this.composition.stopPlaying()
        this.clearDrawInterval()
      }
    }
  }

  private _preview?: Preview
  preview(options: PreviewOptions) { 
    // return this.previewInitialize(options) 
    return this._preview ||= this.previewInitialize(options) 
  }
  private previewInitialize(options: PreviewOptions): Preview {
    return new PreviewClass(this.previewArgs(options))
  }

  private previewArgs(options: PreviewOptions = {}): PreviewArgs {
    const { editor } = options
    const clip = editor?.selection.clip
    const selectedClip = isClip(clip) ? clip : undefined
    const { drawingTime, time, quantize } = this
    const svgTime = drawingTime || time
    const args: PreviewArgs = {
      editor,
      backcolor: this.backcolor,
      selectedClip,
      time: svgTime.scale(quantize),
      mash: this,
      ...options,
    }

    return args
  }

  putPromise(): Promise<void> { 
    const { quantize, preloader } = this
    const args: GraphFileArgs = {
      editing: true, visible: true, quantize, time: timeFromArgs()
    }
    const graphFiles = this.clips.flatMap(clip => {
      const { container } = clip
      if (isContainer(container)) {
        if (!container.intrinsicsKnown) {
          return container.graphFiles({ ...args, time: clip.time(quantize)})
        }
      }
      return [] 
    })  
    return preloader.loadFilesPromise(graphFiles).then(EmptyMethod)
  }


  removeClipFromTrack(clip: Clip): void {
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

  _rendering = ''
  get rendering() { return this._rendering }
  set rendering(value: string) {
    this._rendering = value
    this.emitter?.emit(EventType.Render)
  }

  private restartAfterStop(time: Time, paused: boolean, seeking?: boolean): void {
    // console.log(this.constructor.name, "restartAfterStop", time, this.time)
    if (time.equalsTime(this.time)) { // otherwise we must have gotten a seek call
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


  reload(): Promise<void> | undefined { return this.stopLoadAndDraw() }

  private seekTime?: Time

  seekToTime(time: Time): Promise<void> | undefined {
    if (this.seekTime !== time) {
      this.seekTime = time
      this.emitter?.emit(EventType.Seeking)
      this.emitter?.emit(EventType.Time)
    }
    return this.stopLoadAndDraw(true)
  }

  selectType = SelectType.Mash

  selectables(): Selectables { 
    const selectables: Selectables = [this]
    if (this._layer) selectables.push(...this.layer.selectables())
    return selectables
  }
    
  selectedItems(actions: Actions): SelectedItems {
    return this.properties.map(property => ({
      selectType: SelectType.Mash, property, 
      value: this.value(property.name),
      changeHandler: (property: string, value: Scalar) => {
        assertPopulatedString(property, 'changeMash property')

        const redoValue = isUndefined(value) ? this.value(property) : value
        const undoValue = this.value(property)
        const options: UnknownObject = {
          property, target: this, redoValue, undoValue, type: ActionType.Change
        }
        actions.create(options)
      }
    }))
  }

  setDrawInterval(): void {
    if (this.drawInterval) return 

    this.clearDrawInterval()
    this.drawInterval = setInterval(() => { this.handleDrawInterval() }, 500 / this.time.fps)
  }

  get stalled(): boolean { return !this.paused && !this.playing }

  get startAndEnd(): Time[] {
    const { time } = this
    const array = [time]
    if (!this.paused) array.push(time.add(this.bufferTime))
    return array
  }

  private stopLoadAndDraw(seeking?: boolean): Promise<void> | undefined {
    const { time, paused, playing } = this
    if (playing) this.playing = false

    const promise = this.loadPromiseUnlessBuffered({
      editing: true, visible: true, audible: playing
    })
    if (promise) return promise.then(() => {
      this.restartAfterStop(time, paused, seeking)
    })
    this.restartAfterStop(time, paused, seeking)
  }

  svg(options: PreviewOptions): Promise<Svg> { 
    return this.preview(options).svg
  }

  svgs(options: PreviewOptions): Promise<Svgs> { 
    return this.preview(options).svgs 
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

  private timeRanges(avType: AVType, startTime?: Time): Times {
    // const { time: startTime, graphType, avType } = args
    const time = startTime || this.time
    const { quantize } = this

    const start = time.scale(this.quantize, 'floor')
    const end = start.isRange ? start.timeRange.endTime : undefined

    const fullRangeClips = this.clipsInTimeOfType(time, avType)
    const { length } = fullRangeClips
    if (!length) return []

    if (length === 1 || !start.isRange || avType === AVType.Audio ) return [time]

    const frames = new Set<number>()
    fullRangeClips.forEach(clip => {
      frames.add(Math.max(clip.frame, start.frame))
      frames.add(Math.min(clip.frame + clip.frames, end!.frame))
    })
    const uniqueFrames = [...frames].sort((a, b) => a - b)
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
    const json: UnknownObject = super.toJSON()
    json.quantize = this.quantize
    // json.backcolor = this.backcolor
    json.tracks = this.tracks

    if (this._rendering) json.rendering = this.rendering
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
