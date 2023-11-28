import type { AddClipsEditObject, AddTrackEditObject, AudioPreview, AudioPreviewArgs, ChangeEdit, ChangeEditObject, ChangePropertiesEdit, ChangePropertiesEditObject, ChangePropertyEdit, ChangePropertyEditObject, ClientAudibleInstance, ClientClip, ClientClips, ClientInstance, ClientMashAsset, ClientMashAssetObject, ClientTrack, ClientTracks, ClientVisibleInstance, Edit, EditArgs, EditObject, Edits, EventFunction, MashPreview, MashPreviewArgs, MashPreviewOptions, MoveClipEditObject, Panel, PreviewElement, PreviewElements, RemoveClipEditObject, ServerProgress, StartOptions, SvgItem, SvgItems, SvgOrImageDataOrError, TrackPreview, TrackPreviewArgs, TrackPreviews } from '@moviemasher/runtime-client'
import type { AVType, Asset, AssetCacheArgs, AssetObject, CacheOptions, Clip, ClipObject, ContainerRectArgs, Direction, Encodings, EventDispatcherListeners, InstanceCacheArgs, IntrinsicOptions, Point, Propertied, Property, PropertyId, PropertyIds, Rect, Scalar, ScalarsById, Size, StringDataOrError, TargetId, TextAsset, TextInstance, Time, TimeRange, Track, TrackArgs, TrackObject, UnknownRecord } from '@moviemasher/runtime-shared'

import { MashAssetMixin } from '@moviemasher/lib-shared/asset/mash.js'
import { ClipClass } from '@moviemasher/lib-shared/base/clip.js'
import { TrackClass } from '@moviemasher/lib-shared/base/track.js'
import { colorFromRgb, colorRgbDifference, colorToRgb } from '@moviemasher/lib-shared/utility/color.js'
import { assertContainerInstance, assertDefined, assertPopulatedString, assertPositive, assertRect, assertTrue, isAboveZero, isImageAsset, isInstance, isPositive, isPropertyId } from '@moviemasher/lib-shared/utility/guards.js'
import { assertSizeAboveZero, pointTranslate, pointsEqual, sizeAboveZero, sizeTranslate } from '@moviemasher/lib-shared/utility/rect.js'
import { assertTime, isTimeRange, timeFromArgs, timeFromSeconds, timeRangeFromTime, timeRangeFromTimes } from '@moviemasher/lib-shared/utility/time.js'
import { ADD, ADD_TRACK, ANIMATE, BACK, BOUNDS, CHANGE_FRAME, EventChangeAssetId, EventChangeClipId, EventChangeDragging, EventChangeFrame, EventChangeScalars, EventChanged, EventChangedClientAction, EventChangedFrame, EventChangedFrames, EventChangedPreviews, EventChangedScalars, EventChangedServerAction, EventChangedSize, EventChangedTracks, EventDragging, EventFrames, EventManagedAsset, EventMashTime, EventRect, EventSize, FORE, HANDLE, LAYER, LINE, MOVE_CLIP, MOVIEMASHER, OUTLINE, OUTLINES, PLAYER, REDO, REMOVE_CLIP, SAVE, TIMELINE, UNDO, eventStop } from '@moviemasher/runtime-client'
import { ASPECT, AUDIO, BOTTOM, CHANGE, CHANGE_MULTIPLE, CLIP_TARGET, CONTAINER, CONTENT, CROP, CUSTOM, DASH, DOT, END, ERROR, FRAME, LEFT, MASH, POINT_ZERO, RIGHT, TOP, VIDEO, VOID_FUNCTION, arrayFromOneOrMore, arrayOfNumbers, arraySet, assertAsset, errorThrow, idGenerate, isArray, isAsset, isAudibleAssetType, isDefined, isDefiniteError, isObject, isVisibleAssetType, sortByIndex, sortByTrack } from '@moviemasher/runtime-shared'
import { assertClientInstance, assertClientVisibleInstance, isClientInstance } from '../../guards/ClientGuards.js'
import { isClientClip } from '../../guards/ClientMashGuards.js'
import { isChangeEdit, isChangeEditObject, isChangePropertyEdit, isChangePropertyEditObject } from '../../guards/EditGuards.js'
import { pixelToFrame } from '../../utility/pixel.js'
import { svgAddClass, svgAppend, svgDefsElement, svgPatternElement, svgPolygonElement, svgSetDimensions, svgSvgElement, svgUrl } from '../../utility/svg.js'
import { AUDIBLE_CONTEXT } from '../Audible/ClientAudibleAssetMixin.js'
import { isClientAudibleInstance } from '../Audible/ClientAudibleInstanceGuards.js'
import { ClientAssetClass } from '../ClientAssetClass.js'

type TrackClips = [ClientTrack, ClientClips]
type Interval = ReturnType<typeof setInterval>

const isChangePropertiesEdit = (value: any): value is ChangePropertiesEdit => (
  isChangeEdit(value) 
  && 'redoValues' in value && isObject(value.redoValues)
  && 'undoValues' in value && isObject(value.undoValues)
)

const isChangePropertiesEditObject = (value: any): value is ChangePropertiesEditObject => (
  isChangeEditObject(value) 
  && 'redoValues' in value && isObject(value.redoValues)
  && 'undoValues' in value && isObject(value.undoValues)
)

const isTextAsset = (value: any): value is TextAsset => {
  return isImageAsset(value) && 'family' in value
}

const isTextInstance = (value: any): value is TextInstance => {
  return isInstance(value) && 'asset' in value && isTextAsset(value.asset) 
}

class EditsClass implements Edits {
  constructor(public mashAsset: ClientMashAsset) { }

  private add(action: Edit): void {
    const remove = this.instances.length - (this.index + 1)
    if (isPositive(remove)) this.instances.splice(this.index + 1, remove)

    this.instances.push(action)
  }

  get canRedo(): boolean { return this.index < this.instances.length - 1 }

  get canSave(): boolean { return this.canUndo }

  get canUndo(): boolean { return this.index > -1 }

