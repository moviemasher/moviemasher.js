import type { AVType, AbsolutePath, Aspect, AssetFiles, AssetFunction, AudibleInstance, AudioCommandFileArgs, CacheArgs, ClipObject, CommandFile, CommandFiles, ContainerRectArgs, ContainerSvgItemArgs, ContentRectArgs, ContentSvgItemArgs, DataOrError, EvaluationPoint, EvaluationRect, EvaluationSize, EvaluationValue, Rect, RectTuple, Rounding, ServerClip, ServerClips, ServerMashAsset, ServerMashVideoAsset, ServerMashVideoInstance, ServerTrack, Size, SizeKey, SizeTuple, Strings, SvgItemArgs, SvgItemsRecord, Time, TimeRange, TrackArgs, Transparency, ValueRecord, Values, VideoCommandFileOptions, VisibleCommandFileArgs, VisibleInstance } from '../types.js'
import type { AssetArgs, AssetCacheArgs, Assets, AudioPreview, ChangeEditObject, ChangePropertiesEditObject, ClientClip, ClientClips, ClientInstance, ClientMashAsset, ClientMashDescription, ClientMashDescriptionArgs, ClientMashDescriptionOptions, ClientTrack, ClientTracks, ClientVisibleInstance, Clip, ClipIconArgs, Clips, ContainerInstance, Edit, Edits, Instance, MashAssetObject, MashDescriptionArgs, Panel, Propertied, Property, PropertyId, Resource, Scalar, ScalarTuple, ScalarsById, ServerProgress, StringDataOrError, SvgElement, SvgItems, TargetId, Track, TrackObject } from '../types.js'
import type { ClientMashVideoAsset, ClientMashVideoInstance } from '../types.js'
import type { AudibleCommandFilterArgs, CommandFilter, CommandFilters, ServerAudioInstance, ServerContainerInstance, ServerContentInstance, ServerMashDescription, ServerMashDescriptionOptions, Tweening, VideoCommandFilterArgs, VisibleCommandFilterArgs } from "../types.js"

import { ClipClass } from '../base/clip.js'
import { ServerAssetClass } from '../base/server-asset.js'
import { ServerInstanceClass } from '../base/server-instance.js'
import { TrackClass } from '../base/track.js'
import { AudibleAssetMixin, AudibleInstanceMixin } from '../mixin/audible.js'
import { MashAssetMixin } from '../mixin/mash.js'
import { ServerAudibleAssetMixin, ServerAudibleInstanceMixin } from '../mixin/server-audible.js'
import { ServerVisibleAssetMixin, ServerVisibleInstanceMixin } from '../mixin/server-visible.js'
import { VideoAssetMixin, VideoInstanceMixin } from '../mixin/video.js'
import { VisibleAssetMixin, VisibleInstanceMixin } from '../mixin/visible.js'
import { $ALPHA, $ASPECT, $AUDIO, $CEIL, $DIVIDE, $END, $FRAME, $HEIGHT, $MASH, $NUMBER, $OPACITY, $POINT, $SERVER, $SIZE, $SUBTRACT, $SVG, $SVGS, $VARIABLE, $VIDEO, $WIDTH, COLON, DASH, DOT, ERROR, POINT_KEYS, POINT_ZERO, RECTS_ZERO, RECT_KEYS, RECT_ZERO, RGBA_BLACK_ZERO, RGB_BLACK, RGB_WHITE, SIZE_KEYS, SLASH, arrayLast, arraySet, errorThrow, idGenerate, isAssetObject, isDefiniteError, namedError, pathJoin } from '../runtime.js'
import { Eval } from '../utility/evaluation.js'
import { isBelowOne, isDefined, isNumber, isNumeric, isValue } from '../utility/guard.js'
import { assertAbsolutePath, assertAspect, assertCanBeContainerInstance, assertDefined, assertServerAudibleInstance, assertTransparency, assertTrue, assertVisibleInstance, isAudibleInstance, isVisibleInstance } from '../utility/guards.js'
import { assertSizeNotZero, containerEvaluationPoint, contentEvaluationSize, copyPoint, copyRect, copySize, evenEvaluationSize, orientPoint, pointsEqual, rectsEqual, scaleContentEvaluationPoint, sizeNotZero, sizeString, sizeValid, sizeValueString, sizesEqual, translateEvaluationPoint, translatePoint, tweenEvaluation, tweenEvaluationPoint, tweenEvaluationSize, unionRects } from '../utility/rect.js'
import { appendSvgItemsRecord, mergeSvgItemsRecords, simplifyRecord, svgPolygonElement } from '../utility/svg.js'
import { assertTimeRange } from '../utility/time.js'
import { ClientAssetClass } from '../base/client-asset.js'
import { ClientInstanceClass } from '../base/client-instance.js'
import { ClientAudibleAssetMixin, ClientAudibleInstanceMixin } from '../mixin/client-audible.js'
import { ClientVisibleAssetMixin, ClientVisibleInstanceMixin } from '../mixin/client-visible.js'
import { $CAN, $CHANGE, $CHANGES, $CLIENT, $CLIP, $CONTAINER, $CONTENT, $CUSTOM, $DESTROY, $DID, $EDIT, $ENABLED, $ENCODE, $FRAMES, $PLAY, $PLAYER, $SAVE, $TIMELINE, $TIMEUPDATE, $VIEW, MOVIE_MASHER, arrayFromOneOrMore, arrayOfNumbers, isAudibleType, isVisibleType, sortByIndex } from '../runtime.js'
import { assertClientAudibleInstance, assertClientTrack, assertClientVisibleInstance } from '../utility/client-guards.js'
import { isAboveZero, isArray, isPositive } from '../utility/guard.js'
import { assertPopulatedString, assertPositive, isChangePropertyEdit, isChangePropertyEditObject } from '../utility/guards.js'
import { pixelFromFrame, pixelToFrame } from '../utility/pixel.js'
import { containSize } from '../utility/rect.js'
import { recordFromItems, svgAppend, svgSet, svgSetDimensions, svgSvgElement } from '../utility/svg.js'
import { timeFromArgs, timeFromSeconds, timeRangeFromTime, timeRangeFromTimes } from '../utility/time.js'
import { ServerMashDescriptionArgs } from '@moviemasher/server-lib/types.js'

type TrackClips = [ClientTrack, ClientClips]
type Interval = ReturnType<typeof setInterval>

export class ClientMashAssetClass extends MashAssetMixin(ClientAssetClass) implements ClientMashAsset {
  constructor(object: MashAssetObject & AssetArgs) {
    super(object)
    const { buffer } = object
    if (isAboveZero(buffer)) this.buffer = buffer
    // if (isArray(encodings)) this.encodings.push(...encodings)
    const args: ClientMashDescriptionArgs = { mash: this, time: timeFromArgs() }
    
    this._mashDescription = MOVIE_MASHER.call($MASH, args, $VIEW)
  }

