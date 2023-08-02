import type { Actions, NumberEvent, AudioPreview, AudioPreviewArgs, ClientClip, ClientClips, ClientMashAsset, ClientTrack, ClientTracks, Masher, Previews, Selectables, SelectedProperties, SelectedProperty } from '@moviemasher/runtime-client'
import type { AssetCacheArgs, CacheOptions, ClipObject, InstanceCacheArgs, MashAssetObject, Propertied, Property, PropertyId, Scalar, Size, Strings, TargetId, Time, TimeRange, Track, TrackArgs, TrackObject } from '@moviemasher/runtime-shared'
import type { ChangePropertyActionObject } from '../Masher/Actions/Action/ActionTypes.js'
import type { MashPreview, MashPreviewArgs, MashPreviewOptions } from '../Masher/MashPreview/MashPreview.js'

import { AVType, DotChar, ErrorName, arrayFromOneOrMore, errorThrow, isArray } from '@moviemasher/runtime-shared'
import { EventChangeFrame, EventChangedFrame, EventChangedPreviews, EventChangedSize, EventSize, EventTypeDuration, EventTypeEnded, EventTypePause, EventTypePlay, EventTypePlaying, EventTypeSeeked, EventTypeSeeking, EventTypeTracks, MovieMasher, TypeMash } from '@moviemasher/runtime-client'

import { timeFromArgs, timeFromSeconds, timeRangeFromTime, timeRangeFromTimes } from '../../Helpers/Time/TimeUtilities.js'
import { AVTypeAudio, AVTypeBoth, AVTypeVideo } from '../../Setup/AVTypeConstants.js'
import { ActionTypeChange } from '../../Setup/ActionTypeConstants.js'
import { Default } from '../../Setup/Default.js'
import { EmptyFunction } from '../../Setup/EmptyFunction.js'
import { isClip } from '../../Shared/Mash/Clip/ClipFunctions.js'
import { MashAssetClass } from '../../Shared/Mash/MashAssetClass.js'
import { assertDefined, assertPopulatedString, assertPositive, assertTrue, isAboveZero, isPositive } from '../../Shared/SharedGuards.js'
import { isTextInstance } from '../../Shared/Text/TextGuards.js'
import { assertTime } from '../../Shared/TimeGuards.js'
import { sizeAboveZero } from '../../Utility/SizeFunctions.js'
import { sortByIndex } from '../../Utility/SortFunctions.js'
import { audioPreviewInstance } from '../Masher/MashPreview/AudioPreview/AudioPreviewFactory.js'
import { MashPreviewClass } from '../Masher/MashPreview/MashPreviewClass.js'
import { ClientTrackClass } from './ClientTrackClass.js'
import { ClientClipClass } from './ClientClipClass.js'