  create(object: EditObject): void {
    const { type = CHANGE, ...rest } = object
    const clone: EditArgs = { ...rest, type }
    if (this.currentEditIsLast) {
      const { currentEdit: action } = this
      if (isChangeEditObject(object) && isChangeEdit(action)) {
        const { target } = object
        if (action.target === target) {
          if (
            isChangePropertyEditObject(object)
            && isChangePropertyEdit(action) 
            && action.property === object.property
          ) {
            action.updateEdit(object)
            this.dispatchChanged(action)
            return
          }
          else if (
            isChangePropertiesEditObject(object)
            && isChangePropertiesEdit(action)
          ) {
            const { redoValues } = object
            const { undoValues } = action
            const objectKeys = Object.keys(redoValues)
            const actionKeys = Object.keys(undoValues)
            if (objectKeys.some(key => actionKeys.includes(key))) {
              action.updateEdit(object)
              this.dispatchChanged(action)
              return
            }
          }
        }
      }
    }
    const action = editInstance(clone)
    this.add(action)
    this.redo()
  }

  private get currentEdit(): Edit | undefined { return this.instances[this.index] }

  private get currentEditIsLast(): boolean { return this.canUndo && !this.canRedo }

  private dispatchChangedEdit(): void {
    MOVIEMASHER.eventDispatcher.dispatch(new EventChangedClientAction(UNDO))
    MOVIEMASHER.eventDispatcher.dispatch(new EventChangedClientAction(REDO))
  }

  private dispatchChanged(edit: Edit): void {
    const { mashAsset } = this
    edit.updateSelection()
    this.dispatchChangedEdit()
    mashAsset.dispatchChanged(edit)
  }

  private index = -1

  private instances: Edit[] = []

  redo(): void {
    this.index += 1
    const action = this.currentEdit
    assertDefined(action)

    action.redo()
    this.dispatchChanged(action)
  }

  save(): void {
    this.instances.splice(0, this.index + 1)
    this.index = -1
    this.dispatchChangedEdit()
  }

  undo(): void {
    const action = this.currentEdit
    assertDefined(action)
    
    this.index -= 1
    action.undo()
    this.dispatchChanged(action)
  }
}

class EditClass implements Edit {
  constructor(object: EditArgs) {
    this.type = object.type
  }

  get affects(): PropertyIds { return [] }

  done = false;

  redo(): void {
    this.redoEdit()
    this.done = true
  }

  protected redoEdit(): void {
    return errorThrow(ERROR.Unimplemented)
  }

  type: string

  undo(): void {
    this.undoEdit()
    this.done = false
  }

  protected undoEdit(): void {
    return errorThrow(ERROR.Unimplemented)
  }

  updateSelection(): void { }
}

class AddTrackEditClass extends EditClass {
  constructor(object: AddTrackEditObject) {
    super(object)
    const { createTracks, mashAsset } = object
    this.createTracks = createTracks
    this.mashAsset = mashAsset
  }

  createTracks: number

  mashAsset: ClientMashAsset

  override redoEdit(): void {
    arrayOfNumbers(this.createTracks).forEach(() => this.mashAsset.addTrack())
  }

  override undoEdit(): void {
    arrayOfNumbers(this.createTracks).forEach(() => this.mashAsset.removeTrack())
  }
}

class AddClipsEditClass extends AddTrackEditClass {
  constructor(object: AddClipsEditObject) {
    super(object)
    const { clips, insertIndex, trackIndex, redoFrame } = object
    this.clips = clips
    this.insertIndex = insertIndex
    this.trackIndex = trackIndex
    this.redoFrame = redoFrame
  }

  clips: ClientClips

  insertIndex?: number

  override redoEdit(): void {
    super.redoEdit()
    const { mashAsset, redoFrame, trackIndex, insertIndex, clips } = this
    mashAsset.addClipToTrack(clips, trackIndex, insertIndex, redoFrame)
  }

  redoFrame?: number

  get track(): ClientTrack { return this.mashAsset.tracks[this.trackIndex] }

  trackIndex: number

  override undoEdit(): void {
    const { mashAsset, clips } = this
    mashAsset.removeClipFromTrack(clips)
    super.undoEdit()
  }

  override updateSelection(): void {
    const { done } = this
    const id = done ? this.clips[0].id : undefined
    // console.debug(this.constructor.name, 'updateSelection', id)
    MOVIEMASHER.eventDispatcher.dispatch(new EventChangeClipId(id))
  }
}

class ChangeEditClass extends EditClass implements ChangeEdit {
  constructor(object: ChangeEditObject) {
    const { target } = object
    super(object)
    this.target = target
  }

  target: Propertied

  updateEdit(_object: ChangeEditObject): void {
    return errorThrow(ERROR.Unimplemented)
  }

  override updateSelection(): void {
    const { target } = this
    if (isClientClip(target)) {
      MOVIEMASHER.eventDispatcher.dispatch(new EventChangeClipId(target.id))
    } else if (isClientInstance(target)) {
      MOVIEMASHER.eventDispatcher.dispatch(new EventChangeClipId(target.clip.id))
    } else if (isAsset(target)) {
      MOVIEMASHER.eventDispatcher.dispatch(new EventChangeAssetId(target.id))
    }
    MOVIEMASHER.eventDispatcher.dispatch(new EventChangedScalars(this.affects))
  }
}

class ChangePropertyEditClass extends ChangeEditClass implements ChangePropertyEdit {
  constructor(object: ChangePropertyEditObject) {
    const { property, redoValue, undoValue } = object

    super(object)
    this.redoValue = redoValue
    this.undoValue = undoValue
    this.property = property
  }

  override get affects(): PropertyIds {
    return [this.property]
  }

  property: PropertyId

  override redoEdit(): void {
    const { target, redoValue, property } = this
    target.setValue(property, redoValue)
  }

  redoValue?: Scalar

  protected get redoValueNumber(): number { return Number(this.redoValue) }

  override undoEdit(): void {
    const { target, undoValue, property } = this
    target.setValue(property, undoValue)
  }

  undoValue?: Scalar