  edits: Edits = MOVIE_MASHER.call<Edits, ClientMashAsset>($EDIT, this, $EDIT)

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
            insertClip.track!.removeClips([insertClip])
          }  
          if (isPositive(frame)) insertClip.frame = frame
          insertClip.track = insertTrack
        })
        insertTrack.assureFrames(this.quantizeNumber, insertClips)
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
    MOVIE_MASHER.dispatch($DID + $CHANGE + $TIMELINE, tracks.length)
    return track
  }
    
  override get assets(): Assets { 
    const { assetIds } = this
    // console.log(this.constructor.name, 'assets', assetIds)
  
    const assets = assetIds.map(id => this.asset(id)) 
    this._assets = assets
  
    return super.assets
  }

  buffer = 10 // seconds

  private bufferStart() {
    // console.log(this.constructor.name, 'bufferStart')
    if (this._bufferTimer) return

    this._bufferTimer = setInterval(() => {
      if (this._paused) return

      const { timeToBuffer: time } = this
      const options: AssetCacheArgs = { audible: true, assetTime: time, time }
      this.assetCachePromise(options)
      const clips = this.clipsAudibleInTime(time)
      this.composition.bufferClips(clips, this.quantizeNumber)
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
    delete this._mashDescription 
  }

  override clipInstance(object: ClipObject): ClientClip {
    return new ClientClipClass(object)
  }

  override get clips(): ClientClips { return super.clips as ClientClips }

  override clipsInTimeOfType(time: Time, avType?: AVType): ClientClips {
    return super.clipsInTimeOfType(time, avType) as ClientClips
  }

  private _composition?: AudioPreview
  private get composition(): AudioPreview {
    return this._composition ||= MOVIE_MASHER.call($AUDIO, { buffer: this.buffer }, $VIEW)
  }
  
  dispatchChanged(edit: Edit): void {
    // console.log(this.constructor.name, 'dispatchChanged')
    this.clearPreview()
    if (!this.paused && isChangePropertyEdit(edit)) {
      const { property, target } = edit
      if (property.endsWith('gain') && isAudibleInstance(target)) {
        this.composition.adjustGain(target)
      }   
    }
    MOVIE_MASHER.dispatch($DID + $EDIT, edit)
    MOVIE_MASHER.dispatch($DID + $CHANGE + $SERVER + $ENABLED, $SAVE)
    this.draw()
  }

  private dispatchChangedPreviews(time: Time): void {
    this.drawingTime = time
    this.clearPreview()
    MOVIE_MASHER.dispatch($DID + $CHANGE + $VIEW)
  }

  draw(): void { this.dispatchChangedPreviews(this.time) }

  private drawInterval?: Interval

  private drawTime(time: Time): void {
    const timeChange = time !== this.time
    // console.log(this.constructor.name, 'drawTime', time, timeChange)
    this.drawnTime = time
    // const { time } = this
    requestAnimationFrame(() => { this.dispatchChangedPreviews(time) })
    if (timeChange) {
      const { frame } = timeFromSeconds(time.seconds, this.quantizeNumber)
      MOVIE_MASHER.dispatch($TIMEUPDATE, frame)
    }
  }

  private drawingTime?: Time

  drawnTime?: Time

  elementsPromise(outputSize?: number | Size, selectedClip?: Clip): Promise<SvgItems> {
    const { size: mashSize } = this         
    const size = outputSize ? containSize(mashSize, outputSize) : mashSize

    const options: ClientMashDescriptionOptions = { size }
    const preview = this.mashDescription(options, selectedClip)
    // console.log(this.constructor.name, 'elementsPromise', size, preview.constructor.name)
    return preview.elementsPromise 
  }

  private emitIfFramesChange(method: () => void): void {
    const origFrames = this.totalFrames
    method()
    const { totalFrames } = this
    if (origFrames !== totalFrames) this.framesHaveChanged(totalFrames)
  }

  get encoding(): Resource | undefined { 
    return this.resourceOfType($ENCODE, this.type)
  }

  private _frame = 0 // initial frame supplied to constructor

  get frame(): number { return this.time.scale(this.quantizeNumber, 'floor').frame }
  
  framesHaveChanged(frames?: number): void {
    const totalFrames = frames || this.totalFrames
    MOVIE_MASHER.dispatch($DID + $CHANGE + $FRAMES, totalFrames)
    if (this.frame > totalFrames) this.seekToTime(timeFromArgs(totalFrames, this.quantizeNumber))
  }

  private handleDrawInterval(): void {
    // console.log(this.constructor.name, 'handleDrawInterval', this._playing)
    // what time does the audioContext think it is?
    const { composition, endTime } = this
    const { seconds } = composition

    // are we beyond the end of mash?
    if (seconds >= endTime.seconds) {
      // should we loop back to beginning?
      if (this.boolean('loop')) this.seekToTime(this.time.withFrame(0))
      else {
        this.paused = true
        this.seekToTime(endTime)
      }
    } else {
      // are we at or beyond the next frame?
      if (seconds >= this.time.withFrame(this.time.frame).seconds) {
        // go to where the audioContext thinks we are
        this.drawTime(timeFromSeconds(seconds, this.time.fps))
      }
    }
  }


  get loading(): boolean { return !!this.loadingPromises.length}

  private loadingPromises: Promise<void>[] = []
 
  private _mashDescription?: ClientMashDescription
  override mashDescription(options: ClientMashDescriptionOptions, selectedClip?: Clip): ClientMashDescription { 
    return this._mashDescription ||= this.mashDescriptionInitialize(options, selectedClip) 
  }

  private mashDescriptionInitialize(options: ClientMashDescriptionOptions, selectedClip?: Clip): ClientMashDescription {
    const args = this.mashDescriptionArgs(options, selectedClip)
    return MOVIE_MASHER.call($MASH, args, $VIEW)
  }

  private mashDescriptionArgs(options: ClientMashDescriptionOptions = {}, selectedClip?: Clip): ClientMashDescriptionArgs {
    const { drawingTime, time, quantizeNumber: quantize } = this
    const svgTime = drawingTime || time
    const args: ClientMashDescriptionArgs = {
      selectedClip,
      time: svgTime.scale(quantize, 'floor'),
      mash: this,
      ...options,
    }
    return args
  }

  private _paused = true
  get paused(): boolean { return this._paused }
  set paused(value: boolean) {
    const paused = value || !this.totalFrames
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
      })
    }
    MOVIE_MASHER.dispatch($DID + $CHANGE + $CLIENT + $ENABLED, $PLAY)
  }

  private _playing = false
  private get playing(): boolean { return this._playing }
  private set playing(value: boolean) {
    // console.trace(this.constructor.name, 'set playing', value)
    if (this._playing !== value) {
      this._playing = value
      if (value) {
        const { quantizeNumber: quantize, time } = this
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
        this.setDrawInterval()
      } else {
        this.composition.stopPlaying()
        this.clearDrawInterval()
      }
    }
  }

  private get quantizeNumber(): number { return Number(this.value('quantize')) } 

  reload(): Promise<void> | undefined { return this.stopLoadAndDraw() }

  removeClipFromTrack(clip: Clip | Clips): void {
    const clips = isArray(clip) ? clip : [clip]
    this.emitIfFramesChange(() => { 
      clips.forEach(clip => {
        const { track } = clip
        assertClientTrack(track)
        
        track.removeClips([clip]) 
      })
    })
  }

  removeTrack(index?: number): void {
    const trackIndex = isPositive(index) ? index : this.tracks.length - 1
    assertPositive(trackIndex)
    const { tracks } = this
    this.emitIfFramesChange(() => { tracks.splice(trackIndex, 1) })
    MOVIE_MASHER.dispatch($DID + $CHANGE + $TIMELINE, tracks.length)
  }

  private restartAfterStop(time: Time, paused: boolean, seeking?: boolean): void {
    if (time.equalsTime(this.time)) { // otherwise we must have gotten a seek call
      if (seeking) {
        delete this.seekTime
      }
      this.drawTime(time)
      if (!paused) this.playing = true
    }
  }
  
  override get saveNeeded(): boolean { 
    console.log(this.constructor.name, 'saveNeeded', this.edits.canSave)
    return this.edits.canSave 
  }

  override async savePromise(progress?: ServerProgress): Promise<StringDataOrError> { 
    const orError = await this.savingPromise(progress)
    if (!isDefiniteError(orError)) {
      this.edits.save()
      // console.log(this.constructor.name, 'ClientMashAssetClass savePromise calling', orError.data)
      this.saveId(orError.data)
    } else {
      console.error(this.constructor.name, 'savePromise', orError)
    }
    return orError

  }

  private seekTime?: Time

  seekToTime(time: Time): Promise<void> | undefined {
    const { quantizeNumber: quantize } = this
    const quantized = timeFromSeconds(time.seconds, quantize)
    if (!this.seekTime?.equalsTime(quantized)) {
      this.seekTime = time      
      const { frame } = quantized
      MOVIE_MASHER.dispatch($TIMEUPDATE, frame)
    }
    return this.stopLoadAndDraw(true)
  }

  private setDrawInterval(): void {
    // console.log(this.constructor.name, 'setDrawInterval', !!this.drawInterval)
    if (this.drawInterval) return 

    this.clearDrawInterval()
    this.drawInterval = setInterval(() => { this.handleDrawInterval() }, 500 / this.time.fps)
  }

  override setValue(id: string, scalar?: Scalar): ScalarTuple {
    const tuple = super.setValue(id, scalar)
    const [name, value] = tuple
    switch(name) {
      case 'buffer': {
        if (this._composition) this.composition.buffer = Number(value)
        break
      }
      case 'aspectHeight':
      case 'aspectWidth':
      case 'aspectShortest': {
        const { size } = this
        if (sizeNotZero(size)) {
          MOVIE_MASHER.dispatch($DID + $CHANGE + $SIZE, this.size)
        } 
        break
      }
    }
    return tuple
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

  override targetId: TargetId = $MASH

  get time() : Time {
    return this.seekTime || this.drawnTime || timeFromArgs(this._frame, this.quantizeNumber)
  }

  get timeRange(): TimeRange {
    const { endTime, time } = this
    const scaled = endTime.scale(time.fps)
    const range = timeRangeFromTime(time, scaled.frame)
    // console.log(this.constructor.name, 'timeRange', range, time, endTime)
    return range
  }

  get timeToBuffer(): Time {
    const { time, quantizeNumber: quantize, buffer, paused } = this
    if (paused) return timeFromArgs(time.scale(quantize, 'floor').frame, quantize)

    return timeRangeFromTimes(time, timeFromSeconds(buffer + time.seconds, time.fps))
  }

  override trackInstance(args: TrackArgs): ClientTrack {
    return new ClientTrackClass(args)
  }
  
  declare tracks: ClientTracks

  override unload(): void {
    super.unload()
    this.paused = true
    this.clearDrawInterval()
  }

  updateAssetId(oldId: string, newId: string): void {
    // console.log(this.constructor.name, 'updateAssetId', oldId, newId)
    this.clips.forEach(clip => clip.updateAssetId(oldId, newId))
  }
}

