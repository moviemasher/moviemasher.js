import { MovieMasher } from '@moviemasher/runtime-client'
import { AssetCacheArgs, CacheOptions, InstanceCacheArgs, Propertied, Property, Scalar, Size, Time, TimeRange, TypeAudio } from "@moviemasher/runtime-shared"
import { Panel } from "../../Base/PanelTypes.js"
import { ContainerRectArgs } from '@moviemasher/runtime-shared'
import { assertContainerInstance } from '../../Helpers/Container/ContainerFunctions.js'
import { errorThrow } from '@moviemasher/runtime-shared'
import { ErrorName } from '@moviemasher/runtime-shared'
import { SelectedProperties, SelectedProperty } from '@moviemasher/runtime-client'
import { PreviewItem, PreviewItems, SvgItems, SvgOrImage } from '../../Helpers/Svg/Svg.js'
import { svgAppend, svgSetDimensions, svgSvgElement } from '../../Helpers/Svg/SvgFunctions.js'
import { timeFromArgs, timeFromSeconds, timeRangeFromTime, timeRangeFromTimes } from '../../Helpers/Time/TimeUtilities.js'
import { ChangePropertyActionObject } from '../../Plugin/Masher/Actions/Action/ActionTypes.js'
import { Actions } from "@moviemasher/runtime-client"
import { Masher } from '../../Plugin/Masher/Masher.js'
import { AudioPreview, AudioPreviewArgs } from '../../Plugin/Masher/Preview/AudioPreview/AudioPreview.js'
import { audioPreviewInstance } from '../../Plugin/Masher/Preview/AudioPreview/AudioPreviewFactory.js'
import { Preview, PreviewArgs, PreviewOptions } from '../../Plugin/Masher/Preview/Preview.js'
import { PreviewClass } from '../../Plugin/Masher/Preview/PreviewClass.js'
import { Selectables } from '@moviemasher/runtime-client'
import { AVType } from '@moviemasher/runtime-shared'
import { AVTypeAudio, AVTypeBoth, AVTypeVideo } from '../../Setup/AVTypeConstants.js'
import { DataTypeContainerId, DataTypeContentId } from '../../Setup/DataTypeConstants.js'
import { Default } from '../../Setup/Default.js'
import { EmptyFunction } from '../../Setup/EmptyFunction.js'
import { ActionTypeChange, ActionTypeChangeFrame, EventTypeDraw, EventTypeDuration, EventTypeEnded, EventTypeLoaded, EventTypePause, EventTypePlay, EventTypePlaying, EventTypeSeeked, EventTypeSeeking, EventTypeTime, EventTypeTrack, TimingCustom, TypeClip, TypeMash } from '../../Setup/EnumConstantsAndFunctions.js'
import { ClipClass } from '../../Shared/Mash/Clip/ClipClass.js'
import { isClip } from '../../Shared/Mash/Clip/ClipFunctions.js'
import { ClipObject } from '@moviemasher/runtime-shared'
import { MashAssetClass } from '../../Shared/Mash/MashClasses.js'
import { Track, TrackArgs, TrackObject } from '@moviemasher/runtime-shared'
import { assertTrack } from "../../Shared/Mash/Track/TrackGuards.js"
import { assertAboveZero, assertPopulatedString, assertPositive, assertTrue, isPositive } from '../../Shared/SharedGuards.js'
import { isArray } from "@moviemasher/runtime-shared"
import { assertTime } from "../../Shared/TimeGuards.js"
import { isTextInstance } from '../../Shared/Text/TextGuards.js'
import { arrayOfNumbers } from '../../Utility/ArrayFunctions.js'
import { PointZero } from '../../Utility/PointConstants.js'
import { rectsEqual } from '../../Utility/RectFunctions.js'
import { assertSizeAboveZero, sizeCover, sizeEven } from '../../Utility/SizeFunctions.js'
import { sortByIndex } from '../../Utility/SortFunctions.js'
import { ClientAssetManager } from '@moviemasher/runtime-client'
import { assertClientVisibleInstance } from '../ClientGuards.js'
import { ClientInstance, ClientVisibleInstance } from '../ClientTypes.js'
import { pixelToFrame } from '../PixelFunctions.js'
import { ClientClip, ClientClips, ClientMashAsset, ClientTrack, ClientTracks } from './ClientMashTypes.js'
import { ClientTrackClass } from './ClientTrackClass.js'