  protected get undoValueNumber(): number { return Number(this.undoValue) }

  override updateEdit(object: ChangePropertyEditObject): void {
    const { redoValue } = object
    this.redoValue = redoValue
    this.redo()
  }

  get value(): Scalar | undefined { return this.done ? this.redoValue : this.undoValue }

  get valueNumber(): number | undefined {
    const { value } = this
    return isDefined(value) ? Number(value) : undefined
  }
}

class ChangePropertiesEditClass extends ChangeEditClass implements ChangePropertiesEdit {
  constructor(object: ChangePropertiesEditObject) {
    const { redoValues, undoValues } = object
    super(object)
    this.undoValues = undoValues
    this.redoValues = redoValues
  }

  override get affects(): PropertyIds {
    const names = Object.keys(this.done ? this.redoValues : this.undoValues)
    return names.filter(isPropertyId)
  }

  override redoEdit(): void {
    const { target, redoValues } = this
    Object.entries(redoValues).forEach(([property, value]) => {
      target.setValue(property, value)
    })
  }

  redoValues: ScalarsById

  override undoEdit(): void {
    const { target, undoValues } = this
    Object.entries(undoValues).forEach(([property, value]) => {
      target.setValue(property, value)
    })
  }

  undoValues: ScalarsById

  override updateEdit(object: ChangePropertiesEditObject): void {
    const { redoValues } = object
    this.redoValues = redoValues
    this.redo()
  }
}

class ChangeFramesEditClass extends ChangePropertyEditClass {
  constructor(object: ChangePropertyEditObject) {
    super(object)
  }

  private get clip(): ClientClip {
    const { target } = this
    if (isClientClip(target)) return target

    assertClientInstance(target)
    return target.clip
  }

  private get mash(): ClientMashAsset { return this.clip.track.mash }

  override redoEdit(): void {
    this.mash.changeTiming(this.target, this.property, this.redoValueNumber)
  }

  override undoEdit(): void {
    this.mash.changeTiming(this.target, this.property, this.undoValueNumber)
  }
}

class MoveClipEditClass extends AddTrackEditClass {
  constructor(object: MoveClipEditObject) {
    super(object)
    const {
      clip, insertIndex, redoFrame, trackIndex, undoFrame, undoInsertIndex, undoTrackIndex
    } = object
    this.clip = clip
    this.insertIndex = insertIndex
    this.redoFrame = redoFrame
    this.trackIndex = trackIndex
    this.undoFrame = undoFrame
    this.undoInsertIndex = undoInsertIndex
    this.undoTrackIndex = undoTrackIndex
  }

  override get affects(): PropertyIds { return [`${CLIP_TARGET}${DOT}frame`] }

  clip: ClientClip

  insertIndex?: number

  trackIndex: number

  undoTrackIndex: number

  undoInsertIndex?: number

  undoFrame?: number

  redoFrame?: number

  addClip(trackIndex: number, insertIndex?: number, frame?: number): void {
    this.mashAsset.addClipToTrack(this.clip, trackIndex, insertIndex, frame)
  }

  override redoEdit(): void {
    super.redoEdit()
    this.addClip(this.trackIndex, this.insertIndex, this.redoFrame)
  }

  override undoEdit(): void {
    this.addClip(this.undoTrackIndex, this.undoInsertIndex, this.undoFrame)
    super.undoEdit()
  }

  override updateSelection(): void {
    MOVIEMASHER.eventDispatcher.dispatch(new EventChangeClipId(this.clip.id))
    MOVIEMASHER.eventDispatcher.dispatch(new EventChangedScalars(this.affects))
  }
}

class RemoveClipEditClass extends EditClass {
  constructor(object: RemoveClipEditObject) {
    super(object)
    const { clip, index, track } = object
    this.clip = clip
    this.index = index
    this.track = track
  }

  clip: ClientClip

  index: number

  private get mash(): ClientMashAsset { return this.track.mash }

  get trackIndex(): number { return this.track.index }

  override redoEdit(): void {
    this.mash.removeClipFromTrack(this.clip)
  }

  track: ClientTrack

  override undoEdit(): void {
    this.mash.addClipToTrack(this.clip, this.trackIndex, this.index)
  }

  override updateSelection(): void {
    const { done } = this
    const id = done ? undefined : this.clip.id
    MOVIEMASHER.eventDispatcher.dispatch(new EventChangeClipId(id))
  }
}

const editInstance = (object: EditArgs): Edit => {
  const { type } = object
  switch (type) {
    case ADD: return new AddClipsEditClass(<AddClipsEditObject>object)
    case ADD_TRACK: return new AddTrackEditClass(<AddTrackEditObject>object)
    case CHANGE: return new ChangePropertyEditClass(<ChangePropertyEditObject>object)
    case CHANGE_FRAME: return new ChangeFramesEditClass(<ChangePropertyEditObject>object)
    case CHANGE_MULTIPLE: return new ChangePropertiesEditClass(<ChangePropertiesEditObject>object)
    case MOVE_CLIP: return new MoveClipEditClass(<MoveClipEditObject>object)
    case REMOVE_CLIP: return new RemoveClipEditClass(<RemoveClipEditObject>object)
  }
  errorThrow(ERROR.Internal)
}

class AudioPreviewClass {
  constructor(object: AudioPreviewArgs) {
    const { buffer, gain } = object
    if (isPositive(gain)) this.gain = gain
    if (isAboveZero(buffer)) this.buffer = buffer
  }

  adjustClipGain(clip: Clip, _quantize: number): void {
    const timeRange = clip.timeRange
    const avs = this.clipSources(clip)
    avs.forEach(av => { this.adjustSourceGain(av, timeRange) })
  }