class ClientClipClass extends ClipClass implements ClientClip {
  override get container(): ClientVisibleInstance & ContainerInstance { return super.container as ClientVisibleInstance }

  override get content(): ClientInstance & ContainerInstance { return super.content as ClientInstance & ContainerInstance  }

  override changeScalar(propertyId: PropertyId, scalar?: Scalar): ChangeEditObject {
    const object = super.changeScalar(propertyId, scalar)
    if (!isChangePropertyEditObject(object)) return object
    
    const name = propertyId.split(DOT).pop()
    switch (name) {
      case $FRAME: 
      case $FRAMES: {
        object.type = $FRAME
        break
      }
      case 'containerId': 
      case 'contentId': {
        const container = name === 'containerId'
        const relevantTiming = container ? $CONTAINER : $CONTENT
        const relevantSizing = container ? $CONTAINER : $CONTENT
        const timing = this.value('timing')
        const sizing = this.value('sizing')
        const { targetId } = this
        const timingBound = timing === relevantTiming
        const sizingBound = sizing === relevantSizing
        if (!(timingBound || sizingBound)) break

        const { undoValue, redoValue } = object
        assertPopulatedString(redoValue)

        const sizingId: PropertyId = `${targetId}${DOT}sizing`
        const timingId: PropertyId = `${targetId}${DOT}timing`
        const undoValues: ScalarsById = { 
          [timingId]: timing, 
          [sizingId]: sizing,
          [propertyId]: undoValue 
        }
        const redoValues: ScalarsById = { ...undoValues, [propertyId]: redoValue }
        const asset = this.asset(redoValue)
        const { type } = asset
        if (timingBound && !isAudibleType(type)) {
          redoValues[timingId] = $CUSTOM
        }
        if (sizingBound && !isVisibleType(type)) {
          redoValues[sizingId] = container ? $CONTENT : $CONTAINER
        }
        const actionObject: ChangePropertiesEditObject = {
          type: $CHANGES, target: this, redoValues, undoValues
        }
        return actionObject
      }
    }
    return object
  }

  override constrainedValue(property: Property, scalar?: Scalar | undefined): Scalar | undefined {
    const value = super.constrainedValue(property, scalar)
    const { name } = property
    switch (name) {
      case $FRAMES: {
        assertPositive(value)

        const { track, frame } = this
        assertDefined(track)

        const { clips, dense } = track
        if (dense) break
        
        const { length } = clips
        const index = clips.indexOf(this)
        if (index === length - 1) break
        
        const nextClip = clips[index + 1]
        const { frame: nextFrame} = nextClip
        const availableFrames = nextFrame - frame
        if (availableFrames < value) return availableFrames
      }
    }
    return value
  }

  elementPromise(outputSize: Size, time: Time, panel: Panel): Promise<DataOrError<SvgItemsRecord>> {
    // console.log(this.constructor.name, 'elementPromise', outputSize, time, panel)
    const { container, content, timeRange } = this
    const [opacity] = this.tweenValues($OPACITY, time, timeRange)
    const containerRectArgs: ContainerRectArgs = { outputSize, time, timeRange }
    const [containerRect] = this.clipRects(containerRectArgs)
    assertClientVisibleInstance(content)

    const containerArgs: ContainerSvgItemArgs = {
      opacity, containerRect, size: outputSize, time, timeRange, panel: panel
    }
  
    return container.clippedElementPromise(content, containerArgs).then(clippedOrError => { 
      if (isDefiniteError(clippedOrError)) return clippedOrError

      const useSvg = panel === $PLAYER && !container.asset.isVector
      if (!useSvg) return clippedOrError

      const { data: record } = clippedOrError
      // const { items, defs, styles } = record
      const { svgElement: svg } = this
      simplifyRecord(record, outputSize, svg)
      return { data: recordFromItems([svg])}
    })
  }

  override resetTiming(instance?: Instance, quantize?: number): void {
    super.resetTiming(instance, quantize)
    this.track?.mash.framesHaveChanged()
  }

  override setValue(id: string, value?: Scalar): ScalarTuple {
    const tuple = super.setValue(id, value)
    const [name] = tuple
    switch (name) {
      case $FRAMES: {
        // console.log(this.constructor.name, 'setValue', name, value, !!property)
        this.track?.sortClips()
        break
      }
      case 'containerId': {
        // console.log(this.constructor.name, 'setValue', name, value, !!property)
        const { _container } = this
        if (_container) {
          this._containerObject = _container.instanceObject
          delete this._container
          MOVIE_MASHER.dispatch($CAN + $DESTROY, [_container.asset.id])
        } 
        break
      }
      case 'contentId': {
        const { _content } = this
        if (_content) {
          this._contentObject = _content.instanceObject
          delete this._content

          MOVIE_MASHER.dispatch($CAN + $DESTROY, [_content.asset.id])
        } 
        break
      }
    }
    return tuple
  }
  
  override shouldSelectProperty(property: Property, targetId: TargetId): Property | undefined {
    if (targetId !== property.targetId) return

    const { name } = property
    switch (name) {
      case 'sizing': return this.content.asset.type === $AUDIO ? undefined : property
      case 'timing': {
        if (this.content.asset.hasIntrinsicTiming) break
        return isVisibleInstance(this.container) && this.container.asset.hasIntrinsicSizing ? property : undefined
      }
      case $FRAME: return this.track!.dense ? undefined : property
      case $FRAMES: return this.value('timing') === $CUSTOM ? property : undefined
    }
    return super.shouldSelectProperty(property, targetId)
  }

  private _svgElement?: SvgElement
  private get svgElement() {
    // console.debug(this.constructor.name, 'svgElement USED!')
    return this._svgElement ||= svgSvgElement()//svgSvgElement() //
  }

