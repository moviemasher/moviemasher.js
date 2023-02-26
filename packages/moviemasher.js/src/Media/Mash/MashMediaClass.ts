import {
  Scalar, UnknownRecord} from "../../declarations"
import { PreviewItems } from "../../Helpers/Svg/Svg"
import { PreloadArgs, PreloadOptions } from "../../Base/Code"
import { SelectedItems, SelectedProperty } from "../../Helpers/Select/SelectedProperty"
import {
  AVType, DataType, Duration, EventType, MashType, SelectType
} from "../../Setup/Enums"
import {
  timeFromArgs, timeFromSeconds, timeRangeFromArgs, timeRangeFromTime, 
  timeRangeFromTimes
} from "../../Helpers/Time/TimeUtilities"
import { Default } from "../../Setup/Default"
import { assertAboveZero, assertPopulatedString, assertPositive, assertTime, assertTrue, isAboveZero, isArray, isBoolean, isDefiniteError, isNumber, isObject, isPositive } from "../../Utility/Is"
import { sortByIndex } from "../../Utility/Sort"
import { Time, Times, TimeRange } from "../../Helpers/Time/Time"
import { isClip, Clip, Clips } from "./Track/Clip/Clip"
import { assertTrack, Track, TrackArgs, TrackObject } from "./Track/Track"
import { AudioPreview } from "../../Editor/Preview/AudioPreview/AudioPreview"
import { AudioPreviewArgs } from "../../Editor/Preview/AudioPreview/AudioPreview"
import { MashEditorArgs, MashMedia, MashMediaArgs, MashMediaContent, MashMediaObject, MashMediaRequest } from "./Mash"
import { trackInstance } from "./Track/TrackFactory"
import { Preview, PreviewArgs, PreviewOptions } from "../../Editor/Preview/Preview"
import { PreviewClass } from "../../Editor/Preview/PreviewClass"
import { Actions } from "../../Editor/Actions/Actions"
import { NonePreview } from "../../Editor/Preview/NonePreview"
import { Selectables } from "../../Editor/Selectable"
import { Propertied } from "../../Base/Propertied"
import { Editor } from "../../Editor/Editor"
import { EmptyMethod } from "../../Setup/Constants"
import { isFont } from "../Font/Font"
import { encodingInstance } from "../../Encode/Encoding/EncodingFactory"
import { Encodings } from "../../Encode/Encoding/Encoding"
import { Emitter } from "../../Helpers/Emitter"
import { isSize, Size, SizeZero } from "../../Utility/Size"
import { MediaBase } from "../MediaBase"
import { propertyInstance } from "../../Setup/Property"
import { colorBlack } from "../../Helpers/Color/ColorFunctions"
import { audioPreviewInstance } from "../../Editor/Preview/AudioPreview/AudioPreviewFactory"
import { MediaCollection } from "../../Base/MediaCollection"
import { errorThrow } from "../../Helpers/Error/ErrorFunctions"
import { ErrorName } from "../../Helpers/Error/ErrorName"
import { requestRecordPromise } from "../../Helpers/Request/RequestFunctions"

type TrackClips = [number, Clips]
type Interval = ReturnType<typeof setInterval>

export class MashMediaClass extends MediaBase implements MashMedia {
  constructor(object: MashMediaObject, args?: MashEditorArgs | Size) {
    super(object)
    const { encodings } = object
    if (isSize(args)) this.imageSize = args
    else if (args) {
      const {
        loop, gain, buffer, size, mediaCollection, emitter, editor, 
      } = args
      if (editor) this.editor = editor
      if (emitter) this.emitter = emitter
      if (size) this.imageSize = size
      if (isObject(mediaCollection)) this._media = mediaCollection
      if (isBoolean(loop)) this.loop = loop
      if (isNumber(gain)) this.gain = gain
      if (isAboveZero(buffer)) this._buffer = buffer
    }
    if (isArray(encodings)) this.encodings.push(...encodings.map(encodingInstance))
    
    this.properties.push(propertyInstance({
      name: 'color', defaultValue: colorBlack, type: DataType.Rgb
    }))

    this._preview = new NonePreview({ mash: this, time: timeFromArgs() })
    // this.label ||= Default.mash.label
    
    this.propertiesInitialize(object)
  }