  private adjustSourceGain(av: ClientAudibleInstance, timeRange: TimeRange | StartOptions): void {
    const source = AUDIBLE_CONTEXT.getSource(av.id)
      if (!source) {
        // console.log(this.constructor.name, 'adjustSourceGain no source', clip.id)
        return
      }

      const { gainNode } = source
      if (this.gain === 0.0) {
        gainNode.gain.value = 0.0
        return
      }

      const gain = av.gain

      if (isPositive(gain)) {
        gainNode.gain.value = this.gain * gain
        return
      }

      // position/gain pairs...
      const options = isTimeRange(timeRange) ? av.startOptions(this.seconds, timeRange): timeRange
      const { start, duration } = options

      gainNode.gain.cancelScheduledValues(0)
      av.gainPairs.forEach(pair => {
        const [position, value] = pair
        gainNode.gain.linearRampToValueAtTime(this.gain * value, start + position * duration)
      })
  }

  buffer = 10
  
  bufferClips(clips: Clip[], quantize: number): boolean {
    // console.log(this.constructor.name, 'compositeAudible', clips.length)
    if (!this.createSources(clips, quantize)) return false

    this.destroySources(clips)
    return true
  }

  private bufferSource?: AudioBufferSourceNode

  clear() {  }

  private clipSources(clip: Clip): ClientAudibleInstance[] {
    const avs: ClientAudibleInstance[] = []
    const { container, content } = clip
    if (isClientAudibleInstance(container) && !container.muted) avs.push(container)
    if (isClientAudibleInstance(content) && !content.muted) avs.push(content)
    return avs
  }

  private createSources(clips: Clip[], _quantize: number, time?:Time): boolean {
    // console.log(this.constructor.name, 'createSources', clips.length, 'clip(s)', quantize, time, this.playing)

    if (!this.playing && !time) return false

    const addingClips = clips.filter(clip => !this.playingClips.includes(clip))
    // console.log(this.constructor.name, 'createSources', addingClips.length, 'addingClip(s)')
    if (!addingClips.length) return true

    let okay = true
    addingClips.forEach(clip => {
      const avs = this.clipSources(clip)
      const timeRange = clip.timeRange
      const filtered = avs.filter(av => !AUDIBLE_CONTEXT.hasSource(av.id))
      okay &&= filtered.every(av => {
        const startSeconds = this.playing ? this.seconds: time?.seconds || 0
        const options = av.startOptions(startSeconds, timeRange)
        const { start, duration, offset } = options

        if (isPositive(start) && isAboveZero(duration)) {
          const { asset, id } = av
          const source = asset.audibleSource()
          if (!source) {
            if (!start) {
              // console.log(this.constructor.name, 'createSources no audible source', asset.label)
              // wanted to start immediately but it's not loaded
              return !asset.audio
            }
            return true
          }
          const { loop } = asset 
          // console.log(this.constructor.name, 'createSources', options, loop)
          AUDIBLE_CONTEXT.startAt(id, source, start, duration, offset, loop)

          this.adjustSourceGain(av, options)
        } else console.error(this.constructor.name, 'createSources', options)
        return true
      })
    })
    this.playingClips.push(...addingClips)
    return okay
  }

  private destroySources(clipsToKeep: Clip[] = []): void {
    const sourceClips = [...this.playingClips]
    const clipsToRemove = sourceClips.filter(clip => !clipsToKeep.includes(clip))

    clipsToRemove.forEach(clip => {
      const avs = this.clipSources(clip)
      avs.forEach(av => AUDIBLE_CONTEXT.deleteSource(av.id))
    })
    this.playingClips = clipsToKeep
  }

  gain = 1.0

  setGain(value: number, quantize: number) {
    if (this.gain === value) return

    this.gain = value

    if (this.playing) {
      this.playingClips.forEach(clip => this.adjustClipGain(clip, quantize))
    }

  }

  private playing = false

  private playingClips: Clip[] = []

  get seconds(): number {
    const ellapsed = AUDIBLE_CONTEXT.currentTime - this.contextSecondsWhenStarted
    return ellapsed + this.startedMashAt
  }

  startContext(): void {
    if (this.bufferSource) return errorThrow(ERROR.Internal) 
    if (this.playing) return errorThrow(ERROR.Internal) 

    const buffer = AUDIBLE_CONTEXT.createBuffer(this.buffer)
    this.bufferSource = AUDIBLE_CONTEXT.createBufferSource(buffer)
    this.bufferSource.loop = true
    this.bufferSource.connect(AUDIBLE_CONTEXT.destination)
    this.bufferSource.start(0)
  }

  // called when playhead starts moving
  startPlaying(time: Time, clips: Clip[], quantize: number): boolean {
    if (!this.bufferSource) return errorThrow(ERROR.Internal) 
    if (this.playing) return errorThrow(ERROR.Internal)

    const { seconds } = time
    this.playing = true
    this.startedMashAt = seconds
    this.contextSecondsWhenStarted = AUDIBLE_CONTEXT.currentTime

    if (!this.createSources(clips, quantize, time)) {    
      this.stopPlaying()
      return false
    }
    return true
  }

  // position of masher (in seconds) when startPlaying called
  private startedMashAt = 0

  // currentTime of context (in seconds) was created when startPlaying called
  private contextSecondsWhenStarted = 0

  stopContext(): void {
    if (!this.bufferSource) return

    this.bufferSource.stop()
    this.bufferSource.disconnect(AUDIBLE_CONTEXT.destination)
    delete this.bufferSource
  }

  stopPlaying(): void {
    // console.log(this.constructor.name, 'stopPlaying')
    if (!this.playing) return

    this.playing = false
    this.destroySources()
    this.startedMashAt = 0
    this.contextSecondsWhenStarted = 0
  }
}

export class ClientClipClass extends ClipClass implements ClientClip {
  override asset(assetIdOrObject: string | AssetObject): Asset {
    const event = new EventManagedAsset(assetIdOrObject)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { asset } = event.detail
    assertAsset(asset)

    return asset
  }