  async svgItemPromise(args: ClipIconArgs): Promise<DataOrError<SvgElement>> {
    const { 
      audible, visible, clipSize, scale,  
      audibleHeight,
      visibleHeight,
      width = 0, 
      gap = 1,
    } = args
    const svgElement = svgSvgElement(clipSize)
    const result = { data: svgElement }
    const { timeRange, track, content } = this
    assertDefined(track)

    const { startTime, fps } = timeRange
    const { frame } = startTime
    if (audible) {
      const audioSize = { height: audibleHeight, width: pixelFromFrame(timeRange.frames, scale) }
      assertClientAudibleInstance(content)

      const audioOrError = await content.audiblePreviewPromise(audioSize, scale)
      if (!isDefiniteError(audioOrError)) {
        const { data: audioElement } = audioOrError
         
        if (visible) svgSet(audioElement, String(visibleHeight), 'y')
        svgAppend(svgElement, audioElement)
      }
    }
    if (visible) {
      const widthAndBuffer = width + gap
      const { mash } = track
      const cellCount = Math.ceil(clipSize.width / widthAndBuffer)
      const cells = arrayOfNumbers(cellCount)
      let pixel = 0
      const cellTimes = cells.map(() => {
        const currentFrame = frame + pixelToFrame(pixel, scale, 'floor')
        pixel += widthAndBuffer
        return timeFromArgs(currentFrame, fps)
      })
      const validTimes = cellTimes.filter(time => timeRange.intersects(time))
      const previews = validTimes.map(time => {
        const mashDescriptionArgs: MashDescriptionArgs = { 
          clip: this, mash, time, size: { width, height: visibleHeight }
        }
        return MOVIE_MASHER.call($MASH, mashDescriptionArgs, $VIEW)
      })
      const svgItems: SvgItems = []
      for (const preview of previews) {
        const items = await preview.svgItemsPromise
        svgItems.push(...items)
      }
      const point = { ...POINT_ZERO }
      svgItems.forEach(svgItem => {
        svgSetDimensions(svgItem, point)
        svgAppend(svgElement, svgItem)
        point.x += widthAndBuffer
      })
    }
    return result
  }

  override targetId: TargetId = $CLIP

  declare track?: ClientTrack

  updateAssetId(oldId: string, newId: string): void {
    const containerId = this.value('containerId')
    const contentId = this.value('contentId')
    
    // console.log(this.constructor.name, 'updateAssetId', { oldId, newId, containerId, contentId })
    if (containerId === oldId) this.setValue('containerId', newId)
    if (contentId === oldId) this.setValue('contentId', newId)
  }
}

class ClientTrackClass extends TrackClass implements ClientTrack {
  addClips(clips: Clips, insertIndex = 0): void {
    let clipIndex = insertIndex || 0
    if (!this.dense) clipIndex = 0 // ordered by clip.frame values

    const origIndex = clipIndex // note original, since it may decrease...
    const movingClips: Clips = [] // build array of clips already in this.clips

    // build array of my clips excluding the clips we're inserting
    const spliceClips = this.clips.filter((other, index) => {
      const moving = clips.includes(other)
      if (moving) movingClips.push(other)
      // insert index should be decreased when clip is moving and comes before
      if (origIndex && moving && index < origIndex) clipIndex -= 1
      return !moving
    })
    // insert the clips we're adding at the correct index, then sort properly
    spliceClips.splice(clipIndex, 0, ...clips)
    this.sortClips(spliceClips)
    arraySet(this.clips, spliceClips)
  }

  // declare clips: ClientClips

  frameForClipNearFrame(clip: Clip, insertFrame = 0): number {
    if (this.dense) {
      return isPositive(insertFrame) ? insertFrame : this.frames
    }
    const { frame, endFrame } = clip
    const durationFrames = endFrame - frame

    const { clips } = this
    const avoidClips = clips.filter(other => 
      clip !== other && other.endFrame > insertFrame
    )
    if (!avoidClips.length) return insertFrame

    let lastFrame = insertFrame
    for (const avoidClip of avoidClips) {
      if (avoidClip.frame >= lastFrame + durationFrames) break
  
      lastFrame = avoidClip.endFrame
    }
    return lastFrame
  }

  declare mash: ClientMashAsset

  removeClips(clips: Clips): void {
    const newClips = this.clips.filter(other => !clips.includes(other))
    assertTrue(newClips.length !== this.clips.length)
    
    clips.forEach(clip => clip.trackNumber = -1)
    this.sortClips(newClips)
    arraySet(this.clips, newClips)
  }
}

export class ClientMashVideoAssetClass extends VideoAssetMixin(
  ClientVisibleAssetMixin(
    ClientAudibleAssetMixin(
      VisibleAssetMixin(AudibleAssetMixin(ClientMashAssetClass))
    )
  )
) implements ClientMashVideoAsset {}

export const videoMashAssetFunction: AssetFunction = (assetObject) => {
  if (!isAssetObject(assetObject, $VIDEO, $MASH)) {
    return namedError(ERROR.Syntax, [$VIDEO, $MASH].join(SLASH))
  }
  const { context } = MOVIE_MASHER
  const assetClass = context === $CLIENT ? ClientMashVideoAssetClass : ServerMashVideoAssetClass
  return { data: new assetClass(assetObject) }
}

export class ClientMashVideoInstanceClass extends VideoInstanceMixin(
  ClientVisibleInstanceMixin(
    ClientAudibleInstanceMixin(
      VisibleInstanceMixin(AudibleInstanceMixin(ClientInstanceClass))
    )
  )
) implements ClientMashVideoInstance {
  declare asset: ClientMashVideoAsset
}

const tweenPosition = (frames: number, offset = 0, frame='n'): EvaluationValue => {
  const frameVariable = Eval($VARIABLE, [frame], 'frame')
  const subtracted = Eval($SUBTRACT, [frameVariable, offset], 'overlayFrame')
  const divided = Eval($DIVIDE, [subtracted, frames], 'framePosition')
  return divided
}

const precodeFilters = (inputId: string, outputId: string, args: VisibleCommandFilterArgs, alpha?: boolean): CommandFilters => {
  const filters: CommandFilters = []
  const { videoRate, outputSize } = args
  const colorId = idGenerate('color')

 // other filters are overlain atop this color (which shouldn't be visible)
  filters.push(colorFilter(colorId, '#00FF00', videoRate, outputSize))

  // console.log('options', options)
  filters.push(overlayFilter(colorId, inputId, outputId, alpha))
  return filters
}

const evaluationValue = (operative: EvaluationValue) => (
  isValue(operative) ? operative : operative.toValue()
)

const audibleCommandFilters = (args: AudibleCommandFilterArgs, instance: ServerAudioInstance): CommandFilters => {
  const filters: CommandFilters = []
  const { commandFiles, time, clipTime } = args
  const speed = instance.number('speed')
  const { id } = instance
  const { asset } = instance
  const commandFile = commandFiles.find(file => file.asset === asset && $AUDIO === file.avType)
  const contentId = commandFile ? commandFile.inputId : id
  let filterInput = [contentId, 'a'].join(COLON)
  if (speed !== 1) {
    const atempoFilter = 'atempo'
    const atempoId = idGenerate(atempoFilter)
    const atempoCommandFilter: CommandFilter = {
      ffmpegFilter: atempoFilter, options: { tempo: speed },
      inputs: [filterInput], outputs: [atempoId]
    }
    filters.push(atempoCommandFilter)
    filterInput = atempoId
  }
  const delays = (clipTime.seconds - time.seconds) * 1000
  if (delays) {
    const adelayFilter = 'adelay'
    const adelayId = idGenerate(adelayFilter)
    const adelayCommandFilter: CommandFilter = {
      ffmpegFilter: adelayFilter,
      options: { delays, all: 1 },
      inputs: [filterInput], outputs: [adelayId]
    }
    filters.push(adelayCommandFilter)
    filterInput = adelayId
  }
  const { chainInput } = args

  const amixFilter: CommandFilter = {
    ffmpegFilter: 'amix',
    inputs: [chainInput, filterInput],
    options: { normalize: 0 }, outputs: []
  }
  filters.push(amixFilter)
  return filters
}