export type TrackClips = [number, ClientClips]
export type Interval = ReturnType<typeof setInterval>

export class ClientMashAssetClass extends MashAssetClass implements ClientMashAsset {
  assetCachePromise(options: CacheOptions): Promise<void> {
    options.time ||= this.timeToBuffer
    const preloadOptions = this.cacheOptions(options)
    const { time, audible, visible } = options
    const { quantize } = this
    assertTime(time)

    const scaled = time.scale(this.quantize)
    const type = (audible && visible) ? AVTypeBoth : (audible ? AVTypeAudio : AVTypeVideo)
    const clips = this.clipsInTimeOfType(scaled, type)

    const promises = clips.map(clip => {
      const clipTime = clip.timeRange
      const preloadArgs: InstanceCacheArgs = { 
        ...preloadOptions, clipTime, quantize, time 
      }
      return clip.clipCachePromise(preloadArgs)
    })
    const promise = Promise.all(promises).then(EmptyFunction)
    const removedPromise = promise.then(() => {
      const index = this.loadingPromises.indexOf(promise)
      if (index < 0) return errorThrow(ErrorName.Internal) 

      this.loadingPromises.splice(index, 1)
    })
    this.loadingPromises.push(promise)
    
    return removedPromise
  }

  addClipToTrack(clip: ClientClip | ClientClips, trackIndex = 0, insertIndex = 0, frame?: number): void {
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
      index: this.tracks.length, mashAsset: this, ...options 
    }
    const track = this.trackInstance(args) as ClientTrack
    this.tracks.push(track)
    this.tracks.sort(sortByIndex)
    MovieMasher.eventDispatcher.dispatch(EventTypeTrack)
    return track
  }
  
  protected _buffer = Default.mash.buffer
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

      const options: CacheOptions = { audible: true }
      this.assetCachePromise(options)
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
    // console.log(this.constructor.name, 'clearPreview')
    delete this._preview 
  }

  clipInstance(object: ClipObject): ClientClip {
    return new ClientClipClass(object)
  }

  override get clips(): ClientClips { return super.clips as ClientClips }

  clipsInTimeOfType(time: Time, avType?: AVType): ClientClips {
    return super.clipsInTimeOfType(time, avType) as ClientClips
  }


  private _composition?: AudioPreview
  get composition(): AudioPreview {
    if (!this._composition) {
      const options: AudioPreviewArgs = {
        buffer: this.buffer,
        // gain: this.gain
      }
      this._composition = audioPreviewInstance(options)
    }
    return this._composition
  }


  private compositeVisible(time: Time): void {
    this.drawingTime = time
    this.clearPreview()
    MovieMasher.eventDispatcher.dispatch(EventTypeDraw)
  }
  
  private compositeVisibleRequest(time: Time): void {
    // console.log(this.constructor.name, 'compositeVisibleRequest', time)
    if (typeof requestAnimationFrame !== 'function') return 
    
    requestAnimationFrame(() => {
      // if (this.counter) console.timeEnd(`anim-frame-${this.counter}`)
      // this.counter++
      // console.time(`anim-frame-${this.counter}`)
      this.compositeVisible(time)
    })
  }

  definitionIcon(size: Size): Promise<SVGSVGElement> | undefined {
    throw new Error('Method not implemented.')
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
    // console.log(this.constructor.name, 'drawRequest')
    const { time } = this
    this.compositeVisibleRequest(time)
  }

  private drawTime(time: Time): void {
    const timeChange = time !== this.time
    // console.log(this.constructor.name, 'drawTime', time, timeChange)
    this.drawnTime = time
    this.drawRequest()
    MovieMasher.eventDispatcher.dispatch(timeChange ? EventTypeTime : EventTypeLoaded)
  }

  private drawingTime?: Time

  drawnTime?: Time

  private emitIfFramesChange(method: () => void): void {
    const origFrames = this.frames
    method()
    const { totalFrames: frames } = this
    if (origFrames !== frames) {
      MovieMasher.eventDispatcher.dispatch(EventTypeDuration)
      if (this.frame > frames) this.seekToTime(timeFromArgs(frames, this.quantize))
    }
  }
  
  private _frame = 0 // initial frame supplied to constructor

  get frame(): number { return this.time.scale(this.quantize, 'floor').frame }

  private cacheOptions(options: CacheOptions = {}): CacheOptions {
    const { time, audible, visible } = options
    const definedTime = time || this.time
    const { isRange } = definedTime
    const definedVisible = visible || !isRange
    const definedAudible = isRange && audible

    const args: CacheOptions = {
      audible: definedAudible, visible: definedVisible,
      time: definedTime,
      quantize: this.quantize,
    }

    const okay = definedVisible || definedAudible
    // if (!okay) console.log(this.constructor.name, 'graphFileArgs', args)
    assertTrue(okay, 'audible || visible')
    return args
  }

  private handleDrawInterval(): void {
    // console.log(this.constructor.name, 'handleDrawInterval', this._playing)
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
        MovieMasher.eventDispatcher.dispatch(EventTypeEnded)
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


  get loading(): boolean { 
    // console.log(this.constructor.name, 'loading', this.loadingPromises.length)
    return !!this.loadingPromises.length 
  }

  private loadingPromises: Promise<void>[] = []


  declare media: ClientAssetManager
  
  putPromise(): Promise<void> { 
    const { quantize } = this
    
    // make sure we've loaded fonts in order to calculate intrinsic rect
    const promises = this.clips.flatMap(clip => {
      const { container } = clip
      if (container && isTextInstance(container)) {
        if (!container.intrinsicsKnown({ editing: true, size: true })) {
          
          const args: CacheOptions = { visible: true }
          return container.asset.assetCachePromise(args)
        }
      }
      return [] 
    })  
    return Promise.all(promises).then(EmptyFunction)
  }


  private _paused = true
  get paused(): boolean { return this._paused }
  set paused(value: boolean) {
    const paused = value || !this.frames
    // console.log(this.constructor.name, 'set paused', forcedValue)
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
      MovieMasher.eventDispatcher.dispatch(EventTypePause)
    } else {
      this.composition.startContext()
      const { timeToBuffer } = this
      const args: AssetCacheArgs = { 
        time: timeToBuffer, assetTime: timeToBuffer,
        audible: true, visible: true 
      }
      this.assetCachePromise(args).then(() => { 
        this.bufferStart()
        this.playing = true 
      // console.log('Mash emit', EventTypePlay)
        MovieMasher.eventDispatcher.dispatch(EventTypePlay)
      })
    }
  }

  private _playing = false
  private get playing(): boolean { return this._playing }
  private set playing(value: boolean) {
    // console.trace(this.constructor.name, 'set playing', value)
    if (this._playing !== value) {
      this._playing = value
      if (value) {
        const { quantize, time } = this
        const clips = this.clipsAudibleInTime(this.timeToBuffer)
        // console.log(this.constructor.name, 'playing', value, this.time, clips.length)
        if (!this.composition.startPlaying(time, clips, quantize)) {
          // console.log(this.constructor.name, 'playing audio not cached on first try', this.time, clips.length)
          // audio was not cached
          const currentClips = this.clipsAudibleInTime(this.timeToBuffer)
          if (!this.composition.startPlaying(time, currentClips, quantize)) {
            // console.log(this.constructor.name, 'playing audio not cached on second try', this.time, currentClips.length)

            this._playing = false
            return
          }
        }
        MovieMasher.eventDispatcher.dispatch(EventTypePlaying)
        this.setDrawInterval()
      } else {
        this.composition.stopPlaying()
        this.clearDrawInterval()
      }
    }
  }


  protected _preview?: Preview
  private preview(options: PreviewOptions, masher?: Masher) { 
    return this._preview ||= this.previewInitialize(options, masher) 
  }
  private previewInitialize(options: PreviewOptions, masher?: Masher): Preview {
    return new PreviewClass(this.previewArgs(options, masher))
  }

  private previewArgs(options: PreviewOptions = {}, masher: Masher | undefined = undefined): PreviewArgs {
    const clip = masher?.selection.clip
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

  mashPreviewItemsPromise(masher?: Masher): Promise<PreviewItems> {
    const options: PreviewOptions = {}
    return this.preview(options, masher).previewItemsPromise 
  }
  

  reload(): Promise<void> | undefined { return this.stopLoadAndDraw() }

  removeClipFromTrack(clip: ClientClip | ClientClips): void {
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
    MovieMasher.eventDispatcher.dispatch(EventTypeTrack)
  }


  private restartAfterStop(time: Time, paused: boolean, seeking?: boolean): void {
    if (time.equalsTime(this.time)) { // otherwise we must have gotten a seek call
      if (seeking) {
        delete this.seekTime
        MovieMasher.eventDispatcher.dispatch(EventTypeSeeked)
      }
      this.drawTime(time)
      if (!paused) this.playing = true
    }
  }
  
  private seekTime?: Time

  seekToTime(time: Time): Promise<void> | undefined {
    if (this.seekTime !== time) {
      this.seekTime = time
      MovieMasher.eventDispatcher.dispatch(EventTypeSeeking)
      MovieMasher.eventDispatcher.dispatch(EventTypeTime)
    }
    return this.stopLoadAndDraw(true)
  }

  selectType = TypeMash

  selectables(): Selectables { return [this] }
    
  selectedItems(actions: Actions): SelectedProperties {
    const { properties } = this
    const items: SelectedProperties = properties.map(property => {
      const undoValue = this.value(property.name)
      const selectedProperty: SelectedProperty = {
        value: undoValue,
        selectType: TypeMash, 
        property, 
        changeHandler: (property: string, redoValue: Scalar) => {
          assertPopulatedString(property)

          const options: ChangePropertyActionObject = { 
            type: ActionTypeChange,
            property, target: this, redoValue, undoValue,
            redoSelection: { ...actions.selection },
            undoSelection: { ...actions.selection },
          }
          actions.create(options)
        }
      }
      return selectedProperty
    })
    return items
  }

  private setDrawInterval(): void {
    // console.log(this.constructor.name, 'setDrawInterval', !!this.drawInterval)
    if (this.drawInterval) return 

    this.clearDrawInterval()
    this.drawInterval = setInterval(() => { this.handleDrawInterval() }, 500 / this.time.fps)
  }

  private stopLoadAndDraw(seeking?: boolean): Promise<void> | undefined {
    const { time, paused, playing } = this
    // console.log(this.constructor.name, 'stopLoadAndDraw', seeking, playing, paused)
    if (playing) this.playing = false
    
    const args: CacheOptions = { 
      visible: true, audible: playing 
    }

    return this.assetCachePromise(args).then(() => {
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
    // console.log(this.constructor.name, 'timeRange', range, time, endTime)
    return range
  }


  get timeToBuffer(): Time {
    const { time, quantize, buffer, paused } = this
    if (paused) return timeFromArgs(time.scale(quantize, 'floor').frame, quantize)

    return timeRangeFromTimes(time, timeFromSeconds(buffer + time.seconds, time.fps))
  }

  private trackClips(clips: ClientClips, trackIndex: number): TrackClips[]  {
    const oneTrack = isPositive(trackIndex)
    if (oneTrack) return [[trackIndex, clips]] 

    let index = this.tracks.length - clips.length
    return clips.map(clip => [index++, [clip]])
  }


  override trackInstance(args: TrackArgs): ClientTrack {
    return new ClientTrackClass(args)
  }
  
  declare tracks: ClientTracks
}

export class ClientClipClass extends ClipClass implements ClientClip {
  clipIcon(size: Size, scale: number, buffer = 1): Promise<SvgOrImage> | undefined {
    const { container } = this

    if (!container) return 

    const { track } = this


    const { imageSize } = track.mash
    assertSizeAboveZero(imageSize, 'track.mash.imageSize')

    const frameSize = sizeEven(sizeCover(imageSize, size, true))
    assertSizeAboveZero(frameSize, `${this.constructor.name}.clipIcon containedSize`)

    const widthAndBuffer = frameSize.width + buffer
    const cellCount = Math.ceil(size.width / widthAndBuffer)
    const clipTime = this.timeRange
    const { startTime } = clipTime

    const previews: Preview[] = []
    const { mash } = track
    let pixel = 0
    arrayOfNumbers(cellCount).forEach(() => {
      const { copy: time } = startTime
      const previewArgs: PreviewArgs = { 
        mash, time, clip: this, size: frameSize
      }
      const preview = new PreviewClass(previewArgs)
      previews.push(preview)
      pixel += widthAndBuffer
      startTime.frame = clipTime.frame + pixelToFrame(pixel, scale, 'floor')
    })
    
    let svgItemsPromise = Promise.resolve([] as SvgItems)
    previews.forEach(preview => {
      svgItemsPromise = svgItemsPromise.then(items => {
        return preview.svgItemsPromise.then(svgItems => {
          return [...items, ...svgItems]
        })
      })
    })
 
    return svgItemsPromise.then(svgItems => {
      const point = { ...PointZero }
      const containerSvg = svgSvgElement(size)
      svgItems.forEach(groupItem => {
        svgSetDimensions(groupItem, point)
        svgAppend(containerSvg, groupItem)
        point.x += widthAndBuffer
      })
      return containerSvg
    })
  }

  override get container(): ClientVisibleInstance { return super.container as ClientVisibleInstance}

  override get content(): ClientInstance { return super.content as ClientInstance }

  clipPreviewItemsPromise(size: Size, time: Time, component: Panel): Promise<PreviewItem> {
    assertSizeAboveZero(size)

    const { container, content } = this
    assertContainerInstance(container)
  
    const containerRectArgs: ContainerRectArgs = {
      size, time, timeRange: this.timeRange, editing: true, //loading: true,
    }
    // console.log(this.constructor.name, 'previewItemsPromise rects', containerRectArgs)
    const containerRects = this.rects(containerRectArgs)
    assertTrue(rectsEqual(...containerRects))

    const [containerRect] = containerRects
    assertClientVisibleInstance(content)
    return container.clippedPreviewItemPromise(content, containerRect, size, time, component)
  }

  selectables(): Selectables { return [this, ...this.track.selectables()] }

  selectedItems(actions: Actions): SelectedProperties {
    const selected: SelectedProperties = []
    const { properties } = this
    const props = properties.filter(property => this.selectedProperty(property))
    props.forEach(property => {
      const { name } = property
      const isFrames = name === 'frames' || name === 'frame'
      const undoValue = this.value(name)
      selected.push({
        value: undoValue,
        selectType: TypeClip, property, 
        changeHandler: (property: string, redoValue: Scalar) => {
          assertPopulatedString(property)

          const options: ChangePropertyActionObject = { 
            property, target: this, redoValue, undoValue,
            type: isFrames ? ActionTypeChangeFrame : ActionTypeChange,
            redoSelection: { ...actions.selection },
            undoSelection: { ...actions.selection },
          }
          actions.create(options)
        }
      })
    })
    return selected
  }

  private selectedProperty(property: Property): boolean {
    const { name, type } = property
    switch(type) {
      case DataTypeContainerId:
      case DataTypeContentId: return false
    }
    switch(name) {
      case 'sizing': return this.content.asset.type !== TypeAudio
      case 'timing': {
        if (this.content.hasIntrinsicTiming) break
        return !!this.container?.hasIntrinsicSizing
      }
      case 'frame': return !this.track.dense
      case 'frames': return this.timing === TimingCustom
    }
    return true
  }  
  
  declare track: ClientTrack

}