  backgroundNode = (size: Size, patternedSize: Size, spacing = 0) => {
    const { width, height } = size
    const { color: fill } = this.track.mash
    const rgb = colorToRgb(fill)
    const differenceRgb = colorRgbDifference(rgb)
    const forecolor = colorFromRgb(differenceRgb)
    const framePolygon = svgPolygonElement(size, '', fill)
    const spaceRect = { x: width, y: 0, width: spacing, height }
    const spacePolygon = svgPolygonElement(spaceRect, '', forecolor)
    const patternSize = { width: width + spacing, height }
    const patternId = idGenerate('pattern')
    const patternItems = [framePolygon, spacePolygon]
    const pattern = svgPatternElement(patternSize, patternId, patternItems)
    const defsElement = svgDefsElement([pattern])
    const patternedPolygon = svgPolygonElement(patternedSize, '', svgUrl(patternId))
    return svgSvgElement(patternedSize, [defsElement, patternedPolygon])
  }

  clipIcon(size: Size, totalSize: Size, scale: number, gap = 1): Promise<SvgOrImageDataOrError> {
    const { timeRange, track } = this
    const { startTime, fps } = timeRange
    const { frame } = startTime
    const { mash } = track
    const widthAndBuffer = size.width + gap
    const cells = arrayOfNumbers(Math.ceil(totalSize.width / widthAndBuffer))
    let pixel = 0
    const times = cells.map(() => {
      const currentFrame = frame + pixelToFrame(pixel, scale, 'floor')
      pixel += widthAndBuffer
      return timeFromArgs(currentFrame, fps)
    })
    const validTimes = times.filter(time => timeRange.intersects(time))
    const previews = validTimes.map(time => {
      const previewArgs: MashPreviewArgs = { clip: this, mash, size, time }
      return new MashPreviewClass(previewArgs)
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
      const point = { ...POINT_ZERO }
      const containerSvg = svgSvgElement(totalSize)
      svgItems.forEach(svgItem => {
        svgSetDimensions(svgItem, point)
        svgAppend(containerSvg, svgItem)
        point.x += widthAndBuffer
      })
      return { data: containerSvg }
    })
  }

  override get container(): ClientVisibleInstance { return super.container as ClientVisibleInstance }

  override get content(): ClientInstance { return super.content as ClientInstance }

  clipPreviewPromise(size: Size, time: Time, component: Panel): Promise<PreviewElement> {
    assertSizeAboveZero(size)


    const { container, content, timeRange } = this

    assertTrue(timeRange.intersects(time), 'clipPreviewPromise timeRange does not intersect time')
    assertContainerInstance(container)
    const containerRectArgs: ContainerRectArgs = {
      size, time, timeRange: timeRange, editing: true,
    }
  
    const containerRects = this.containerRects(containerRectArgs)

    const [containerRect] = containerRects
    assertClientVisibleInstance(content)
    return container.clippedPreviewPromise(content, containerRect, size, time, component)

  }

  override changeScalar(propertyId: PropertyId, scalar?: Scalar): ChangeEditObject {
    const object = super.changeScalar(propertyId, scalar)
    if (!isChangePropertyEditObject(object)) return object
    
    const name = propertyId.split(DOT).pop()
    switch (name) {
      case FRAME: 
      case 'frames': {
        object.type = CHANGE_FRAME
        break
      }
      case 'containerId': 
      case 'contentId': {
        const container = name === 'containerId'
        const relevantTiming = container ? CONTAINER : CONTENT
        const relevantSizing = container ? CONTAINER : CONTENT
        const { timing, sizing, targetId } = this
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
        if (timingBound && !isAudibleAssetType(type)) {
          redoValues[timingId] = CUSTOM
        }
        if (sizingBound && !isVisibleAssetType(type)) {
          redoValues[sizingId] = container ? CONTENT : CONTAINER
        }

        const actionObject: ChangePropertiesEditObject = {
          type: CHANGE_MULTIPLE,
          target: this, redoValues, undoValues
        }
        return actionObject
      }
    }
    return object
  }

  protected override shouldSelectProperty(name: string): boolean {
    switch (name) {
      case 'sizing': return this.content.asset.type !== AUDIO
      case 'timing': {
        if (this.content.hasIntrinsicTiming) break
        return !!this.container?.hasIntrinsicSizing
      }
      case FRAME: return !this.track.dense
      case 'frames': return this.timing === CUSTOM
    }
    return true
  }

  override targetId: TargetId = CLIP_TARGET

  declare track: ClientTrack

  updateAssetId(oldId: string, newId: string): void {
    const { containerId, contentId } = this
    // console.log(this.constructor.name, 'updateAssetId', { oldId, newId, containerId, contentId })
    if (containerId === oldId) this.containerId = newId
    if (contentId === oldId) this.contentId = newId
  }
}

export class ClientTrackClass extends TrackClass implements ClientTrack {
  addClips(clips: ClientClips, insertIndex = 0): void {
    // console.log(this.constructor.name, 'addClips', insertIndex)
    let clipIndex = insertIndex || 0
    if (!this.dense) clipIndex = 0 // ordered by clip.frame values

    const origIndex = clipIndex // note original, since it may decrease...
    const movingClips: ClientClips = [] // build array of clips already in this.clips

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

  declare clips: ClientClips

  frameForClipNearFrame(clip: ClientClip, insertFrame = 0): number {
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

  removeClips(clips: ClientClips): void {
    const newClips = this.clips.filter(other => !clips.includes(other))
    assertTrue(newClips.length !== this.clips.length)
    
    clips.forEach(clip => clip.trackNumber = -1)
    this.sortClips(newClips)
    arraySet(this.clips, newClips)
  }
}

const TrackPreviewHandleSize = 8

const TrackPreviewLineSize = 2

const tweenMinMax = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value))
}

/**
 * MashPreview of a single track at a single frame, thus representing a single clip 
 */
export class TrackPreviewClass implements TrackPreview {
  constructor(public args: TrackPreviewArgs) {}
  
  get clip(): ClientClip { return this.args.clip }

  private _timeRange?: TimeRange
  private get clipTimeRange() { return this._timeRange ||= this.clip.timeRange }

  get container(): ClientVisibleInstance { return this.clip.container! }