const contentEvaluationPoint = (tweenRect: EvaluationRect, intrinsicSize: Size, containerRect: EvaluationRect, outputSize: Size, sizeAspect: Aspect, pointAspect: Aspect, rounding: Rounding, sizeKey?: SizeKey): EvaluationPoint => {
  const containerSize = copySize(containerRect)
  const containerPoint = copyPoint(containerRect)
  const tweenPoint = orientPoint(tweenRect, outputSize, pointAspect)
  const expressionSize = { width: 'w', height: 'h' }
  const contentSize = evenEvaluationSize(expressionSize, rounding)
  const contentPoint = scaleContentEvaluationPoint(contentSize, containerSize, tweenPoint, rounding)
  const translatedPoint = translateEvaluationPoint(containerPoint, contentPoint)
  return translatedPoint 
}

const alphamergeFilters = (maskInput: string, maskedInput: string, outputId: string, transparency: Transparency, debug?: boolean): CommandFilters => {
  const mergeFilter = debug ? 'overlay' : 'alphamerge'
  const extract = debug ? false : (transparency === $ALPHA)
  const extractFilter = 'alphaextract'
  const extractId = idGenerate(extractFilter)
  const filters: CommandFilters = []
  let inputId: string = maskInput
  if (extract) {
    const alphaCommandFilter: CommandFilter = {
      ffmpegFilter: extractFilter, options: {},
      inputs: [inputId], outputs: [extractId]
    }
    filters.push(alphaCommandFilter)
    inputId = extractId
  }
  const options: ValueRecord = {}
  const outputs = []
  if (outputId) outputs.push(outputId)
  const commandFilter: CommandFilter = {
    ffmpegFilter: mergeFilter, options,
    inputs: [maskedInput, inputId], outputs
  }
  filters.push(commandFilter)
  // console.log('alphamergeCommandFilters', filters)
  return filters
}

const colorFilter = (outputId: string, color: string, rate: number, size?: Size, duration?: number ) => {
  const ffmpegFilter = 'color'
  const id = outputId || idGenerate('color')
 
  const options: ValueRecord = { color, rate }
  if (duration) options.duration = duration
  if (size) options.size = sizeValueString(size)
  const commandFilter: CommandFilter = {
    ffmpegFilter, options, inputs: [], outputs: [id]
  }
  // console.log('colorFilter', color, size, 'as', id)
  return commandFilter
}

const cropFilter = (inputId: string, outputId: string, rect: Rect): CommandFilter => {
  const options: ValueRecord =  { ...copyPoint(rect) }// exact: 1 
  const outputs = []
  if (outputId) outputs.push(outputId)
  const { width, height } = rect
  if (width) options.w = width
  if (height) options.h = height
  const filter: CommandFilter = {
    ffmpegFilter: 'crop', options, inputs: [inputId], outputs
  }
  return filter
}

const fpsFilter = (inputId: string, outputId: string, fps: number): CommandFilter => {
  const id = outputId || idGenerate('setsar')
  const options: ValueRecord = { fps }
  const commandFilter: CommandFilter = {
    ffmpegFilter: 'fps', options, 
    inputs: [inputId], outputs: [outputId]
  }
  return commandFilter
}

const overlayFilter = (bottomInput: string, topInput: string, outputId: string, alpha?:boolean, values?: ValueRecord): CommandFilter =>{
  const doStack = false// !(alpha || values)
  
  const options: ValueRecord = doStack ? {} : { 
    alpha: 'straight', ...(values || {}) //format: alpha ? 'yuv420p10' : 'yuv420', 
  }
  const ffmpegFilter = doStack ? 'vstack' : 'overlay'

  const outputs: Strings = []
  if (outputId) outputs.push(outputId)
  
  
  const filter: CommandFilter = {
    ffmpegFilter, options,
    inputs: [bottomInput, topInput], outputs,
  }
  // console.log('overlayCommandFilter', topInput, 'over', bottomInput, 'as', outputId, values)
  return filter
}

const scaleFilter = (inputId: string, outputId: string, size: EvaluationSize): CommandFilter => {
  const options: ValueRecord = { 
    width: String(size.width),
    height: String(size.height),
    // sws_flags: 'accurate_rnd',
  }
  if (!(isNumeric(options.width) && isNumeric(options.height))) options.eval = $FRAME
  const outputs = []
  if (outputId) outputs.push(outputId)

  const commandFilter: CommandFilter = {
    ffmpegFilter: 'scale', options, inputs: [inputId], outputs
  }
  // console.log('scaleCommandFilter', commandFilter)
  return commandFilter
}

const setPtsSpeedFilters = (inputId: string, outputId: string, instance: AudibleInstance): CommandFilters => {
  const filters: CommandFilters = []
  const speed = instance.value('speed')
  let filterInput = inputId
  const setptsFilter = 'setpts'
  const setptsId = idGenerate(setptsFilter)
  if (speed !== 1) {
    const firstSetptsCommandFilter: CommandFilter = {
      ffmpegFilter: setptsFilter,
      options: { expr: `PTS-STARTPTS` },
      inputs: [filterInput], outputs: [setptsId]
    }
    filters.push(firstSetptsCommandFilter)
    filterInput = setptsId
  }
  const secondSetptsCommandFilter: CommandFilter = {
    ffmpegFilter: setptsFilter,
    options: { expr: `((PTS)/${speed})-STARTPTS` },
    inputs: [filterInput], outputs: [outputId]
  }
  filters.push(secondSetptsCommandFilter)
  return filters
}

const setsarFilter = (inputId: string, outputId: string, size?: Size): CommandFilter => {
  const options: ValueRecord = {sar: 1}
  if (size) options.sar = SIZE_KEYS.map(key => size[key]).join(SLASH)
  const commandFilter: CommandFilter = {
    ffmpegFilter: 'setsar', options,
    inputs: [inputId], outputs: [outputId]
  }
  return commandFilter
}

export class ServerMashAssetClass extends  MashAssetMixin(ServerAssetClass) implements ServerMashAsset {
  assetFiles(_: CacheArgs): AssetFiles {
    return errorThrow(ERROR.Unimplemented)
  }
  
  override get clips(): ServerClips { return super.clips as ServerClips }

  clipsInTimeOfType(time: Time, avType?: AVType): ServerClips {
    return super.clipsInTimeOfType(time, avType) as ServerClips
  }

  clipInstance(object: ClipObject): ServerClip {
    return new ServerClipClass(object)
  } 

  override mashDescription(options: ServerMashDescriptionOptions): ServerMashDescription {
    const args: ServerMashDescriptionArgs = { ...options, mash: this }
    return MOVIE_MASHER.call($MASH, args, $VIEW)
  }

  override trackInstance(args: TrackArgs): ServerTrack {
    return new ServerTrackClass(args)
  }
}

export class ServerTrackClass extends TrackClass implements ServerTrack {
  declare clips: ServerClips
  declare mash: ServerMashAsset
}

export class ServerMashVideoAssetClass extends VideoAssetMixin(
  ServerVisibleAssetMixin(
    ServerAudibleAssetMixin(
        VisibleAssetMixin(AudibleAssetMixin(ServerMashAssetClass))
    )
  )
) implements ServerMashVideoAsset {

}

export class ServerMashVideoInstanceClass extends VideoInstanceMixin(
  ServerVisibleInstanceMixin(
    ServerAudibleInstanceMixin(
      VisibleInstanceMixin(AudibleInstanceMixin(ServerInstanceClass))
    )
  )
) implements ServerMashVideoInstance {
  declare asset: ServerMashVideoAsset
}

export class ServerClipClass extends ClipClass implements ServerClip {
  audioCommandFiles(args: AudioCommandFileArgs): CommandFiles {
    const { content } = this
    assertServerAudibleInstance(content)

    const commandFiles: CommandFiles = []
    const clipTime = this.timeRange
    const contentArgs: AudioCommandFileArgs = { ...args, clipTime }
    commandFiles.push(...content.audibleCommandFiles(contentArgs)) 
    return commandFiles
  }

