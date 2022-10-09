import {
  Interval, PreviewItems, Scalar, SvgItem, UnknownObject} from "../../declarations"
import { GraphFiles, GraphFileArgs, GraphFileOptions } from "../../MoveMe"
import { SelectedItems } from "../../Utility/SelectedProperty"
import {
  AVType, Duration, EventType, GraphType, SelectType
} from "../../Setup/Enums"
import { EmptyMethod } from "../../Setup/Constants"
import { Errors } from "../../Setup/Errors"
import { Default } from "../../Setup/Default"
import { assertPopulatedString, assertPositive, assertTime, assertTrue, isAboveZero, isArray, isPopulatedArray, isPopulatedString, isPositive, isUndefined } from "../../Utility/Is"
import { sortByIndex } from "../../Utility/Sort"
import { Time, Times, TimeRange } from "../../Helpers/Time/Time"
import { isClip, Clip, Clips } from "./Track/Clip/Clip"
import { assertTrack, Track, TrackArgs, TrackObject } from "./Track/Track"
import { AudioPreview, AudioPreviewArgs } from "./Preview/AudioPreview/AudioPreview"
import { Mash, MashArgs } from "./Mash"
import { FilterGraphs, FilterGraphsArgs, FilterGraphsOptions } from "./FilterGraphs/FilterGraphs"
import { FilterGraphsClass } from "./FilterGraphs/FilterGraphsClass"
import {
  timeFromArgs, timeFromSeconds, timeRangeFromArgs, timeRangeFromTime, timeRangeFromTimes
} from "../../Helpers/Time/TimeUtilities"
import { trackInstance } from "./Track/TrackFactory"
import { EditedClass } from "../EditedClass"
import { Preview, PreviewArgs, PreviewOptions } from "./Preview/Preview"
import { PreviewClass } from "./Preview/PreviewClass"
import { LayerMash } from "../Cast/Layer/Layer"
import { Actions } from "../../Editor/Actions/Actions"
import { NonePreview } from "./Preview/NonePreview"
import { Selectables } from "../../Editor/Selectable"
import { isTextContainer } from "../../Container/TextContainer/TextContainer"
import { Propertied } from "../../Base/Propertied"
type TrackClips = [number, Clips]

export class MashClass extends EditedClass implements Mash {
  constructor(args: MashArgs) {
    super(args)
    const {
      createdAt, icon, id, label,
      frame,
      preloader,
      rendering,
      tracks,
      ...rest
    } = args
    this.dataPopulate(rest)
    if (isPopulatedString(rendering)) this._rendering = rendering
    if (isPopulatedString(createdAt)) this.createdAt = createdAt
    if (isAboveZero(frame)) this._frame = frame
    if (isPopulatedArray(tracks)) tracks.forEach((trackObject, index) => {
      const trackArgs: TrackArgs = {
        dense: !index, ...trackObject, index
      }
      const track = trackInstance(trackArgs)
      track.mash = this
      track.assureFrames(this.quantize)
      track.sortClips()
      this.tracks.push(track)
    })
    this.assureTrack()
    this.tracks.sort(sortByIndex)
    this._preview = new NonePreview({ mash: this, time: timeFromArgs() })
    this.label ||= Default.mash.label
  }

  addClipToTrack(clip: Clip | Clips, trackIndex = 0, insertIndex = 0, frame?: number): void {
    const clipsArray = isArray(clip) ? clip : [clip]
    const trackClips = this.trackClips(clipsArray, trackIndex)    
    this.emitIfFramesChange(() => {
      trackClips.forEach(entry => {
        const [index, clips] = entry
        const newTrack = this.tracks[index]
        assertTrack(newTrack, 'track')
    
        clips.forEach(clip => {
          const oldTrackNumber = clip.trackNumber
          if (isPositive(oldTrackNumber) && oldTrackNumber !== index) {
            clip.track.removeClips([clip])
          }  
          if (isPositive(frame)) clip.frame = frame
          clip.track = newTrack
        })
        newTrack.assureFrames(this.quantize, clips)
        newTrack.addClips(clips, insertIndex)
      })
    })
  }

  addTrack(options: TrackObject = {}): Track {
    if (!isPositive(options.index)) options.index = this.tracks.length
    const track = trackInstance(options)
    track.mash = this
    this.tracks.push(track)
    this.tracks.sort(sortByIndex)
    this.emitter?.emit(EventType.Track)
    return track
  }