  editingSvgItem(classes: string[], inactive?: boolean): SvgItem {
    // console.log(this.constructor.name, 'editingSvgItem', className)
    const { container, rect } = this
    const svgItem = container.pathElement(rect)

    svgItem.setAttribute('vector-effect', 'non-scaling-stroke')
    svgAddClass(svgItem, classes)
    if (!inactive) svgItem.addEventListener('pointerdown', this.pointerDownHandler(), { once: true })
  
    return svgItem
  }

  get icon(): boolean { return !!this.args.icon }

  private pointerDownHandler() {
    const event = new EventRect()
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { rect: previewRect } = event.detail
    assertRect(previewRect)

    const clickPoint = { ...POINT_ZERO }
    const offsetPoint = { ...POINT_ZERO }

    const { container, clipTimeRange: range, rect: clipRect, clip } = this

    const pointAspect = container.value(`point${ASPECT}`)
    const flipped = pointAspect && previewRect.width < previewRect.height
 
    const horzPointKey = flipped ? 'y' : 'x'
    const vertPointKey = flipped ? 'x' : 'y'
    const horzEndKey = `${horzPointKey}${END}`
    const vertEndKey = `${vertPointKey}${END}`

    const pointTweening = (
      isDefined(container.value(horzEndKey)) || isDefined(container.value(vertEndKey))
    )

    const removeWindowHandlers = () => {
      // console.log(this.constructor.name, 'removeWindowHandlers', this.clip.id, this.clip.containerId)
      globalThis.window.removeEventListener('pointermove', pointerMoveStart)
      globalThis.window.removeEventListener('pointermove', pointerMove)
      globalThis.window.removeEventListener('pointerup', pointerUp)
      globalThis.window.removeEventListener('pointerup', pointerDown)
    }

    const pointerUp = (event: MouseEvent) => {
      eventStop(event)

      // console.log(this.constructor.name, 'pointerUp', this.clip.id, this.clip.containerId)
      removeWindowHandlers()
      MOVIEMASHER.eventDispatcher.dispatch(new EventChangeDragging(false))
    }

    const nowPoint = (event: MouseEvent): Point => {
      const { clientX: x, clientY: y } = event
      return { x, y }
    }

    const pointerMove = (event: MouseEvent) => {
      eventStop(event)

      // localize mouse point to preview rect
      const pointNow = nowPoint(event)
      const currentPoint = pointTranslate(pointNow, previewRect, true)
      
      // remove any offset from the down point
      const movePoint = pointTranslate(currentPoint, offsetPoint, true)
        
      const leftCrop = container.value(`${flipped ? TOP : LEFT}${CROP}`)
      const rightCrop = container.value(`${flipped ? BOTTOM : RIGHT}${CROP}`)
      const topCrop = container.value(`${flipped ? LEFT : TOP}${CROP}`)
      const bottomCrop = container.value(`${flipped ? RIGHT : BOTTOM}${CROP}`)
      
      const totalSize = sizeTranslate(previewRect, clipRect, true)
   
      const zeroPoint = { ...POINT_ZERO }
      if (leftCrop) {
        zeroPoint.x -= clipRect.width
        totalSize.width += clipRect.width
      }
      if (rightCrop) {
        totalSize.width += clipRect.width
      }
      if (topCrop) { 
        zeroPoint.y -= clipRect.height
        totalSize.height += clipRect.height
      }
      if (bottomCrop) {
        totalSize.height += clipRect.height
      }
      const offset = pointTranslate(movePoint, zeroPoint, true)

      const limitedPoint: Point = {
        x: tweenMinMax(offset.x, 0, totalSize.width),
        y: tweenMinMax(offset.y, 0, totalSize.height),
      }
    
      const timeEvent = new EventMashTime()
      MOVIEMASHER.eventDispatcher.dispatch(timeEvent)
      const { time } = timeEvent.detail
      assertTime(time)

      const tweening = pointTweening && time.frame === range.lastTime.frame
  
      const horzId = `${CONTAINER}${DOT}${tweening ? horzEndKey : horzPointKey}`
      const vertId = `${CONTAINER}${DOT}${tweening ? vertEndKey : vertPointKey}`

      const redoValues: ScalarsById = { 
        [horzId]: totalSize.width ? limitedPoint.x / totalSize.width : container.value(horzId), 
        [vertId]: totalSize.height ? limitedPoint.y / totalSize.height : container.value(vertId), 
      }
      MOVIEMASHER.eventDispatcher.dispatch(new EventChangeScalars(redoValues))
    }

    const pointerMoveStart = (event: MouseEvent) => {

      // console.log(this.constructor.name, 'pointerMoveStart', this.clip.id, this.clip.containerId)

      // console.log('pointerMoveStart setting dragging')
      eventStop(event)
      const { clientX: x, clientY: y } = event
      if (pointsEqual({ x, y }, clickPoint)) return

      globalThis.window.removeEventListener('pointermove', pointerMoveStart)
      // make sure we're either not tweening, or on start/end frame
      if (pointTweening) {
        const timeEvent = new EventMashTime()
        MOVIEMASHER.eventDispatcher.dispatch(timeEvent)
        const { time } = timeEvent.detail
        assertTime(time)

        const closest = time.closest(range)
        if (!time.equalsTime(closest)) {
          removeWindowHandlers()
          const frame = closest.scaleToFps(this.preview.mash.quantize).frame
          // console.log(this.constructor.name, 'pointerMoveStart going to', frame, time, closest)
          MOVIEMASHER.eventDispatcher.dispatch(new EventChangeFrame(frame))
          return
        }
      }
      // set new move listener, and call it
      // console.log('pointerMoveStart setting dragging')
      MOVIEMASHER.eventDispatcher.dispatch(new EventChangeDragging(true))
     
      globalThis.window.addEventListener('pointermove', pointerMove)
      pointerMove(event)
    }

    const pointerDown: EventFunction = event => {
      eventStop(event)
      
      if (!(event instanceof PointerEvent)) return 
      
      const { clientX: x, clientY: y } = event
      clickPoint.x = x
      clickPoint.y = y
      
      const downPoint = pointTranslate(clickPoint, previewRect, true) 

      // console.log(this.constructor.name, 'pointerDown', this.clip.id, this.clip.containerId)
      const point = pointTranslate(downPoint, clipRect, true)
      offsetPoint.x = point.x
      offsetPoint.y = point.y

      globalThis.window.addEventListener('pointermove', pointerMoveStart)
      globalThis.window.addEventListener('pointerup', pointerUp)

      MOVIEMASHER.eventDispatcher.dispatch(new EventChangeClipId(clip.id))
    }
    return pointerDown
  }