  audioCommandFilters(args: AudibleCommandFilterArgs): CommandFilters {
    const clipTime = this.timeRange
    const contentArgs: AudibleCommandFilterArgs = { ...args, clipTime }
    const { content } = this
    assertServerAudibleInstance(content)

    return audibleCommandFilters(contentArgs, content)
  }

  override get container(): ServerContainerInstance { 
    return super.container as ServerContainerInstance
  }

  override get content(): ServerContentInstance  { 
    return super.content as ServerContentInstance 
  }

  precoding?: AbsolutePath
  
  get requiresPrecoding(): boolean {
    const { container, content } = this
    if (!isVisibleInstance(content)) return false 

    if (content.asset.canBeFill) return false
    if (container.tweens($SIZE) && container.tweens($POINT)) return true
    if (content.tweens($SIZE) && content.tweens($POINT)) return true
  
    return false
  }

  private svgFilesForTime(encodePath: AbsolutePath, time: TimeRange, outputSize: Size, videoRate: number): DataOrError<CommandFiles>{
    const svgFiles: CommandFiles = []
    const result = { data: svgFiles }
    const transparency = this.value('transparency')
    const { content, container, timeRange, clipIndex } = this
    const svgItemArgs: SvgItemArgs = { timeRange, size: outputSize, time: time }
    const { asset: containerAsset, id: containerId } = container
    assertVisibleInstance(content)

    const { asset: contentAsset } = content
    const { isVector, canBeFill: containerCanBeFill } = containerAsset
    const containerIsVideo = !(isVector || containerCanBeFill)
    const { canBeFill: contentCanBeFill } = contentAsset
    const contentIsVideo = !contentCanBeFill
    if (containerIsVideo && contentIsVideo) {
      return result
    }
    const hasBoth = !(containerIsVideo || contentIsVideo)
    const tweening = contentIsVideo ? container.tweening : this.tweening
    const isRange = time.frames > 1
    const times = isRange && tweening ? time.scale(videoRate).frameTimes : [time.startTime]

    if (!sizeNotZero(outputSize)) return namedError(ERROR.Internal, outputSize)

    const containerRectArgs: ContainerRectArgs = { outputSize, time, timeRange }
    const containerRects = this.clipRects(containerRectArgs)
    const contentRectArgs: ContentRectArgs = {
      containerRects, time, timeRange, outputSize
    }
    const [frameRect] = this.bestFrameRects(contentRectArgs, !contentIsVideo, !containerIsVideo) 
    const offsetPoint = translatePoint(POINT_ZERO, frameRect, true) 
    const { length } = times
    const pad = String(length).length
    const multipleTimes = length > 1
    const color = contentIsVideo ? RGB_WHITE : RGB_BLACK 
    const backColor = (contentIsVideo ? (transparency === $ALPHA ? RGBA_BLACK_ZERO : RGB_BLACK) : RGBA_BLACK_ZERO)
    const [firstTime] = times
    const lastTime = arrayLast(times) 
    
    const inputOptions: ValueRecord = { framerate: videoRate, base_uri: '' }
    if (isRange) inputOptions.t = time.lengthSeconds
    const nameBits: Values = [firstTime.frame, lastTime.frame, frameRect.width, frameRect.height]
    const basePath = pathJoin(encodePath, $SVGS, clipIndex.join(DASH), nameBits.join(DASH))
    const baseFile: CommandFile = { 
      inputId: containerId, inputOptions, avType: $VIDEO,
      type: $SVGS, asset: containerAsset, file: '/',
    }  
    if (multipleTimes) {
      const pattern = [basePath, $FRAME, `%0${String(length + 1).length}d.svg`].join(DASH)
      assertAbsolutePath(pattern)
      baseFile.path = pattern
    }

    for (const [index, time] of times.entries()) {
      const record: SvgItemsRecord = { 
        items: [svgPolygonElement(frameRect, '', backColor)], defs: [], styles: [] 
      }
      const timeContainerRects = index ? this.clipRects({ ...containerRectArgs, time }) : containerRects
      const [containerStartRect] = timeContainerRects
      if (!sizeNotZero(containerStartRect)) return namedError(ERROR.Internal, containerStartRect)
      
      const containerRect = { ...containerStartRect, ...translatePoint(containerStartRect, offsetPoint) }
     
      const [opacity] = this.tweenValues($OPACITY, time, timeRange)
      const args: ContainerSvgItemArgs = { ...svgItemArgs, color, containerRect, time, opacity }
      if (hasBoth) {
        const clippedOrError = container.clippedElement(content, args)
        if (isDefiniteError(clippedOrError)) return clippedOrError

        mergeSvgItemsRecords(record, clippedOrError.data)
      } else if (!containerIsVideo) {
        const containerOrError = container.containerSvgItem(args)
        if (isDefiniteError(containerOrError)) return containerOrError
      
        appendSvgItemsRecord(record, containerOrError.data)
      } else {
        const contentRect = content.contentRect(time, containerRect, outputSize)
        const contentSvgItemArgs: ContentSvgItemArgs = { 
          ...svgItemArgs, contentRect, time, opacity
        }
        const contentOrError = content.contentSvgItem(contentSvgItemArgs)
        if (isDefiniteError(contentOrError)) return contentOrError

        appendSvgItemsRecord(record, contentOrError.data)
      }
      const svg = simplifyRecord(record, frameRect)
      const { outerHTML: text } = svg
      const nameBits: Values = []
      if (multipleTimes) {
        nameBits.push('', $FRAME, String(1 + time.frame - firstTime.frame).padStart(pad, '0'))
      }
      const file = [basePath, [nameBits.join(DASH), $SVG].join(DOT)].join('')
      assertAbsolutePath(file)
      const svgFile: CommandFile = { ...baseFile, content: text, file }  
      svgFiles.push(svgFile)
    }
    return result
  }
  
  videoCommandFiles(args: VideoCommandFileOptions): CommandFiles {
    const files: CommandFiles = []
    const { content, container, timeRange, precoding, timeRange: clipTime } = this
    assertVisibleInstance(content)

    const { outputSize, time: timeOrRange, videoRate, encodePath } = args
    assertSizeNotZero(outputSize, 'outputSize')
    const time = clipTime.intersection(timeOrRange)
    assertDefined(time, 'intersection')
   
    const containerRectArgs: ContainerRectArgs = {
      outputSize, time, timeRange
    }
    const containerRects = this.clipRects(containerRectArgs)
    const fileArgs: VisibleCommandFileArgs = { 
      ...args, clipTime: timeRange, outputSize, containerRects
    }
    if (precoding) {
      const { seconds: startSeconds } = content.assetTime(time)
      const inputOptions: ValueRecord = { }
      if (startSeconds) inputOptions.ss = startSeconds
   
      const file: CommandFile = {
        type: $VIDEO, asset: content.asset, file: precoding, 
        inputId: content.id, avType: $VIDEO, inputOptions
      }
      // console.log(this.constructor.name, 'videoCommandFiles ADDING', file)
      files.push(file)
    }
    const contentOrNot = precoding ? undefined : content
    const containerFiles = container.visibleCommandFiles(fileArgs, contentOrNot)
    files.push(...containerFiles)
    const svgFilesOrError = this.svgFilesForTime(encodePath, time, outputSize, videoRate)
    if (!isDefiniteError(svgFilesOrError)) files.push(...svgFilesOrError.data)
    return files
  }

  videoCommandFilters(args: VideoCommandFilterArgs): CommandFilters {
    const filters: CommandFilters = []
    const { content, container } = this
    assertVisibleInstance(content)

    const { asset: containerAsset, id: containerId } = container
    const { isVector, canBeFill: containerCanBeFill, alpha } = containerAsset
    const hasContainerSvg = isVector || containerCanBeFill

    const { canBeFill: hasContentSvg } = content.asset
    const hasBoth = hasContainerSvg && hasContentSvg

    let containerInput = [containerId, 'v'].join(COLON)
    const { chainInput } = args
  
    if (!hasBoth) {
      filters.push(...this.videoComplexFilters(containerInput, args))
      containerInput = arrayLast(arrayLast(filters).outputs)
    }
    filters.push(overlayFilter(chainInput, containerInput, '', alpha))
    return filters
  }

