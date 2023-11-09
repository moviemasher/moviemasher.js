import type { Action, Actions, AudioPreview, AudioPreviewArgs, ClientClip, ClientClips, ClientMashAsset, ClientMashAssetObject, ClientTrack, ClientTracks, NumberEvent, Previews, ServerProgress } from '@moviemasher/runtime-client'
import type { AVType, AssetCacheArgs, CacheOptions, ClipObject, Encodings, EventDispatcherListenerRecord, Propertied, Property, Scalar, Size, StringDataOrError, TargetId, Time, TimeRange, Track, TrackArgs, TrackObject, UnknownRecord } from '@moviemasher/runtime-shared'
import type { MashPreview, MashPreviewArgs, MashPreviewOptions } from '../../Client/Masher/MashPreview/MashPreview.js'

import { arrayFromOneOrMore, DOT, Default, EmptyFunction, MashAssetMixin, assertPositive, isAboveZero, isPositive, isPropertyId, isTextInstance, sizeAboveZero, sortByIndex, timeFromArgs, timeFromSeconds, timeRangeFromTime, timeRangeFromTimes } from '@moviemasher/lib-shared'
import { EventChanged, EventChangedFrame, EventChangedFrames, EventChangedPreviews, EventChangedServerAction, EventChangedSize, EventFrames, EventSize, EventTypeEnded, EventTypePause, EventTypePlay, EventTypePlaying, EventTypeSeeked, EventTypeSeeking, EventTypeTracks, MovieMasher, ServerActionSave } from '@moviemasher/runtime-client'
import { TARGET_CONTENT, MASH, isArray, isDefiniteError } from '@moviemasher/runtime-shared'
import { ClientClipClass } from '../../Client/Mash/ClientClipClass.js'
import { isClientClip } from '../../Client/Mash/ClientMashGuards.js'
import { ClientTrackClass } from '../../Client/Mash/ClientTrackClass.js'
import { isChangePropertyAction } from '../../Client/Masher/Actions/Action/ActionFunctions.js'
import { ActionsClass } from '../../Client/Masher/Actions/ActionsClass.js'
import { audioPreviewInstance } from '../../Client/Masher/MashPreview/AudioPreview/AudioPreviewFactory.js'
import { MashPreviewClass } from '../../Client/Masher/MashPreview/MashPreviewClass.js'
import { ClientAssetClass } from '../ClientAssetClass.js'

type TrackClips = [ClientTrack, ClientClips]
type Interval = ReturnType<typeof setInterval>

const WithMashAsset = MashAssetMixin(ClientAssetClass)
export class ClientMashAssetClass extends WithMashAsset implements ClientMashAsset {
  constructor(args: ClientMashAssetObject) {
    super(args)
    this.listeners[EventFrames.Type] = this.handleFrames.bind(this)
    this.listeners[EventSize.Type] = this.handleSize.bind(this)
    this.actions = new ActionsClass(this)
  }
  
  actions: Actions

  // override assetCachePromise(options: AssetCacheArgs): Promise<void> {
  //   options.time ||= this.timeToBuffer
  //   const preloadOptions = this.cacheOptions(options)
  //   const { time, audible, visible } = options
  //   const { quantize } = this
  //   assertTime(time)

  //   const scaled = time.scale(this.quantize)
  //   const type = (audible && visible) ? AVTypeBoth : (audible ? AVTypeAudio : AVTypeVideo)
  //   const clips = this.clipsInTimeOfType(scaled, type)

  //   const promises = clips.map(clip => {
  //     const clipTime = clip.timeRange
  //     const preloadArgs: InstanceCacheArgs = { 
  //       ...preloadOptions, clipTime, quantize, time 
  //     }
  //     return clip.clipCachePromise(preloadArgs)
  //   })
  //   const promise = Promise.all(promises).then(EmptyFunction)
  //   const removedPromise = promise.then(() => {
  //     const index = this.loadingPromises.indexOf(promise)
  //     if (index < 0) return errorThrow(ERROR.Internal) 

  //     this.loadingPromises.splice(index, 1)
  //   })
  //   this.loadingPromises.push(promise)
    
  //   return removedPromise
  // }

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


  override get assetObject(): ClientMashAssetObject {
    const object = super.assetObject
    const { encodings } = this
    return { ...object, encodings }
  }

  buffer = Default.mash.buffer