  private assureTrack(): void {
    if (!this.tracks.length) {
      const trackArgs: TrackObject = { dense: true }
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

  private bufferStart() {
    if (this._bufferTimer) return

    this._bufferTimer = setInterval(() => {
      if (this._paused) return

      const options: GraphFileOptions = { 
        editing: true, audible: true 
      }
      this.loadPromiseUnlessBuffered(options)
      const clips = this.clipsAudibleInTime(this.timeToBuffer)
      this.composition.bufferClips(clips, this.quantize)
    }, Math.round((this.buffer * 1000) / 2))
  }

  private bufferStop() {
    if (!this._bufferTimer) return

    clearInterval(this._bufferTimer)
    delete this._bufferTimer
  }

  private _bufferTimer?: Interval

  changeTiming(propertied: Propertied, property: string, value: number): void {
    this.emitIfFramesChange(() => {
      propertied.setValue(value, property) 
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

  get clips(): Clip[] {
    return this.tracks.map(track => track.clips).flat() 
  }

  private clipsAudibleInTime(time: Time): Clip[] {
    const { clips } = this
    const clipsAudible = clips.filter(clip => clip.mutable && clip.notMuted)
    return this.filterIntersecting(clipsAudible, time)
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

  private compositeVisible(time: Time): void {
    this.drawingTime = time
    this.clearPreview()
    this.emitter?.emit(EventType.Draw)
  }
  // private counter = 0
  private compositeVisibleRequest(time: Time): void {
    // console.log(this.constructor.name, "compositeVisibleRequest", time)
    requestAnimationFrame(() => {
      // if (this.counter) console.timeEnd(`anim-frame-${this.counter}`)
      // this.counter++
      // console.time(`anim-frame-${this.counter}`)
      this.compositeVisible(time)
    })
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

  private drawingTime?: Time

  private drawnSeconds = 0

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
    const { background, time, avType, graphType, size, videoRate, ...rest } = options
    const definedTime = time || this.time
    const definedAVType = avType || (definedTime.isRange ? AVType.Both : AVType.Video)
    const filterGraphsOptions: FilterGraphsArgs = {
      ...rest,
      times: this.timeRanges(definedAVType, definedTime),
      avType: definedAVType,
      graphType: graphType || GraphType.Mash,
      size: size || this.imageSize,
      videoRate: videoRate || definedTime.fps,
      mash: this,
      background: background || this.color,
    }
    // console.log(this.constructor.name, "filterGraphs filterGraphsOptions", filterGraphsOptions.upload, options.upload)

    return new FilterGraphsClass(filterGraphsOptions)
  }

  private filterIntersecting(clips: Clips, time: Time): Clip[] {
    const scaled = time.scale(this.quantize)
    return clips.filter(clip => this.clipIntersects(clip, scaled)) as Clip[]
  }

  private _frame = 0 // initial frame supplied to constructor

  get frame(): number { return this.time.scale(this.quantize, "floor").frame }

  get frames(): number {
    const { tracks } = this
    if (tracks.length) {
      const frames = this.tracks.map(track => track.frames)
      if (isPositive(Math.min(...frames))) return Math.max(0, ...frames)
      
      return Duration.Unknown
    } 
    return Duration.None
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

  private graphFileOptions(options: GraphFileOptions = {}): GraphFileOptions {
    const { time, audible, visible, editing, streaming } = options
    const definedTime = time || this.time
    const { isRange } = definedTime
    const definedVisible = visible || !isRange
    const definedAudible = isRange && audible

    const args: GraphFileOptions = {
      editing,
      streaming,
      audible: definedAudible, visible: definedVisible,
      time: definedTime,
      quantize: this.quantize,
    }

    const okay = definedVisible || definedAudible
    // if (!okay) console.log(this.constructor.name, "graphFileArgs", args)
    assertTrue(okay, "audible || visible")
    return args
  }

  editedGraphFiles(options?: GraphFileOptions): GraphFiles {
    const args = this.graphFileOptions(options)
    const { time, audible, visible } = args
    const { quantize } = this
    assertTime(time)

    const scaled = time.scale(this.quantize)
    const type = (audible && visible) ? AVType.Both : (audible ? AVType.Audio : AVType.Video)
    const clips = this.clipsInTimeOfType(scaled, type)
    return clips.flatMap(clip => {
      const clipTime = clip.timeRange(quantize)
      const graphFileArgs: GraphFileArgs = { 
        ...args, clipTime, quantize, time 
      }
      return clip.clipFileUrls(graphFileArgs)
    })
  }

  private graphFilesUnloaded(options: GraphFileOptions): GraphFiles {
    const files = this.editedGraphFiles(options)
    if (!files.length) return []

    const { preloader } = this
    return files.filter(file => !preloader.loadedFile(file))
  }

  private handleDrawInterval(): void {
    // console.log(this.constructor.name, "handleDrawInterval", this._playing)
    // what time does the audio context think it is?
    const { seconds } = this.composition

    // what time would masher consider to be in end frame?
    const nextFrameTime = this.time.withFrame(this.time.frame)

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

  private loadingPromises: Promise<void>[] = []

  get loading(): boolean { return !!this.loadingPromises.length }

  private loadPromiseUnlessBuffered(options: GraphFileOptions = {}): Promise<void> | undefined {
    options.time ||= this.timeToBuffer

    const files = this.graphFilesUnloaded(options)
    if (!files.length) {
      // console.log(this.constructor.name, "loadPromiseUnlessBuffered no unloaded graph files")
      return
    }


    const promise = this.preloader.loadFilesPromise(files)
    const removedPromise = promise.then(() => {
      const index = this.loadingPromises.indexOf(promise)
      if (index < 0) throw Errors.internal + "couldn't find promise~"

      this.loadingPromises.splice(index, 1)
    })
    this.loadingPromises.push(promise)
    
    return removedPromise
  }

  loop = false

  get mashes(): Mash[] { return [this] }

  private _paused = true
  get paused(): boolean { return this._paused }
  set paused(value: boolean) {
    const paused = value || !this.frames
    // console.log(this.constructor.name, "set paused", forcedValue)
    if (this._paused === paused) return

    this._paused = paused
    if (paused) {
      this.playing = false
      this.bufferStop()
      if (this._bufferTimer) {
        clearInterval(this._bufferTimer)
        delete this._bufferTimer
      }
      this.composition.stopContext()
      this.emitter?.emit(EventType.Pause)
    } else {
      this.composition.startContext()
      this.bufferStart()
      const promise = this.loadPromiseUnlessBuffered({
        editing: true, audible: true, visible: true
      })
      if (promise) promise.then(() => { 
        this.playing = true 
      })
      else this.playing = true
      // console.log("Mash emit", EventType.Play)
      this.emitter?.emit(EventType.Play)
    }
  }

  private _playing = false
  private get playing(): boolean { return this._playing }
  private set playing(value: boolean) {
    // console.trace(this.constructor.name, "set playing", value)
    if (this._playing !== value) {
      this._playing = value
      if (value) {
        const { quantize, time } = this
        const clips = this.clipsAudibleInTime(this.timeToBuffer)
        // console.log("playing", value, this.time, clips.length)
        if (!this.composition.startPlaying(time, clips, quantize)) {
          // console.log(this.constructor.name, "playing audio not cached on first try", this.time, clips.length)
          // audio was not cached
          const currentClips = this.clipsAudibleInTime(this.timeToBuffer)
          if (!this.composition.startPlaying(time, currentClips, quantize)) {
            // console.log(this.constructor.name, "playing audio not cached on second try", this.time, currentClips.length)

            this._playing = false
            return
          }
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
  private preview(options: PreviewOptions) { 
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
      selectedClip,
      time: svgTime.scale(quantize),
      mash: this,
      ...options,
    }
    if (isUndefined(options.background)) args.background = this.color
    
    return args
  }

  putPromise(): Promise<void> { 
    const { quantize, preloader } = this
    
    // make sure we've loaded fonts in order to calculate intrinsic rect
    const files = this.clips.flatMap(clip => {
      const { container } = clip
      if (isTextContainer(container)) {
        if (!container.intrinsicsKnown({ editing: true, size: true })) {
          const args: GraphFileArgs = {
            editing: true, visible: true, quantize, 
            time: clip.time(quantize), clipTime: clip.timeRange(quantize)
          }
          return container.fileUrls(args)
        }
      }
      return [] 
    })  
    return preloader.loadFilesPromise(files)
  }

  removeClipFromTrack(clip: Clip | Clips): void {
    const clips = isArray(clip) ? clip : [clip]
    this.emitIfFramesChange(() => { 
      clips.forEach(clip => {
        const track = clip.track
        track.removeClips([clip]) 
      })
    })
  }

  removeTrack(index?: number): void {
    const trackIndex = isPositive(index) ? index : this.tracks.length - 1
    assertPositive(trackIndex)
 
    this.emitIfFramesChange(() => { this.tracks.splice(trackIndex, 1) })
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
        // this.composition.startContext()
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
    return this.properties.map(property => {
      const undoValue = this.value(property.name)
      const target = this
      return {
        value: undoValue,
        selectType: SelectType.Mash, property, 
        changeHandler: (property: string, redoValue: Scalar) => {
          assertPopulatedString(property)

          const options = { property, target, redoValue, undoValue }
          actions.create(options)
        }
      }
    })
  }

  private setDrawInterval(): void {
    if (this.drawInterval) return 

    this.clearDrawInterval()
    this.drawInterval = setInterval(() => { this.handleDrawInterval() }, 500 / this.time.fps)
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

  previewItems(options: PreviewOptions): Promise<PreviewItems> { 
    return this.preview(options).previewItemsPromise 
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
    json.tracks = this.tracks
    if (this._rendering) json.rendering = this.rendering
    return json
  }

  private trackClips(clips: Clips, trackIndex: number): TrackClips[]  {
    const oneTrack = isPositive(trackIndex)
    if (oneTrack) return [[trackIndex, clips]] 

    let index = this.tracks.length - clips.length
    return clips.map(clip => [index++, [clip]])
  }

  tracks: Track[] = []
}