  private bestFrameRects(args: ContentRectArgs, hasContentSvg?: boolean, hasContainerSvg?: boolean): [Rect, RectTuple, Rect | undefined] {
    const { content, precoding } = this
    assertVisibleInstance(content)
    const { outputSize, containerRects } = args
    const outputRect = { ...POINT_ZERO, ...outputSize }
    const contentRects: RectTuple = hasContentSvg ? RECTS_ZERO : content.contentRects(args)
    const rects = hasContentSvg ? containerRects : contentRects
    const useOutput = precoding || (hasContentSvg && hasContainerSvg)
    const rect = useOutput ? outputRect : unionRects(...rects, outputRect)
    const invalidRect: Rect | undefined = undefined

    const invalid = !sizeValid(rect)
    if (invalid) copyRect(rect, invalidRect)
    if (invalid && !useOutput) { 
      // try to fallback to container rects 
      console.log(this.constructor.name, 'bestFrameRects', 'invalid', { hasContentSvg, rect })
      assertTrue(!hasContentSvg, sizeString(rect))
      
      arraySet(rects, containerRects)
      copyRect(unionRects(...rects), rect)
      assertTrue(sizeValid(rect), sizeString(rect))
    }
    return [rect, contentRects, invalidRect]
  }

  private videoComplexFilters(inputId: string, args: VideoCommandFilterArgs): CommandFilters {
    let containerInput = inputId 
    const filters: CommandFilters = []
    const { content, container } = this
    assertVisibleInstance(content)

    const { asset: containerAsset, id: containerId } = container
    const { isVector, canBeFill: containerCanBeFill } = containerAsset
    const containerIsVideo = !(isVector || containerCanBeFill)

    const { id: contentId, asset: contentAsset } = content
    const contentIsVideo = !contentAsset.canBeFill

    let contentInput = [contentIsVideo ? contentId : containerId, 'v'].join(COLON) 

    const { outputSize, time: outputTime, clipTime } = args
    assertSizeNotZero(outputSize, 'outputSize')

    const time = clipTime.intersection(outputTime)
    assertTimeRange(time)
    assertCanBeContainerInstance(container)

    const containerRectArgs: ContainerRectArgs = { 
      outputSize, time, timeRange: clipTime 
    }
    const containerRects = this.clipRects(containerRectArgs)    
    const tweening: Tweening = { point: false, size: false }
    if (containerRects.length > 1) {
      tweening.point = !pointsEqual(containerRects[0], containerRects[1])
      tweening.size = !sizesEqual(containerRects[0], containerRects[1])
    }
    const transparency = this.string('transparency')
    assertTransparency(transparency)

    const { precoding } = this
    const visibleArgs: VisibleCommandFilterArgs = { ...args, containerRects }
    const outputRect = { ...POINT_ZERO, ...outputSize }
    const alphaId = idGenerate('alpha')
    const contentArgs: ContentRectArgs = {
      containerRects, time, timeRange: clipTime, outputSize
    }
    const [frameRect, contentRects, idealRect] = this.bestFrameRects(contentArgs, !contentIsVideo, !containerIsVideo)
    const offsetPoint = translatePoint(POINT_ZERO, frameRect, true) 
    const cropRect = { ...outputSize, ...offsetPoint}
    if (precoding) {  
      const precodingId = idGenerate('precoding')
      filters.push(...precodeFilters(contentInput, precodingId, visibleArgs, contentAsset.alpha )) 
      contentInput = precodingId
    } else {

      if (contentIsVideo) {
        if (idealRect) {
          // content is scaled to large for an $SVG file
          // const idealRect = unionRects(...contentRects, outputRect)
          console.log(this.constructor.name, 'videoComplexFilters', 'frameRectIncomplete', { frameRect, contentRects, idealRect })
          const difRect = {
            x: frameRect.x - idealRect.x,
            y: frameRect.y - idealRect.y,
          }
          const containerColorId = idGenerate('container-color')
          filters.push(colorFilter(containerColorId, '#000000', 1, idealRect))

          const containerOverlayId = idGenerate('container-overlay')
          filters.push(overlayFilter(containerColorId, containerInput, containerOverlayId, true, difRect))
          containerInput = containerOverlayId

          copyRect(idealRect, frameRect)
          copyPoint(idealRect, cropRect)
        }
        if (contentRects.length > 1) {
          const [first, last] = contentRects
          tweening.point ||= !pointsEqual(first, last)
          tweening.size ||= !sizesEqual(first, last)
        }
        filters.push(...this.videoInstanceFilters(false, content, frameRect, contentRects, visibleArgs, tweening))   
        contentInput = arrayLast(arrayLast(filters).outputs)
      }
      if (containerIsVideo) {
        filters.push(...this.videoInstanceFilters(true, container, frameRect, containerRects, visibleArgs, tweening))   
        containerInput = arrayLast(arrayLast(filters).outputs)
      }     
    }

    filters.push(...alphamergeFilters(containerInput, contentInput, alphaId, transparency))  
    containerInput = alphaId
    const needsCrop = !rectsEqual(cropRect, outputRect)
    if (needsCrop) {
      const cropId = idGenerate('crop')
      filters.push(cropFilter(containerInput, cropId, cropRect))
      containerInput = cropId
    } 
    if (containerIsVideo && contentIsVideo) {
      filters.push(...this.opacityCommandFilters(containerInput, args))
    } 
    return filters
  }

  private videoInstanceFilters(container: boolean, instance: VisibleInstance, frameRect: Rect, rects: RectTuple, args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
    const filters: CommandFilters = []
    const { size, point } = tweening
    const needsDynamic = size && point
    const { videoRate, duration, commandFiles, time } = args
    const { asset, id } = instance
    const { alpha } = asset
    const commandFile = commandFiles.find(file => (
      file.inputId.startsWith(id) && file.asset === asset && file.type === $VIDEO
    ))
    assertDefined<CommandFile>(commandFile, 'commandFile')

    const { inputId: fileId } = commandFile
    const inputId = [fileId, 'v'].join(COLON)
    let filterInput = inputId
    const { asset: _, ...file } = commandFile
    // console.log(this.constructor.name, 'videoInstanceFilters', { file, asset: asset.label, time })
    const colorId = idGenerate('color')
    const scaleId = idGenerate('scale')
    const outputId = idGenerate('overlay')
    const options: ValueRecord = { ...POINT_ZERO }
    const sizePosition = tweenPosition(videoRate * duration) 
    const pointPosition = tweenPosition(videoRate * duration, 1) // overlay bug
    filters.push(colorFilter(colorId, '#000000', videoRate, frameRect))

    if (isAudibleInstance(instance)) {
      const setptsId = idGenerate('setpts')
      filters.push(...setPtsSpeedFilters(filterInput, setptsId, instance))
      filterInput = setptsId
    } 
    // should this be first?
    const fpsId = idGenerate('fps')
    filters.push(fpsFilter(filterInput, fpsId, videoRate))
    filterInput = fpsId

    const evaluationPoint: EvaluationPoint = { ...POINT_ZERO }
    if (needsDynamic) {
      const contentSize =  this.evaluationSize(container, sizePosition, args, $CEIL) 
      filters.push(...this.dynamicScaleFilters(filterInput, scaleId, contentSize))
      filterInput = scaleId
      const contentPoint =  this.evaluationPoint(container, pointPosition, args, $CEIL) 
      copyPoint(contentPoint, evaluationPoint)
    } else {
      filters.push(...this.linearScaleFilters(filterInput, scaleId, sizePosition, rects))
      filterInput = scaleId
      const contentPoint = tweenEvaluationPoint(rects, pointPosition)
      copyPoint(contentPoint, evaluationPoint)
    }
    // translate the point
    const translated = translateEvaluationPoint(evaluationPoint, frameRect, true)

    // now evaluate it as much as possible
    POINT_KEYS.forEach(key => { options[key] = evaluationValue(translated[key]) })
    filters.push(overlayFilter(colorId, filterInput, outputId, alpha, options))
    return filters
  }