  private get preview() { return this.args.preview }

  private _rect?: Rect
  private get rect() { return this._rect || this.rectInitialize }
  private get rectInitialize() {
    const { time, clipTimeRange: timeRange, clip, size } = this
    assertSizeAboveZero(size, `${this.constructor.name}.rectInitialize size`)
    const containerRectArgs: ContainerRectArgs = {
      size, time, timeRange, editing: true,
    }
    const containerRects = clip.containerRects(containerRectArgs)

    return containerRects[0]
  }
  
  private get size(): Size { return this.preview.size }

  svgBoundsElement(lineClasses: string[], handleClasses: string[], inactive?: boolean): SvgItems {
    const items: SvgItems = []
    const handle = TrackPreviewHandleSize
    const line = TrackPreviewLineSize 
    const halfLine = line / 2
    const { rect, container } = this
    const { directions } = container
    const { width, height, x, y } = rect
    const lineRect = { x: x - halfLine, y: y - halfLine, width: width, height: line }
    
    items.push(svgPolygonElement(lineRect, lineClasses))
    lineRect.y = y + height - halfLine
    items.push(svgPolygonElement(lineRect, lineClasses))
    lineRect.x = x + width - halfLine
    lineRect.height = height
    lineRect.width = line
    lineRect.y = y
    items.push(svgPolygonElement(lineRect, lineClasses))
    lineRect.x = x - halfLine
    items.push(svgPolygonElement(lineRect, lineClasses))

    const { id } = this.clip
    const size = { width, height }
    directions.forEach(direction => {
      const point = this.svgHandlePoint(size, direction)
      const rect = { x: x + point.x, y: y + point.y, width: handle, height: handle }
      const element = svgPolygonElement(rect, [...handleClasses, direction.toLowerCase()])
      items.push(element)
      if (inactive) return 

      const pointerDown: EventFunction = (pointerEvent) => {
        eventStop(pointerEvent)
        console.log(this.constructor.name, 'pointerDown', id, this.clip.containerId, direction)
        MOVIEMASHER.eventDispatcher.dispatch(new EventChangeClipId(id))
      }
      element.addEventListener('pointerdown', pointerDown, { once: true })
    })
    // svgSetTransformPoint(groupElement, rect)
    return items
  }

  private svgHandlePoint(dimensions: Size, direction: Direction): Point {
    const handle = TrackPreviewHandleSize
    const halfHandle = handle / 2

    const { width, height } = dimensions
    const point = { ...POINT_ZERO }
    const [first, second] = String(direction).split(DASH)
    const last = second || first
    switch(last) {
      case RIGHT:
        point.x = - halfHandle
        break
      case LEFT:
        point.x = width - halfHandle
        break
      default: point.x = Math.round(width / 2) - halfHandle
    }
    switch(first) {
      case TOP:
        point.y = - halfHandle
        break
      case BOTTOM: 
        point.y = height - halfHandle
        break
      default: point.y = Math.round(height / 2) - halfHandle
    }
    return point
  }

  private get time(): Time { return this.preview.time }
}

/**
 * MashPreview of a single mash at a single frame
 */
export class MashPreviewClass implements MashPreview {
  constructor(args: MashPreviewArgs) {
    const { selectedClip, time, mash, clip, size } = args
    this.mash = mash
    this.size = size || mash.size
    this.time = time
    this.selectedClip = selectedClip
    this.clip = clip
  }

  audible = false

  clip?: ClientClip

  private _clips?: ClientClips
  protected get clips() { return this._clips ||= this.clipsInitialize }
  private get clipsInitialize() {
    const { mash, time, clip } = this
    if (clip) return [clip]
    
    return mash.clipsInTimeOfType(time, VIDEO).sort(sortByTrack) 
  }

  combine = false

  get duration(): number { return this.time.lengthSeconds }
  
  get intrinsicSizePromise(): Promise<void> {
    const { clips, time, quantize } = this
    const options: IntrinsicOptions = { editing: true, size: true }
    const unknownClips = clips.filter(clip => !clip.intrinsicsKnown(options))

    const args: InstanceCacheArgs = {
      quantize,
      visible: true, time, clipTime: timeRangeFromTime(time)
    }
    const promises = unknownClips.map(clip => {
      args.clipTime = clip.timeRange
      return clip.clipCachePromise(args)
    })

    return Promise.all(promises).then(VOID_FUNCTION)
  }

  mash: ClientMashAsset

  get previewsPromise(): Promise<PreviewElements> { 
    if (this._previews) return Promise.resolve(this._previews)

    const sizePromise = this.intrinsicSizePromise  
    const itemsPromise = sizePromise.then(() => {
      const { clips, size, time, clip } = this
    
      let promise = Promise.resolve([] as PreviewElements)
      const component = clip ? TIMELINE : PLAYER

      clips.forEach(clip => {
        promise = promise.then(lastTuple => {
          return clip.clipPreviewPromise(size, time, component).then(svgItem => {
            return [...lastTuple, svgItem] 
          })
        })
      })
      return promise 
    })
  
    return itemsPromise.then(items => {
      const { clip } = this
      const previews = (!clip && items.length) ? this.previews(items) : items
      return this._previews = previews
    })
  }

  get quantize(): number { return this.mash.quantize }

  size: Size

  selectedClip?: ClientClip

  streaming = false

  private _previews?: PreviewElements
  
  get svgItemsPromise(): Promise<SvgItems> { 
    return this.previewsPromise as Promise<SvgItems>
  }

  time: Time