  private bufferStart() {
    if (this._bufferTimer) return

    this._bufferTimer = setInterval(() => {
      if (this._paused) return

      const { timeToBuffer: time } = this
      const options: AssetCacheArgs = { audible: true, assetTime: time, time }
      this.assetCachePromise(options)
      const clips = this.clipsAudibleInTime(time)
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

  override clipInstance(object: ClipObject): ClientClip {
    return new ClientClipClass(object)
  }

  override get clips(): ClientClips { return super.clips as ClientClips }

  override clipsInTimeOfType(time: Time, avType?: AVType): ClientClips {
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
    return this._composition!
  }

  
  override assetIcon(_size: Size): Promise<SVGSVGElement> | undefined {
    return
  }

  destroy(): void {
    this.paused = true
    MovieMasher.eventDispatcher.listenersRemove(this.listeners)
    this.clearDrawInterval()

  }

  dispatchChanged(action: Action): void {
    this.clearPreview()
    if (isChangePropertyAction(action)) {
      const { property, target } = action
      switch(property) {
        case `${TARGET_CONTENT}${DOT}gain`: {
          if (isClientClip(target)) {
            this.composition.adjustClipGain(target, this.quantize)
          }    
          break
        }
      }
    }
    
    // console.log(this.constructor.name, 'dispatchChanged', action.constructor.name)
    MovieMasher.eventDispatcher.dispatch(new EventChanged(action))
    MovieMasher.eventDispatcher.dispatch(new EventChangedServerAction(ServerActionSave))
    // const promise = this.reload() || Promise.resolve()
    
    // promise.then(() => this.dispatchDrawLater())
    this.draw()
  }

  private dispatchChangedPreviews(time: Time): void {
    this.drawingTime = time
    this.clearPreview()
    MovieMasher.eventDispatcher.dispatch(new EventChangedPreviews())
  }

  draw(): void { this.dispatchChangedPreviews(this.time) }

  private drawInterval?: Interval

  private drawRequest(): void {
    const { time } = this
    requestAnimationFrame(() => { this.dispatchChangedPreviews(time) })
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
      MovieMasher.eventDispatcher.dispatch(new EventChangedFrames(frames))
      if (this.frame > frames) this.seekToTime(timeFromArgs(frames, this.quantize))
    }
  }
  
  encodings: Encodings = []

  private _frame = 0 // initial frame supplied to constructor

  get frame(): number { return this.time.scale(this.quantize, 'floor').frame }

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

  private handleFrames(event: EventFrames) {
    const { totalFrames } = this
    // console.log(this.constructor.name, 'handleFrames', totalFrames)
    event.detail.frames = totalFrames
  }

  private handleSize(event: EventSize): void {
    event.detail.size = this.size
    event.stopImmediatePropagation()
  }

  override initializeProperties(object: ClientMashAssetObject): void {
    const { buffer } = object
    if (isAboveZero(buffer)) this.buffer = buffer

    const { encodings } = object 
    if (isArray(encodings)) this.encodings.push(...encodings)
    super.initializeProperties(object)  

    MovieMasher.eventDispatcher.listenersAdd(this.listeners)
    MovieMasher.eventDispatcher.dispatch(new EventChangedSize(this.size))
    MovieMasher.eventDispatcher.dispatch(new EventChangedFrames(this.totalFrames))
  }

  get loading(): boolean { 
    // console.log(this.constructor.name, 'loading', this.loadingPromises.length)
    return !!this.loadingPromises.length 
  }

  private loadingPromises: Promise<void>[] = []
  
  protected listeners: EventDispatcherListenerRecord = {}
  
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
  private preview(options: MashPreviewOptions, selectedClip?: ClientClip) { 
    return this._preview ||= this.previewInitialize(options, selectedClip) 
  }


  private previewInitialize(options: MashPreviewOptions, selectedClip?: ClientClip): MashPreview {
    return new MashPreviewClass(this.previewArgs(options, selectedClip))
  }

  private previewArgs(options: MashPreviewOptions = {}, selectedClip?: ClientClip): MashPreviewArgs {
    const { drawingTime, time, quantize } = this
    const svgTime = drawingTime || time
    const args: MashPreviewArgs = {
      selectedClip,
      time: svgTime.scale(quantize, 'floor'),
      mash: this,
      ...options,
    }
    return args
  }

  mashPreviewsPromise(size?: Size, selectedClip?: ClientClip): Promise<Previews> {
    const options: MashPreviewOptions = { size }
    const preview = this.preview(options, selectedClip)
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
  
  override get saveNeeded(): boolean { 
    return this.actions.canSave
  }

  override savePromise(progress?: ServerProgress): Promise<StringDataOrError> { 
    const promise = this.savingPromise(progress)
    return promise.then(orError => {
      if (!isDefiniteError(orError)) {
        this.actions.save()
        // console.log(this.constructor.name, 'ClientMashAssetClass savePromise calling', orError.data)
        this.saveId(orError.data)
      }
      return orError
    })
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

  private setDrawInterval(): void {
    // console.log(this.constructor.name, 'setDrawInterval', !!this.drawInterval)
    if (this.drawInterval) return 

    this.clearDrawInterval()
    this.drawInterval = setInterval(() => { this.handleDrawInterval() }, 500 / this.time.fps)
  }

  override setValue(id: string, value?: Scalar, property?: Property): void {
    super.setValue(id, value, property)
    if (property) return 
    
    const name = isPropertyId(id) ? id.split(DOT).pop() : id
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
        } 
        break
      }
    }
  }

  private stopLoadAndDraw(seeking?: boolean): Promise<void> | undefined {
    const { time, paused, playing } = this
    // console.log(this.constructor.name, 'stopLoadAndDraw', seeking, playing, paused)
    if (playing) this.playing = false
    
    const args: AssetCacheArgs = { time, visible: true, audible: playing }

    return this.assetCachePromise(args).then(() => {
      this.restartAfterStop(time, paused, seeking)
    })
  }

  override targetId: TargetId = MASH

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

  override toJSON(): UnknownRecord {
    const { encodings } = this
    return { ...super.toJSON(), encodings }
  }


  override trackInstance(args: TrackArgs): ClientTrack {
    return new ClientTrackClass(args)
  }
  
  declare tracks: ClientTracks

  updateAssetId(oldId: string, newId: string): void {
    // console.log(this.constructor.name, 'updateAssetId', oldId, newId)
    this.clips.forEach(clip => clip.updateAssetId(oldId, newId))
  }
}