export type TrackClips = [ClientTrack, ClientClips]
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
    const clips = arrayFromOneOrMore(clip) 
    const clipsByTrack: TrackClips[] = []
    const oneTrack = isPositive(trackIndex)
    if (oneTrack) clipsByTrack.push([this.tracks[trackIndex], clips]) 
    else {
      let index = this.tracks.length - clips.length
      clips.forEach(clip => clipsByTrack.push([this.tracks[index++], [clip]]))
    }
    this.emitIfFramesChange(() => {
      clipsByTrack.forEach(entry => {
        const [insertTrack, insertClips] = entry
        const { index } = insertTrack
        insertClips.forEach(insertClip => {
          const { trackNumber: track } = insertClip
          if (isPositive(track) && track !== index) {
            // console.log(this.constructor.name, 'addClipToTrack', 'removing clip from track', track)
            insertClip.track.removeClips([insertClip])
          }  
          if (isPositive(frame)) insertClip.frame = frame
          insertClip.track = insertTrack
        })
        insertTrack.assureFrames(this.quantize, insertClips)
        insertTrack.addClips(insertClips, insertIndex)
      })
    })
  }
  
  addTrack(options: TrackObject = {}): Track {
    const args: TrackArgs = { 
      index: this.tracks.length, mashAsset: this, ...options 
    }
    const track = this.trackInstance(args) as ClientTrack
    const { tracks } = this
    tracks.push(track)
    tracks.sort(sortByIndex)
    const { length: detail } = tracks

    const event: NumberEvent = new CustomEvent(EventTypeTracks, { detail })
    MovieMasher.eventDispatcher.dispatch(event)
    return track
  }

  buffer = Default.mash.buffer

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
      propertied.setValue(property, value) 
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
    MovieMasher.eventDispatcher.dispatch(new EventChangedPreviews())
  }
  
  definitionIcon(size: Size): Promise<SVGSVGElement> | undefined {
    throw new Error('Method not implemented.')
  }

  destroy(): void {
    this.paused = true
    MovieMasher.eventDispatcher.listenersRemove(this.listeners)
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
    if (typeof requestAnimationFrame !== 'function') return 
    
    requestAnimationFrame(() => {
      // if (this.counter) console.timeEnd(`anim-frame-${this.counter}`)
      // this.counter++
      // console.time(`anim-frame-${this.counter}`)
      this.compositeVisible(time)
    })
  }

  private drawTime(time: Time): void {
    const timeChange = time !== this.time
    // console.log(this.constructor.name, 'drawTime', time, timeChange)
    this.drawnTime = time
    this.drawRequest()

    if (timeChange) {
      const { frame } = timeFromSeconds(time.seconds, this.quantize)
      const event = new EventChangedFrame(frame)
      MovieMasher.eventDispatcher.dispatch(event)
    }
  }

  private drawingTime?: Time

  drawnTime?: Time

  private emitIfFramesChange(method: () => void): void {
    const origFrames = this.frames
    method()
    const { totalFrames: frames } = this
    if (origFrames !== frames) {
      const event = new CustomEvent(EventTypeDuration, { detail: frames })
      MovieMasher.eventDispatcher.dispatch(event)
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

  override initializeProperties(object: MashAssetObject): void {
    const { buffer } = object
    if (isAboveZero(buffer)) this.buffer = buffer

    super.initializeProperties(object)  

    this.listeners[EventSize.Type] = event => event.detail.size = this.size
    MovieMasher.eventDispatcher.listenersAdd(this.listeners)

    MovieMasher.eventDispatcher.dispatch(new EventChangedSize(this.size))
  }

  get loading(): boolean { 
    // console.log(this.constructor.name, 'loading', this.loadingPromises.length)
    return !!this.loadingPromises.length 
  }

  private loadingPromises: Promise<void>[] = []

  putPromise(): Promise<void> { 
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


  protected _preview?: MashPreview
  private preview(options: MashPreviewOptions, masher?: Masher) { 
    return this._preview ||= this.previewInitialize(options, masher) 
  }


  private previewInitialize(options: MashPreviewOptions, masher?: Masher): MashPreview {
    return new MashPreviewClass(this.previewArgs(options, masher))
  }

  private previewArgs(options: MashPreviewOptions = {}, masher: Masher | undefined = undefined): MashPreviewArgs {
    const clip = masher?.selection
    const selectedClip = isClip(clip) ? clip : undefined
    const { drawingTime, time, quantize } = this
    const svgTime = drawingTime || time
    const args: MashPreviewArgs = {
      selectedClip,
      time: svgTime.scale(quantize),
      mash: this,
      ...options,
    }
    // console.log(this.constructor.name, 'previewArgs', args)
    return args
  }

  mashPreviewsPromise(size?: Size, masher?: Masher): Promise<Previews> {
    const options: MashPreviewOptions = { size }
    const preview = this.preview(options, masher)
    return preview.previewsPromise 
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
    const { tracks } = this
    this.emitIfFramesChange(() => { tracks.splice(trackIndex, 1) })
    const { length: detail } = tracks
    const event: NumberEvent = new CustomEvent(EventTypeTracks, { detail })
    MovieMasher.eventDispatcher.dispatch(event)
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
      
      const { frame } = timeFromSeconds(time.seconds, this.quantize)
      const event = new EventChangedFrame(frame)
      MovieMasher.eventDispatcher.dispatch(event)
    }
    return this.stopLoadAndDraw(true)
  }

  selectables(): Selectables { return [this] }
    
  selectedProperties(actions: Actions, propertyNames: Strings): SelectedProperties {

    const names = this.selectorTypesPropertyNames(propertyNames, this.targetId)
    // console.log(this.constructor.name, 'selectedProperties', names, propertyNames)
    return names.map(name => {
      const property = this.propertyFind(name)
      assertDefined(property)
      
      const { targetId } = property
      const propertyId = [targetId, name].join(DotChar) as PropertyId

      const undoValue = this.value(property.name)
      const selectedProperty: SelectedProperty = {
        value: undoValue,
        propertyId, 
        property, 
        changeHandler: (property: string, redoValue?: Scalar) => {
          assertPopulatedString(property)

          const options: ChangePropertyActionObject = { 
            type: ActionTypeChange,
            property, target: this, redoValue, undoValue,
            redoSelection: actions.selection,
            undoSelection: actions.selection,
          }
          actions.create(options)
        }
      }
      return selectedProperty
    })
  }

  private setDrawInterval(): void {
    // console.log(this.constructor.name, 'setDrawInterval', !!this.drawInterval)
    if (this.drawInterval) return 

    this.clearDrawInterval()
    this.drawInterval = setInterval(() => { this.handleDrawInterval() }, 500 / this.time.fps)
  }

  override setValue(name: string, value?: Scalar, property?: Property): void {
    super.setValue(name, value, property)
    if (property) return 

    switch(name) {
      case 'buffer': {
        if (this._composition) this.composition.buffer = Number(value)
        break
      }
      case 'gain': {
        if (this._composition) this.composition.setGain(Number(value), this.quantize) 
        break
      }
      case 'aspectHeight':
      case 'aspectWidth':
      case 'aspectShortest': {
        const { size } = this
        if (sizeAboveZero(size)) {
          MovieMasher.eventDispatcher.dispatch(new EventChangedSize(this.size))
        } else {
          console.trace(this.constructor.name, 'setValue', name, value, property)
        }
        break
      }
    }
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

  targetId: TargetId = TypeMash

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

  override trackInstance(args: TrackArgs): ClientTrack {
    return new ClientTrackClass(args)
  }
  
  declare tracks: ClientTracks
}