  private _trackPreviews?: TrackPreviews
  private get trackPreviews() { return this._trackPreviews ||= this.trackPreviewsInitialize }
  protected get trackPreviewsInitialize(): TrackPreviews {
    const trackPreviews: TrackPreviews = []
    const { time, quantize, clips } = this
    const tweenTime = time.isRange ? undefined : time.scale(quantize)
  
    clips.forEach(clip => {
      const clipTimeRange = clip!.timeRange
      const range = clipTimeRange.scale(time.fps)
      const frame = Math.max(0, time.frame - range.frame)
      const timeRange = range.withFrame(frame)
      const filterChainArgs: TrackPreviewArgs = {
        clip, preview: this, tweenTime, timeRange, icon: !!this.clip
      }
      trackPreviews.push(new TrackPreviewClass(filterChainArgs))
    })
    return trackPreviews
  }

  private previews(items: PreviewElements): PreviewElements {
    if (!items.length) return items
    
    items.forEach(item => svgAddClass(item, LAYER))

    const copy = [...items]
    const { size, selectedClip } = this

    const { trackPreviews } = this
    const event = new EventDragging()
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const dragging = event.detail.dragging

    const selectedPreview = selectedClip ? trackPreviews.find(preview => preview.clip === selectedClip) : undefined
    const hoverItems: SvgItems = trackPreviews.map(trackPreview => {
      const trackSelected = trackPreview === selectedPreview
      const classes = [OUTLINE]
      if (!(dragging || trackSelected)) classes.push(ANIMATE)
      return trackPreview.editingSvgItem(classes)
    })
    const hoversSvg = svgSvgElement(size, hoverItems)
    svgAddClass(hoversSvg, OUTLINES)

    copy.push(hoversSvg)
    if (!selectedPreview) return copy
    
    const lineClasses = [LINE]
    const handleClasses = [HANDLE]
    const activeSvg = svgSvgElement(size, selectedPreview.svgBoundsElement(lineClasses, handleClasses, true))
    svgAddClass(activeSvg, [BOUNDS, BACK])
    
    const passiveSvg = svgSvgElement(size, selectedPreview.svgBoundsElement(lineClasses, handleClasses))
    svgAddClass(passiveSvg, [BOUNDS, FORE])
    copy.push(activeSvg, passiveSvg)
    return copy
  }

  visible = true
}

export class NonePreview extends MashPreviewClass {
  protected override get clips(): ClientClips { return [] }
}

const WithMashAsset = MashAssetMixin(ClientAssetClass)
export class ClientMashAssetClass extends WithMashAsset implements ClientMashAsset {
  constructor(args: ClientMashAssetObject) {
    super(args)
    this.listeners[EventFrames.Type] = this.handleFrames.bind(this)
    this.listeners[EventSize.Type] = this.handleSize.bind(this)
    this.actions = new EditsClass(this)
  }
  
  actions: Edits

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

    const event = new EventChangedTracks(detail)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    return track
  }


  override get assetObject(): ClientMashAssetObject {
    const object = super.assetObject
    const { encodings } = this
    return { ...object, encodings }
  }

  buffer = 10 // seconds

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
      this._composition = new AudioPreviewClass(options)
    }
    return this._composition!
  }

  
  override assetIcon(_size: Size): Promise<SVGSVGElement> | undefined {
    return
  }

  destroy(): void {
    this.paused = true
    MOVIEMASHER.eventDispatcher.listenersRemove(this.listeners)
    this.clearDrawInterval()

  }

  dispatchChanged(action: Edit): void {
    this.clearPreview()
    if (isChangePropertyEdit(action)) {
      const { property, target } = action
      switch(property) {
        case `${CONTENT}${DOT}gain`: {
          if (isClientClip(target)) {
            this.composition.adjustClipGain(target, this.quantize)
          }    
          break
        }
      }
    }
    
    // console.log(this.constructor.name, 'dispatchChanged', action.constructor.name)
    MOVIEMASHER.eventDispatcher.dispatch(new EventChanged(action))
    MOVIEMASHER.eventDispatcher.dispatch(new EventChangedServerAction(SAVE))
    // const promise = this.reload() || Promise.resolve()
    
    // promise.then(() => this.dispatchDrawLater())
    this.draw()
  }

  private dispatchChangedPreviews(time: Time): void {
    this.drawingTime = time
    this.clearPreview()
    MOVIEMASHER.eventDispatcher.dispatch(new EventChangedPreviews())
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
      MOVIEMASHER.eventDispatcher.dispatch(event)
    }
  }

  private drawingTime?: Time

  drawnTime?: Time

  private emitIfFramesChange(method: () => void): void {
    const origFrames = this.frames
    method()
    const { totalFrames: frames } = this
    if (origFrames !== frames) {
      MOVIEMASHER.eventDispatcher.dispatch(new EventChangedFrames(frames))
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
    this._preview = new NonePreview({ mash: this, time: timeFromArgs() })

    const { encodings } = object 
    if (isArray(encodings)) this.encodings.push(...encodings)
    super.initializeProperties(object)  

    MOVIEMASHER.eventDispatcher.listenersAdd(this.listeners)
    MOVIEMASHER.eventDispatcher.dispatch(new EventChangedSize(this.size))
    MOVIEMASHER.eventDispatcher.dispatch(new EventChangedFrames(this.totalFrames))
  }

  get loading(): boolean { 
    // console.log(this.constructor.name, 'loading', this.loadingPromises.length)
    return !!this.loadingPromises.length 
  }

  private loadingPromises: Promise<void>[] = []
  
  protected listeners: EventDispatcherListeners = {}
  
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
    return Promise.all(promises).then(VOID_FUNCTION)
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

  mashPreviewsPromise(size?: Size, selectedClip?: ClientClip): Promise<PreviewElements> {
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
    const event = new EventChangedTracks(detail)
    MOVIEMASHER.eventDispatcher.dispatch(event)
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
      const { frame } = timeFromSeconds(time.seconds, this.quantize)
      const event = new EventChangedFrame(frame)
      MOVIEMASHER.eventDispatcher.dispatch(event)
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
          MOVIEMASHER.eventDispatcher.dispatch(new EventChangedSize(this.size))
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