  private evaluationSize(container: boolean, sizePosition: EvaluationValue, args: VisibleCommandFilterArgs, rounding: Rounding = $CEIL) {
    if (container) return this.containerEvaluationSize(sizePosition, args, rounding) 
    return this.contentEvaluationSize(sizePosition, args, rounding)
  }

  private evaluationPoint(container: boolean, pointPosition: EvaluationValue, args: VisibleCommandFilterArgs, rounding: Rounding = $CEIL) {
    if (container) return this.containerEvaluationPoint(pointPosition, args, rounding) 
    return this.contentEvaluationPoint(pointPosition, args, rounding)
  }


  private containerEvaluationPoint(position: EvaluationValue, args: VisibleCommandFilterArgs, rounding: Rounding): EvaluationPoint {
    const containerSize = this.containerEvaluationSize(position, args, rounding)
    const { outputSize, time, clipTime } = args
    const { container } = this
    const containerTweenRects = container.scaleRects(time, clipTime)
    const containerTweenPoints = containerTweenRects.map((tweenRect, index) => {
      const startOrEnd = index ? $END : 'Start'
      const point: EvaluationPoint = { ...POINT_ZERO }
      POINT_KEYS.forEach(key => {
        const variable = `${key}Container${startOrEnd}`
        const evaluation = Eval($NUMBER, [tweenRect[key]], variable)
        point[key] = evaluation
      })
      return point
    })

    const pointAspect = container.string([$POINT, $ASPECT].join('')) 
    assertAspect(pointAspect)


    const { cropDirections } = container
    const containerTweenPoint = tweenEvaluationPoint(containerTweenPoints, position)
    const containerPoint = containerEvaluationPoint(containerTweenPoint, containerSize, outputSize, pointAspect, cropDirections, rounding)
    return containerPoint
  }

  private containerEvaluationSize(position: EvaluationValue, args: VisibleCommandFilterArgs, rounding: Rounding): EvaluationSize {
    // sizes in container rects are correct, so we can just tween between them
    const { containerRects } = args
    const containerSize = tweenEvaluationSize(containerRects, position)
    const evenedSize = evenEvaluationSize(containerSize, rounding)
    return evenedSize
  }

  private contentEvaluationPoint(position: EvaluationValue, args: VisibleCommandFilterArgs, rounding: Rounding): EvaluationPoint {
    const { content } = this
    assertVisibleInstance(content)

    const { time, clipTime, outputSize} = args

    // can't interpolate between points in container rects since they are based on sizes
    const containerPoint = this.containerEvaluationPoint(position, args, rounding)
    // outputEvaluation(containerPoint, 'container')

    const containerSize = this.containerEvaluationSize(position, args, rounding)

    const containerRect: EvaluationRect = {  ...containerPoint, ...containerSize }
    const contentScalingRects = content.scaleRects(time, clipTime)
    const contentTweenRects = contentScalingRects.map((contentTweenRect, index) => {
      const startOrEnd = index ? $END : 'Start'
      const rect: EvaluationRect = { ...RECT_ZERO }
      RECT_KEYS.forEach(key => {
        const variable = `${key}Content${startOrEnd}`
        const evaluation = Eval($NUMBER, [contentTweenRect[key]], variable)
        rect[key] = evaluation
      })
      return rect
    })
    const tweenRect = {
      ...tweenEvaluationSize(contentTweenRects, position),
      ...tweenEvaluationPoint(contentTweenRects, position)
    }
    const pointAspect = content.string([$POINT, $ASPECT].join('')) 
    assertAspect(pointAspect)
    const sizeAspect = content.string([$SIZE, $ASPECT].join(''))
    assertAspect(sizeAspect)

    const { intrinsicRect, sizeKey } = content
    const point = contentEvaluationPoint(tweenRect, intrinsicRect, containerRect, outputSize, sizeAspect, pointAspect, rounding, sizeKey)
    return point
  }

  private contentEvaluationSize = (position: EvaluationValue, args: VisibleCommandFilterArgs, rounding: Rounding): EvaluationSize => {
    const { time, clipTime, outputSize } = args
    const { content } = this
    assertVisibleInstance(content)

    const sizeAspect = content.string([$SIZE, $ASPECT].join(''))
    assertAspect(sizeAspect)

    const { sizeKey, intrinsicRect } = content
    const contentTweenRects = content.scaleRects(time, clipTime)
    const contentTweenSize = tweenEvaluationSize(contentTweenRects, position)
    const containerSize = this.containerEvaluationSize(position, args, rounding)
    // outputEvaluation(containerSize, 'container')
    const contentSize = contentEvaluationSize(contentTweenSize, intrinsicRect, containerSize, outputSize, sizeAspect, rounding, sizeKey)
    return contentSize
  }

  private linearScaleFilters(inputId: string, outputId: string, sizePosition: EvaluationValue, sizes: SizeTuple): CommandFilters {
    const filters: CommandFilters = []
    const [sizeStart, sizeEnd] = sizes
    const { width: widthStart, height: heightStart } = sizeStart
    const { width: widthEnd, height: heightEnd } = sizeEnd
    
    const scaledSize = {
      width: tweenEvaluation($WIDTH, widthStart, widthEnd, sizePosition),
      height: tweenEvaluation($HEIGHT, heightStart, heightEnd, sizePosition),
      // sws_flags: 'accurate_rnd',
    }
    const options = {
      width: String(scaledSize.width),
      height: String(scaledSize.height),
    }
    // reset sample aspect ratio 
    const scaleId = idGenerate('setsar') 
    filters.push(scaleFilter(inputId, scaleId, options))
    filters.push(setsarFilter(scaleId, outputId))
    return filters
  }

  private dynamicScaleFilters = (inputId: string, outputId: string, contentSize: EvaluationSize): CommandFilters => {
    const options: ValueRecord = {
      eval: $FRAME,
      w: evaluationValue(contentSize.width), 
      h: evaluationValue(contentSize.height)
    }
    let filterInput = inputId
    const filters: CommandFilters = []
    const scaleFfmpegFilter = 'scale'
    const scaleId = idGenerate(scaleFfmpegFilter) 
    const scaleFilter: CommandFilter = {
      ffmpegFilter: scaleFfmpegFilter, options, 
      inputs: [filterInput], outputs: [scaleId]
    }
    filters.push(scaleFilter)
    filterInput = scaleId

    // reset sample aspect ratio 
    const setsarId = outputId 
    filters.push(setsarFilter(filterInput, setsarId, ))

    return filters
  }

  private opacityCommandFilters(filterInput: string, args: VideoCommandFilterArgs): CommandFilters {
    const { clipTime, time, videoRate, duration } = args
    assertTimeRange(clipTime)

    const [opacity, opacityEnd] = this.tweenValues('opacity', time, clipTime)
    if (!isNumber(opacity)) return []

    if (!(isBelowOne(opacity) || (isDefined(opacityEnd) && isBelowOne(opacityEnd)))) {
      return []
    }

    const options: ValueRecord = {
      lum: 'lum(X,Y)', cb: 'cb(X,Y)', cr: 'cr(X,Y)', a: `alpha(X,Y)*${opacity}`
    }
    if (duration) {
      if (isNumber(opacityEnd) && opacity != opacityEnd) {
        const position = tweenPosition(videoRate * duration, 0, 'N')
        const toValue = opacityEnd - opacity
        options.a = `alpha(X,Y)*(${opacity}+(${toValue}*${position}))`
      }
    }
    const commandFilter: CommandFilter = {
      ffmpegFilter: 'geq',
      inputs: [filterInput],
      options, outputs: [idGenerate('opacity')]
    }
    return [commandFilter]
  }
}