  declare color: string

  _editor?: Editor 
  get editor(): Editor { return this._editor! }
  set editor(value: Editor) { this._editor = value}

  emitter?: Emitter
 
  imageSize: Size = { ...SizeZero }
  
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
    const args: TrackArgs = { 
      index: this.tracks.length, mashMedia: this, ...options 
    }
    const track = trackInstance(args)
    this.tracks.push(track)
    this.tracks.sort(sortByIndex)
    this.emitter?.emit(EventType.Track)
    return track
  }

  private assureTrack(): void {
    if (!this.tracks.length) {
      const trackArgs: TrackArgs = { dense: true, mashMedia: this }
      const track = trackInstance(trackArgs)
      track.mash = this
      this.tracks.push(track)
    }
  }

  private _buffer = Default.mash.buffer
  get buffer(): number { return this._buffer }
  set buffer(value: number) {
    assertAboveZero(value, 'buffer')
  
    if (this._buffer !== value) {
      this._buffer = value
      if (this._composition) this.composition.buffer = value
    }
  }

  private bufferStart() {
    if (this._bufferTimer) return

    this._bufferTimer = setInterval(() => {
      if (this._paused) return

      const options: PreloadOptions = { 
        editing: true, audible: true 
      }
      this.loadPromise(options)
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
    if (typeof requestAnimationFrame !== 'function') return 
    
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
        gain: this.gain
      }
      this._composition = audioPreviewInstance(options)
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
    const timeChange = time !== this.time
    // console.log(this.constructor.name, "drawTime", time, timeChange)
    this.drawnTime = time
    this.drawRequest()
    this.emitter?.emit(timeChange ? EventType.Time : EventType.Loaded)
  }

  private drawingTime?: Time

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
    assertPositive(value, 'gain')

    if (this._gain !== value) {
      this._gain = value
      if (this._composition) this.composition.setGain(value, this.quantize)
    }
  }

  private graphFileOptions(options: PreloadOptions = {}): PreloadOptions {
    const { time, audible, visible, editing, streaming } = options
    const definedTime = time || this.time
    const { isRange } = definedTime
    const definedVisible = visible || !isRange
    const definedAudible = isRange && audible

    const args: PreloadOptions = {
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

  private _loadMashContentPromise?: Promise<void>
  private _loadedMashContent = false
  private get loadMashContentPromise(): Promise<void> {
    const { _loadedMashContent } = this
    if (_loadedMashContent) return Promise.resolve()

    const { _loadMashContentPromise } = this

    if (!_loadMashContentPromise) {
      const { request } = this

      return this._loadMashContentPromise = requestRecordPromise(request, true).then(orError => {
        if (isDefiniteError(orError)) return errorThrow(orError.error)

        const data = orError.data as MashMediaContent
        const { media, tracks, quantize, color } = data
    
        if (isArray(media)) this.media.define(...media)
        if (isAboveZero(quantize)) this.quantize = quantize
        if (color) this.setValue(color, 'color')
    
        if (isArray(tracks)) tracks.forEach((trackObject, index) => {
          const trackArgs: TrackArgs = {
            mashMedia: this,
            dense: !index, ...trackObject, index
          }
          const track = trackInstance(trackArgs)
          track.assureFrames(this.quantize)
          track.sortClips()
          this.tracks.push(track)
        })
        this.assureTrack()
        this.tracks.sort(sortByIndex)

        this._loadedMashContent = true
        delete this._loadMashContentPromise

      })
    }
    return _loadMashContentPromise
  }

  loadPromise(options: PreloadOptions = {}): Promise<void> {
    return this.loadMashContentPromise.then(() => {
      options.time ||= this.timeToBuffer
      const preloadOptions = this.graphFileOptions(options)
      const { time, audible, visible } = preloadOptions
      const { quantize } = this
      assertTime(time)

      const scaled = time.scale(this.quantize)
      const type = (audible && visible) ? AVType.Both : (audible ? AVType.Audio : AVType.Video)
      const clips = this.clipsInTimeOfType(scaled, type)

      const promises = clips.map(clip => {
        const clipTime = clip.timeRange(quantize)
        const preloadArgs: PreloadArgs = { 
          ...preloadOptions, clipTime, quantize, time 
        }
        return clip.loadPromise(preloadArgs)
      })

      const promise = Promise.all(promises).then(EmptyMethod)
      const removedPromise = promise.then(() => {
        const index = this.loadingPromises.indexOf(promise)
        if (index < 0) return errorThrow(ErrorName.Internal) 

        this.loadingPromises.splice(index, 1)
      })
      this.loadingPromises.push(promise)
      
      return removedPromise
    })
  }

  declare request: MashMediaRequest
  
  private loadingPromises: Promise<void>[] = []

  get loading(): boolean { 
    // console.log(this.constructor.name, "loading", this.loadingPromises.length)
    return !!this.loadingPromises.length 
  }

  loop = false

  private _media?: MediaCollection
  get media(): MediaCollection {
    return this._media ||= new MediaCollection()
  } 

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
      this.loadPromise({
        editing: true, audible: true, visible: true
      }).then(() => { 
        this.bufferStart()
        this.playing = true 
      // console.log("Mash emit", EventType.Play)
        this.emitter?.emit(EventType.Play)
      })
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
        // console.log(this.constructor.name, "playing", value, this.time, clips.length)
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
    return args
  }

  previewItemsPromise(editor?: Editor): Promise<PreviewItems> {
    const options: PreviewOptions = { editor }
    return this.preview(options).previewItemsPromise 
  }
  
  putPromise(): Promise<void> { 
    const { quantize } = this
    
    // make sure we've loaded fonts in order to calculate intrinsic rect
    const promises = this.clips.flatMap(clip => {
      const { container } = clip
      if (isFont(container)) {
        if (!container.intrinsicsKnown({ editing: true, size: true })) {
          
          const args: PreloadArgs = {
            editing: true, visible: true, quantize, 
            time: clip.time(quantize), clipTime: clip.timeRange(quantize)
          }
          return container.loadPromise(args)
        }
      }
      return [] 
    })  
    return Promise.all(promises).then(EmptyMethod)
  }

  quantize = Default.mash.quantize

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
  encodings: Encodings = []

  private restartAfterStop(time: Time, paused: boolean, seeking?: boolean): void {
    if (time.equalsTime(this.time)) { // otherwise we must have gotten a seek call
      if (seeking) {
        delete this.seekTime
        this.emitter?.emit(EventType.Seeked)
      }
      this.drawTime(time)
      if (!paused) this.playing = true
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

  selectables(): Selectables { return [this] }
    
  selectedItems(actions: Actions): SelectedItems {
    const { properties } = this
    const items: SelectedItems = properties.map(property => {
      const undoValue = this.value(property.name)
      const selectedProperty: SelectedProperty = {
        value: undoValue,
        selectType: SelectType.Mash, 
        property, 
        changeHandler: (property: string, redoValue: Scalar) => {
          assertPopulatedString(property)

          const options = { property, target: this, redoValue, undoValue }
          actions.create(options)
        }
      }
      return selectedProperty
    })
    return items
  }

  private setDrawInterval(): void {
    // console.log(this.constructor.name, "setDrawInterval", !!this.drawInterval)
    if (this.drawInterval) return 

    this.clearDrawInterval()
    this.drawInterval = setInterval(() => { this.handleDrawInterval() }, 500 / this.time.fps)
  }

  private stopLoadAndDraw(seeking?: boolean): Promise<void> | undefined {
    const { time, paused, playing } = this
    // console.log(this.constructor.name, 'stopLoadAndDraw', seeking, playing, paused)
    if (playing) this.playing = false

    return this.loadPromise({
      editing: true, visible: true, audible: playing
    }).then(() => {
      this.restartAfterStop(time, paused, seeking)
    })
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

  timeRanges(avType: AVType, startTime?: Time): Times {
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

  toJSON(): UnknownRecord {
    const { encodings, tracks, quantize, frame } = this
    return { 
      ...super.toJSON(), 
      encodings, tracks, quantize
    }
  }

  private trackClips(clips: Clips, trackIndex: number): TrackClips[]  {
    const oneTrack = isPositive(trackIndex)
    if (oneTrack) return [[trackIndex, clips]] 

    let index = this.tracks.length - clips.length
    return clips.map(clip => [index++, [clip]])
  }

  tracks: Track[] = []

  type = MashType
}
