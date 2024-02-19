import type { AVType, Asset, AssetCacheArgs, AssetObject, Assets, CacheOptions, ChangeEditObject, ChangePropertiesEditObject, ChangePropertyEditObject, Clip, ClipObject, ContainerInstance, ContainerRectArgs, ContainerSvgItemArgs, DataOrError, Direction, EditArgs, EditObject, Encodings, EventDispatcherListeners, Instance, InstanceCacheArgs, NumberRecord, Panel, Point, PointOrSize, Propertied, Property, PropertyId, PropertyIds, Rect, Scalar, ScalarTuple, ScalarsById, SideDirectionRecord, Size, StringDataOrError, Strings, SvgElement, SvgItem, SvgItems, ServerProgress, SvgItemsRecord, SvgVector, TargetId, TextAsset, TextInstance, Time, TimeRange, Track, TrackArgs, TrackObject, UnknownRecord } from '@moviemasher/shared-lib/types.js'
import type { AddClipsEditObject, AddTrackEditObject, AudioPreview, AudioPreviewArgs, ChangeEdit, ChangePropertiesEdit, ChangePropertyEdit, ClientAudibleInstance, ClientAudioInstance, ClientClip, ClientClips, ClientInstance, ClientMashAsset, ClientMashAssetObject, ClientMashDescription, ClientMashDescriptionArgs, ClientMashDescriptionOptions, ClientSegmentDescription, ClientSegmentDescriptionArgs, ClientSegmentDescriptions, ClientTrack, ClientTracks, ClientVisibleInstance, ClipIconArgs, Edit, Edits, EventFunction, MoveClipEditObject, RemoveClipEditObject, StartOptions } from '../../types.js'

import { ClipClass } from '@moviemasher/shared-lib/base/clip.js'
import { MashDescriptionClass } from '@moviemasher/shared-lib/base/description.js'
import { TrackClass } from '@moviemasher/shared-lib/base/track.js'
import { MashAssetMixin } from '@moviemasher/shared-lib/mixin/mash.js'
import { $ASPECT, $AUDIO, $BOTTOM, $CHANGE, $CHANGES, $CLIP, $CONTAINER, $CONTENT, $CROP, $CUSTOM, $END, $FLIP, $FRAME, $LEFT, $MASH, $OPACITY, $PLAYER, $POINT, $RIGHT, $ROUND, $SIZE, $STRING, $TEXT, $TIMELINE, $TOP, DASH, DOT, ERROR, MOVIEMASHER, POINT_KEYS, POINT_ZERO, SIZE_KEYS, VOID_FUNCTION, arrayFromOneOrMore, arrayOfNumbers, arraySet, assertAsset, errorThrow, isAsset, isAudibleType, isDefiniteError, isVisibleType, jsonStringify, sortByIndex } from '@moviemasher/shared-lib/runtime.js'
import { isArray, isDefined, isNumber, isAboveZero, isPositive, isObject } from '@moviemasher/shared-lib/utility/guard.js'
import { assertDefined, assertPopulatedString, assertPositive, assertRect, assertTrue, isImageAsset, isInstance, isPropertyId, isVisibleInstance } from '@moviemasher/shared-lib/utility/guards.js'
import { assertSizeNotZero, containSize, copyPoint, roundPoint, sizeNotZero, translatePoint } from '@moviemasher/shared-lib/utility/rect.js'
import { recordFromItems, simplifyRecord, svgAddClass, svgAppend, svgPolygonElement, svgSet, svgSetDimensions, svgSvgElement } from '@moviemasher/shared-lib/utility/svg.js'
import { timeFromArgs, timeFromSeconds, timeRangeFromTime, timeRangeFromTimes } from '@moviemasher/shared-lib/utility/time.js'
import { ClientAssetClass } from '../../base/ClientAssetClass.js'
import { assertClientAudibleInstance, assertClientInstance, assertClientVisibleInstance, isClientAudibleInstance, isClientInstance } from '../../guards/ClientGuards.js'
import { isClientClip } from '../../guards/ClientMashGuards.js'
import { isChangeEdit, isChangeEditObject, isChangePropertyEdit, isChangePropertyEditObject } from '../../guards/EditGuards.js'
import { AUDIBLE_CONTEXT } from '../../mixin/audible.js'
import { ADD, ADD_TRACK, ANIMATE, BACK, BOUNDS, CHANGE_FRAME, FORE, HANDLE, LAYER, LINE, MOVE_CLIP, OUTLINE, OUTLINES, PLAY, REDO, REMOVE_CLIP, SAVE, UNDO, assertDatasetElement, eventStop } from '../../runtime.js'
import { EventCanDestroy, EventChangeAssetId, EventChangeClipId, EventChangeFrame, EventChangeScalars, EventChangedClientAction, EventChangedFrame, EventChangedFrames, EventChangedPreviews, EventChangedScalars, EventChangedServerAction, EventChangedSize, EventChangedTracks, EventEdited, EventFrames, EventManagedAsset, EventRect, EventSize } from '../../utility/events.js'
import { pixelFromFrame, pixelToFrame } from '../../utility/pixel.js'

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
  return isImageAsset(value) && value.source === $TEXT
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
    const { type = $CHANGE, ...rest } = object
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
            this.dispatchChangedEdit(action)
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
              this.dispatchChangedEdit(action)
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

  private dispatchChangedAction(): void {
    MOVIEMASHER.dispatch(new EventChangedClientAction(UNDO))
    MOVIEMASHER.dispatch(new EventChangedClientAction(REDO))
  }

  private dispatchChangedEdit(edit: Edit): void {
    const { mashAsset } = this
    edit.updateSelection()
    this.dispatchChangedAction()
    mashAsset.dispatchChanged(edit)
  }

  private index = -1

  private instances: Edit[] = []

  redo(): void {
    this.index += 1
    const action = this.currentEdit
    assertDefined(action)

    action.redo()
    this.dispatchChangedEdit(action)
  }

  save(): void {
    this.instances.splice(0, this.index + 1)
    this.index = -1
    this.dispatchChangedAction()
  }

  undo(): void {
    const action = this.currentEdit
    assertDefined(action)
    
    this.index -= 1
    action.undo()
    this.dispatchChangedEdit(action)
  }
}

class EditClass implements Edit {
  constructor(object: EditArgs) {
    this.type = object.type
  }

  get affects(): PropertyIds { return [] }

  done = false

  redo(): void {
    this.redoEdit()
    this.done = true
  }

  protected redoEdit(): void { errorThrow(ERROR.Unimplemented) }

  type: string

  undo(): void {
    this.undoEdit()
    this.done = false
  }

  protected undoEdit(): void { errorThrow(ERROR.Unimplemented) }

  updateSelection(): void {}
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
    MOVIEMASHER.dispatch(new EventChangeClipId(id))
  }
}

class ChangeEditClass extends EditClass implements ChangeEdit {
  constructor(object: ChangeEditObject) {
    const { target } = object
    super(object)
    this.target = target
  }

  target: Propertied

  updateEdit(_: ChangeEditObject): void { errorThrow(ERROR.Unimplemented) }

  override updateSelection(): void {
    const { target } = this
    if (isClientClip(target)) {
      MOVIEMASHER.dispatch(new EventChangeClipId(target.id))
    } else if (isClientInstance(target)) {
      MOVIEMASHER.dispatch(new EventChangeClipId(target.clip.id))
    } else if (isAsset(target)) {
      MOVIEMASHER.dispatch(new EventChangeAssetId(target.id))
    }
    MOVIEMASHER.dispatch(new EventChangedScalars(this.affects))
  }
}

class ChangePropertyEditClass extends ChangeEditClass implements ChangePropertyEdit {
  constructor(object: ChangePropertyEditObject) {
    super(object)
    const { property, redoValue, undoValue } = object
    this.redoValue = redoValue
    this.undoValue = undoValue
    this.property = property
  }

  override get affects(): PropertyIds { return [this.property] }

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
      clip, insertIndex, redoFrame, trackIndex, undoFrame, 
      undoInsertIndex, undoTrackIndex
    } = object
    this.clip = clip
    this.insertIndex = insertIndex
    this.redoFrame = redoFrame
    this.trackIndex = trackIndex
    this.undoFrame = undoFrame
    this.undoInsertIndex = undoInsertIndex
    this.undoTrackIndex = undoTrackIndex
  }

  override get affects(): PropertyIds { return [`${$CLIP}${DOT}frame`] }

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
    MOVIEMASHER.dispatch(new EventChangeClipId(this.clip.id))
    MOVIEMASHER.dispatch(new EventChangedScalars(this.affects))
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
    MOVIEMASHER.dispatch(new EventChangeClipId(id))
  }
}

const editInstance = (object: EditArgs): Edit => {
  const { type } = object
  switch (type) {
    case ADD: return new AddClipsEditClass(<AddClipsEditObject>object)
    case ADD_TRACK: return new AddTrackEditClass(<AddTrackEditObject>object)
    case $CHANGE: return new ChangePropertyEditClass(<ChangePropertyEditObject>object)
    case CHANGE_FRAME: return new ChangeFramesEditClass(<ChangePropertyEditObject>object)
    case $CHANGES: return new ChangePropertiesEditClass(<ChangePropertiesEditObject>object)
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
    this.audibleInstances(clip).forEach(audibleInstance => { 
      const options = this.startOptions(audibleInstance, this.seconds, timeRange)
      this.adjustSourceGain(audibleInstance, options) 
    })
  }

  private adjustSourceGain(audibleInstance: ClientAudibleInstance, options: StartOptions): void {
    const source = AUDIBLE_CONTEXT.getSource(audibleInstance.id)
    if (!source) return

    const { gainNode } = source
    if (this.gain === 0.0) {
      gainNode.gain.value = 0.0
      return
    }
    const { gain, speed } = audibleInstance
    if (isPositive(gain)) {
      gainNode.gain.value = this.gain * gain
      return
    }
    // position/gain pairs...
    const { start, duration } = options
    gainNode.gain.cancelScheduledValues(0)
    audibleInstance.gainPairs.forEach(pair => {
      const [position, value] = pair
      gainNode.gain.linearRampToValueAtTime(this.gain * value, start + (position * duration * speed))
    })
  }

  buffer = 10
  
  bufferClips(clips: Clip[], quantize: number): boolean {
    // console.log(this.constructor.name, 'bufferClips', clips.length)
    if (!this.createSources(clips, quantize)) return false

    this.destroySources(clips)
    return true
  }

  private bufferSource?: AudioBufferSourceNode

  clear() {}

  private audibleInstances(clip: Clip): ClientAudibleInstance[] {
    const instances: ClientAudibleInstance[] = []
    const { container, content } = clip
    if (isClientAudibleInstance(container) && !container.muted) instances.push(container)
    if (isClientAudibleInstance(content) && !content.muted) instances.push(content)
    return instances
  }

  private createSources(clips: Clip[], _quantize: number, time?:Time): boolean {
    if (!this.playing && !time) return false

    const addingClips = clips.filter(clip => !this.playingClips.includes(clip))
    // console.log(this.constructor.name, 'createSources', addingClips.length, 'addingClip(s)')
    if (!addingClips.length) return true

    let okay = true
    addingClips.forEach(clip => {
      const audibleInstances = this.audibleInstances(clip)
      const { timeRange } = clip
      const filtered = audibleInstances.filter(av => !AUDIBLE_CONTEXT.hasSource(av.id))
      // console.log(this.constructor.name, 'createSources', audibleInstances.length, filtered.length, 'audibleInstance(s)')
      okay &&= filtered.every(audibleInstance => {
        const startSeconds = this.playing ? this.seconds: time?.seconds || 0

        const options = this.startOptions(audibleInstance, startSeconds, timeRange)
        const { start, duration, offset } = options

        if (isPositive(start) && isAboveZero(duration)) {
          const { asset, id } = audibleInstance
          const source = asset.audibleSource()
          if (!source) return start ? true : !asset.canBeMuted
          
          // console.log(this.constructor.name, 'createSources starting', asset.label, start, duration, offset)
          AUDIBLE_CONTEXT.startAt(id, source, start, duration, audibleInstance.speed, offset)

          this.adjustSourceGain(audibleInstance, options)
        } 
        return true
      })
    })
    this.playingClips.push(...addingClips)
    return okay
  }

  private startOptions(instance: ClientAudibleInstance, startSeconds: number, timeRange: TimeRange): StartOptions {
    const { fps } = timeRange
    const [_, startTrimFrame] = instance.assetFrames(fps)
    let duration = timeRange.lengthSeconds
    let start = timeRange.seconds - startSeconds
    let offset = (startTrimFrame / fps) //* speed
    if (start < 0) {
      duration += start //* speed
      offset -= start //* speed
      start = 0
    }
    return { start, offset, duration }
  }

  private destroySources(clipsToKeep: Clip[] = []): void {
    const sourceClips = [...this.playingClips]
    const clipsToRemove = sourceClips.filter(clip => !clipsToKeep.includes(clip))

    clipsToRemove.forEach(clip => {
      const avs = this.audibleInstances(clip)
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
    // console.log(this.constructor.name, 'startContext')
    if (this.bufferSource) errorThrow(ERROR.Internal) 
    if (this.playing) errorThrow(ERROR.Internal) 

    const buffer = AUDIBLE_CONTEXT.createBuffer(this.buffer)
    this.bufferSource = AUDIBLE_CONTEXT.createBufferSource(buffer)
    this.bufferSource.loop = true
    this.bufferSource.connect(AUDIBLE_CONTEXT.destination)
    this.bufferSource.start(0)
  }

  // called when playhead starts moving
  startPlaying(time: Time, clips: Clip[], quantize: number): boolean {
    // console.log(this.constructor.name, 'startPlaying')

    if (!this.bufferSource) errorThrow(ERROR.Internal) 
    if (this.playing) errorThrow(ERROR.Internal)

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

  // currentTime of audioContext (in seconds) was created when startPlaying called
  private contextSecondsWhenStarted = 0

  stopContext(): void {
    // console.log(this.constructor.name, 'stopContext')
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

  // this should return data or error asset

  override asset(assetIdOrObject: string | AssetObject): Asset {
    const event = new EventManagedAsset(assetIdOrObject)
    MOVIEMASHER.dispatch(event)
    const { asset } = event.detail
    assertAsset(asset, jsonStringify(assetIdOrObject))

    return asset
  }

  override get container(): ClientVisibleInstance & ContainerInstance { return super.container as ClientVisibleInstance }

  override get content(): ClientInstance & ContainerInstance | ClientAudioInstance { return super.content as ClientInstance & ContainerInstance | ClientAudioInstance  }

  elementPromise(outputSize: Size, time: Time, panel: Panel): Promise<DataOrError<SvgItemsRecord>> {
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
      const {svgElement:svg} = this
      simplifyRecord(record, outputSize, svg)
      // svgSetChildren(svg, [...styles, svgDefsElement(defs), ...items])
      // svgSetDimensions(svg, outputSize)
      return { data: recordFromItems([svg])}
    })
  }

  override changeScalar(propertyId: PropertyId, scalar?: Scalar): ChangeEditObject {
    const object = super.changeScalar(propertyId, scalar)
    if (!isChangePropertyEditObject(object)) return object
    
    const name = propertyId.split(DOT).pop()
    switch (name) {
      case $FRAME: 
      case 'frames': {
        object.type = CHANGE_FRAME
        break
      }
      case 'containerId': 
      case 'contentId': {
        const container = name === 'containerId'
        const relevantTiming = container ? $CONTAINER : $CONTENT
        const relevantSizing = container ? $CONTAINER : $CONTENT
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
        if (timingBound && !isAudibleType(type)) {
          redoValues[timingId] = $CUSTOM
        }
        if (sizingBound && !isVisibleType(type)) {
          redoValues[sizingId] = container ? $CONTENT : $CONTAINER
        }

        const actionObject: ChangePropertiesEditObject = {
          type: $CHANGES,
          target: this, redoValues, undoValues
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
      case 'frames': {
        assertPositive(value)

        const { track, frame } = this
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

  override resetTiming(instance?: Instance, quantize?: number): void {
    super.resetTiming(instance, quantize)
    this.track?.mash.framesHaveChanged()
  }

  override setValue(id: string, value?: Scalar): ScalarTuple {
    const tuple = super.setValue(id, value)
    const [name] = tuple
    switch (name) {
      case 'frames': {
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
          MOVIEMASHER.dispatch(new EventCanDestroy([_container.asset.id]))
        } // else this._containerObject = {}
        break
      }
      case 'contentId': {
        const { _content } = this
        if (_content) {
          this._contentObject = _content.instanceObject
          delete this._content
          MOVIEMASHER.dispatch(new EventCanDestroy([_content.asset.id]))
        } 
        break
      }
    }
    return tuple
  }
  
  protected override shouldSelectProperty(property: Property, targetId: TargetId): Property | undefined {
    if (targetId !== property.targetId) return
    const { name } = property
    switch (name) {
      case 'sizing': return this.content.asset.type === $AUDIO ? undefined : property
      case 'timing': {
        if (this.content.hasIntrinsicTiming) break
        return isVisibleInstance(this.container) && this.container.asset.hasIntrinsicSizing ? property : undefined
      }
      case $FRAME: return this.track.dense ? undefined : property
      case 'frames': return this.timing === $CUSTOM ? property : undefined
    }
    return super.shouldSelectProperty(property, targetId)
  }

  // private _svgElement?: SvgElement

  private get svgElement() {
    // console.debug(this.constructor.name, 'svgElement USED!')
    return svgSvgElement() //this._svgElement ||= svgSvgElement()
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
        const mashDescriptionArgs: ClientMashDescriptionArgs = { 
          clip: this, mash, time, size: { width, height: visibleHeight }
        }
        return new ClientMashDescriptionClass(mashDescriptionArgs)
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


const minMax = (value: number, max: number = 1, min: number = 0): number => {
  return Math.min(max, Math.max(min, value))
}

interface Doing {
  /** offset relative to container rect for Pointing,  */
  offsetPoint: Point
  pointFlipping: boolean
  pointTweening: boolean
  moveHandler: EventFunction<PointerEvent>
  moved?: boolean
  clickedNumbers: NumberRecord
}

interface Sizing extends Doing {
  sizeFlipping: boolean
  sizeTweening: boolean
  direction: string
  clickedPreviewPoint: Point
  clickedRect: Rect
}

interface Pointing extends Doing {
}

export const sizeTranslate = (size: Size, translate: Size, negate = false): Size => {
  const { width, height } = size
  const negator = negate ? -1 : 1
  return {
    width: width + translate.width * negator,
    height: height + translate.height * negator
  }
}

/**
 * MashPreview of a single track at a single frame, thus representing a single clip 
 */
export class ClientSegmentDescriptionClass implements ClientSegmentDescription {
  constructor(public args: ClientSegmentDescriptionArgs) {
    this.handleDownPoint = this.handleDownPoint.bind(this)
    this.handleDownSize = this.handleDownSize.bind(this)
    this.handleMovePoint = this.handleMovePoint.bind(this)
    this.handleMoveSize = this.handleMoveSize.bind(this)
    this.handleUp = this.handleUp.bind(this)
  }
  
  private addPointerDownListenerPoint(item: SvgItem): void {
    const handler = this.handleDownPoint
    item.addEventListener('pointerdown', handler, { once: true })
  }

  get clip(): ClientClip { return this.args.clip }

  private _clipTimeRange?: TimeRange
  private get clipTimeRange() { return this._clipTimeRange ||= this.clip.timeRange }

  private get container(): ClientVisibleInstance { return this.clip.container! }

  private containerScalarsDefined(keys: Strings): boolean {
    const { container } = this
    return keys.some(key => isDefined(container.value(key)))
  }

  private get cropDirections(): SideDirectionRecord {
    const { pointFlipping: flipped } = ClientSegmentDescriptionClass.doing!
    const { container } = this
    const leftCrop = container.value(`${flipped ? $TOP : $LEFT}${$CROP}`)
    const rightCrop = container.value(`${flipped ? $BOTTOM : $RIGHT}${$CROP}`)
    const topCrop = container.value(`${flipped ? $LEFT : $TOP}${$CROP}`)
    const bottomCrop = container.value(`${flipped ? $RIGHT : $BOTTOM}${$CROP}`)
    return { 
      [$LEFT]: leftCrop, 
      [$RIGHT]: rightCrop, 
      [$TOP]: topCrop, 
      [$BOTTOM]: bottomCrop
    }
  }

  private flipped(pointOrSize: PointOrSize): boolean {
    const { previewRect } = this
    if (previewRect.height < previewRect.width) return false

    return this.container.value(`${pointOrSize}${$ASPECT}`) === $FLIP
  }

  private handleDownPoint(event: Event) {
    if (!(event instanceof PointerEvent)) errorThrow(ERROR.Internal)

    eventStop(event)
    const point = { x: event.clientX, y: event.clientY }
    const { previewRect, rect, handleMovePoint, handleUp } = this

    // localize point to container rect
    const previewPoint = translatePoint(point, previewRect, true) 
    const offsetPoint = translatePoint(previewPoint, rect, true)

    const pointFlipping = this.flipped($POINT)
    const pointKeys = this.keys(pointFlipping, ...POINT_KEYS)
    const pointTweening = this.containerScalarsDefined(pointKeys.slice(0, 2)) 
    const jumpFrame = this.jumpFrame(pointTweening)
    const moveHandler = isPositive(jumpFrame) ? this.jump(jumpFrame) : handleMovePoint
    const clickedNumbers = this.numberRecord(pointKeys)
    ClientSegmentDescriptionClass.pointing = {
      clickedNumbers, 
      offsetPoint, pointFlipping: pointFlipping, pointTweening, moveHandler
    }
    this.selectClip()
    globalThis.window.addEventListener('pointermove', moveHandler)
    globalThis.window.addEventListener('pointerup', handleUp, { once: true })
  }

  private handleDownSize(event: Event) {
    if (!(event instanceof PointerEvent)) errorThrow(ERROR.Internal)

    eventStop(event)
    const { target } = event
    assertDatasetElement(target)

    const { direction } = target.dataset
    assertDefined(direction)
    
    const clientRect = target.getBoundingClientRect()
    const offset = translatePoint(event, clientRect, true)

    const { rect: clickedRect, previewRect, handleMoveSize, handleUp } = this
    const pointFlipping = this.flipped($POINT)
    const pointKeys = this.keys(pointFlipping, ...POINT_KEYS)
    const pointTweening = this.containerScalarsDefined(pointKeys.slice(0, 2)) 
    const sizeFlipping = this.flipped($SIZE)
    const sizeKeys = this.keys(sizeFlipping, ...SIZE_KEYS)
    const sizeTweening = this.containerScalarsDefined(sizeKeys.slice(0, 2)) 
        
    // localize point to preview rect
    const point = roundPoint({ x: event.clientX, y: event.clientY }, $ROUND)
    const clickedPreviewPoint = translatePoint(point, previewRect, true) 

    const allKeys = [...pointKeys, ...sizeKeys]
    const clickedNumbers = this.numberRecord(allKeys)

    const jumpFrame = this.jumpFrame(pointTweening || sizeTweening)
    const moveHandler = isPositive(jumpFrame) ? this.jump(jumpFrame) : handleMoveSize

    // clicked point is center of handle
    const halfHandle = TrackPreviewHandleSize / 2
    const { x, y } = offset
    const offsetPoint = { x: halfHandle - x,  y: halfHandle - y }
    
    ClientSegmentDescriptionClass.sizing = {
      clickedPreviewPoint, clickedNumbers, clickedRect, direction, 
      moveHandler, offsetPoint, pointTweening, pointFlipping, 
      sizeFlipping, sizeTweening,
    }
    globalThis.window.addEventListener('pointermove', moveHandler)
    globalThis.window.addEventListener('pointerup', handleUp, { once: true })
  }

  private handleMovePoint(event: PointerEvent): void {
    eventStop(event)
    const point = { x: event.clientX, y: event.clientY }
    const eventPoint = roundPoint(this.pointEvent(point), $ROUND)
    const scalarsById = this.pointScalars(eventPoint)
    // console.log(this.constructor.name, 'handleMovePoint', scalarsById)
    MOVIEMASHER.dispatch(new EventChangeScalars(scalarsById))
  }

  private handleMoveSize(event: PointerEvent) {
    eventStop(event)

    const { previewRect, cropDirections: crops, container } = this
    const { left, right, top, bottom } = crops
    const point = roundPoint({ x: event.clientX, y: event.clientY }, $ROUND)

    // constrain to preview rect unless crop is enabled for that side
    if (!left) point.x = Math.max(point.x, previewRect.x)
    if (!right) point.x = Math.min(point.x, previewRect.x + previewRect.width)
    if (!top) point.y = Math.max(point.y, previewRect.y)
    if (!bottom) point.y = Math.min(point.y, previewRect.y + previewRect.height)

    const { sizing } = ClientSegmentDescriptionClass
    assertDefined(sizing)
    
    const { clickedRect, clickedPreviewPoint, direction, sizeTweening, sizeFlipping, clickedNumbers } = sizing
    const eventPoint = this.pointEvent(point) 
    const deltaPoint = translatePoint(eventPoint, clickedPreviewPoint, true)

    const sizeValues = {
      width: deltaPoint.x / previewRect.width,
      height: deltaPoint.y / previewRect.height,
    }
 
    const [horzId, vertId] = this.ids(sizeFlipping, sizeTweening, ...SIZE_KEYS)
    
    const sizingHorz = direction.includes($LEFT) || direction.includes($RIGHT)
    const sizingVert = direction.includes($TOP) || direction.includes($BOTTOM)
    const sizingLeft = direction.includes($LEFT)
    const sizingTop = direction.includes($TOP)
    const corner = direction.includes(DASH)
    if (sizingLeft) sizeValues.width *= -1
    if (sizingTop) sizeValues.height *= -1
    if (!corner) {
      sizeValues.width *= 2
      sizeValues.height *= 2
    }

    const horz = minMax(clickedNumbers[horzId] + (sizingHorz ? sizeValues.width : 0))
    const vert = minMax(clickedNumbers[vertId] + (sizingVert ? sizeValues.height : 0))

    if (sizingHorz) container.setValue(horzId, horz)
    if (sizingVert) container.setValue(vertId, vert)

    const { rectInitialize: newRect } = this
    const pointPoint = copyPoint(clickedRect)
  
    if (sizingTop) pointPoint.y = eventPoint.y
    if (sizingLeft) pointPoint.x = eventPoint.x
    
    if (!corner) {
      if (!sizingLeft) pointPoint.x -= Math.round((newRect.width - clickedRect.width) / 2)
      if (!sizingTop) pointPoint.y -= Math.round((newRect.height - clickedRect.height) / 2)
    }

    if (sizingTop) {
      pointPoint.y = Math.min(pointPoint.y, clickedRect.y + clickedRect.height)
    }
    if (sizingLeft) { 
      pointPoint.x = Math.min(pointPoint.x, clickedRect.x + clickedRect.width)
    }
    
    const scalarsById: ScalarsById = this.pointScalars(pointPoint, newRect, crops)
    if (sizingHorz) scalarsById[horzId] = horz
    if (sizingVert) scalarsById[vertId] = vert
  
    // console.log(this.constructor.name, 'handleMoveSize', scalarsById)
    MOVIEMASHER.dispatch(new EventChangeScalars(scalarsById))
  }

  private handleUp(event: Event) {
    eventStop(event)
    // console.log(this.constructor.name, 'handleUp')

    const { doing } = ClientSegmentDescriptionClass
    assertDefined(doing)

    const { moveHandler } = doing
    globalThis.window.removeEventListener('pointermove', moveHandler)
    globalThis.window.removeEventListener('pointerup', this.handleUp)
    delete ClientSegmentDescriptionClass.sizing
    delete ClientSegmentDescriptionClass.pointing
  }

  private ids(flipped: boolean, tweening: boolean, ...keys: Strings): PropertyIds {
    const [horzEndKey, vertEndKey, horzKey, vertKey] = this.keys(flipped, ...keys)
    const { time, clipTimeRange } = this    
    const tween = tweening && time.frame === clipTimeRange.lastTime.frame
    return [
      `${$CONTAINER}${DOT}${tween ? horzEndKey : horzKey}`,
      `${$CONTAINER}${DOT}${tween ? vertEndKey : vertKey}`,
    ] 
  }

  private jump(frame: number) {
    return (event: Event) => { 
      // console.log(this.constructor.name, 'jump', frame)
      this.handleUp(event)
      MOVIEMASHER.dispatch(new EventChangeFrame(frame)) 
    }
  }
  
  private jumpFrame(tweening: boolean): number | undefined {
    if (tweening) {
      const { time } = this
      const closest = time.closest(this.clipTimeRange)
      if (!time.equalsTime(closest)) return closest.frame
    }
    return undefined
  }

  private keys(flipped: boolean, ...keys: Strings): Strings {
    const [horzKey, vertKey] = flipped ? [...keys].reverse() : keys
    const horzEndKey = `${horzKey}${$END}`
    const vertEndKey = `${vertKey}${$END}`
    return [horzEndKey, vertEndKey, horzKey, vertKey]
  }

  private numberRecord(keys: Strings): NumberRecord {
    const { container } = this
    return  Object.fromEntries(keys.flatMap(key => {
      const value = container.value(key)
      if (!isNumber(value)) return []

      return [[[$CONTAINER, key].join(DOT), value]]
    }))
  }

  private pointEvent(point: Point): Point {
    const { doing } = ClientSegmentDescriptionClass
    const { offsetPoint } = doing! 
    const { previewRect } = this

    // localize point to preview rect
    const previewPoint = translatePoint(point, previewRect, true)
    
    // remove any offset from the down point
    return translatePoint(previewPoint, offsetPoint, true)
  }

  private pointScalars(eventPoint: Point, size?: Size, cropDirections?: SideDirectionRecord): ScalarsById {    
    const crops = cropDirections || this.cropDirections
    const rect = size || this.rect
    const { doing } = ClientSegmentDescriptionClass
    assertDefined(doing)

    doing.moved = true
    const { pointTweening, pointFlipping, clickedNumbers } = doing
    const [horzId, vertId] = this.ids(pointFlipping, pointTweening, ...POINT_KEYS)
    const { previewRect } = this
    const { left, right, top, bottom } = crops
    const { width: containerWidth, height: containerHeight } = rect

    // with no cropping, view is preview minus size of container
    const viewSize = sizeTranslate(previewRect, rect, true)

    // localize mouse point to preview rect and remove offset from down point
    
    const zeroPoint = { ...POINT_ZERO }
    if (top) { 
      zeroPoint.y -= containerHeight
      viewSize.height += containerHeight
    }
    if (left) {
      zeroPoint.x -= containerWidth
      viewSize.width += containerWidth
    }
    if (bottom) viewSize.height += containerHeight
    if (right) viewSize.width += containerWidth

    const offset = translatePoint(eventPoint, zeroPoint, true)

    const doingHorz = true
    const doingVert = true
    
    const scalarsById: ScalarsById = { 
      [horzId]: clickedNumbers[horzId], [vertId]: clickedNumbers[vertId], 
    }
    const { width, height } = viewSize

    if (doingHorz) scalarsById[horzId] = width ? minMax(offset.x / width) : 0
    if (doingVert) scalarsById[vertId] = height ? minMax(offset.y / height) : 0
    
    return scalarsById
  }

  private get preview() { return this.args.mashDescription }

  private _previewRect?: Rect
  private get previewRect() { 
    if (this._previewRect) return this._previewRect 
    
    const event = new EventRect()
    MOVIEMASHER.dispatch(event)
    const { rect } = event.detail
    assertRect(rect)
    return this._previewRect = rect
  }

  private _rect?: Rect
  private get rect() { return this._rect || this.rectInitialize }
  private get rectInitialize() {
    const { time, clipTimeRange: timeRange, clip, outputSize } = this
    assertSizeNotZero(outputSize, `${this.constructor.name}.rectInitialize size`)

    const containerRectArgs: ContainerRectArgs = { outputSize, time, timeRange }
    const [containerRect] = clip.clipRects(containerRectArgs)
    return containerRect
  }
  
  private selectClip(): void {
    MOVIEMASHER.dispatch(new EventChangeClipId(this.clip.id))
  }

  private get outputSize(): Size { return this.preview.size }

  private svgHandlePoint(dimensions: Size, direction: Direction): Point {
    const handle = TrackPreviewHandleSize
    const halfHandle = handle / 2

    const { width, height } = dimensions
    const point = { ...POINT_ZERO }
    const [first, second] = String(direction).split(DASH)
    const last = second || first
    switch(last) {
      case $LEFT:
        point.x = - halfHandle
        break
      case $RIGHT:
        point.x = width - halfHandle
        break
      default: point.x = Math.round(width / 2) - halfHandle
    }
    switch(first) {
      case $TOP:
        point.y = - halfHandle
        break
      case $BOTTOM: 
        point.y = height - halfHandle
        break
      default: point.y = Math.round(height / 2) - halfHandle
    }
    return point
  }

  svgVector(classes: string[], inactive?: boolean): SvgVector {
    const { container, rect } = this
    const svgVector = container.svgVector(rect)

    svgVector.setAttribute('vector-effect', 'non-scaling-stroke')
    svgAddClass(svgVector, classes)
    if (!inactive) this.addPointerDownListenerPoint(svgVector)
    return svgVector
  }

  svgItems(lineClasses: string[], handleClasses: string[], inactive?: boolean): SvgItems {
    const items: SvgItems = []
    const corner = TrackPreviewHandleSize
    const line = TrackPreviewLineSize 
    const halfLine = line / 2
    const { rect, container } = this
    const { directions } = container
    // console.log(this.constructor.name, 'svgItems', directions)
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

    const size = { width, height }
    directions.forEach(direction => {
      const point = this.svgHandlePoint(size, direction)
      const rect = { x: x + point.x, y: y + point.y, width: corner, height: corner }
      const element = svgPolygonElement(rect, [...handleClasses, direction.toLowerCase()])
      items.push(element)
      if (inactive) return 

      element.dataset.direction = direction
      element.addEventListener('pointerdown', this.handleDownSize, { once: true })
    })
    return items
  }

  private get time(): Time { return this.preview.time }

  static get doing(): Doing | undefined {
    return ClientSegmentDescriptionClass.sizing || ClientSegmentDescriptionClass.pointing
  }
  
  private static pointing?: Pointing

  private static sizing?: Sizing
}

/**
 * MashPreview of a single mash at a single frame
 */
export class ClientMashDescriptionClass extends MashDescriptionClass implements ClientMashDescription {
  constructor(protected override args: ClientMashDescriptionArgs) {
    super(args)
  }

  private editElements(items: SvgItems): SvgItems {
    if (!items.length) return items
    
    items.forEach(item => { svgAddClass(item, LAYER) })

    const copy = [...items]
    const { size, selectedClip } = this

    const { trackPreviews } = this
    const moved = ClientSegmentDescriptionClass.doing?.moved 
    
    const selectedPreview = selectedClip ? trackPreviews.find(preview => preview.clip === selectedClip) : undefined
    const hoverItems: SvgItems = trackPreviews.map(trackPreview => {
      const trackSelected = trackPreview === selectedPreview
      const classes = [OUTLINE]
      if (!(moved || trackSelected)) classes.push(ANIMATE)
      return trackPreview.svgVector(classes)
    })
    const hoversSvg = svgSvgElement(size, hoverItems)
    svgAddClass(hoversSvg, OUTLINES)

    copy.push(hoversSvg)
    if (!selectedPreview) return copy
    
    const lineClasses = [LINE]
    const handleClasses = [HANDLE]
    const activeSvg = svgSvgElement(size, selectedPreview.svgItems(lineClasses, handleClasses, true))
    svgAddClass(activeSvg, [BOUNDS, BACK])
    
    const passiveSvg = svgSvgElement(size, selectedPreview.svgItems(lineClasses, handleClasses))
    svgAddClass(passiveSvg, [BOUNDS, FORE])
    copy.push(activeSvg, passiveSvg)
    return copy
  }

  protected override get clip(): ClientClip | undefined {
    return super.clip as ClientClip | undefined
  }
  protected override get clips(): ClientClips {
    return super.clips as ClientClips
  }

  private _elementsData?: DataOrError<SvgItems>

  get elementsPromise(): Promise<SvgItems> { 
    const { _elementsData } = this
    if (_elementsData) {
      if (isDefiniteError(_elementsData)) return Promise.resolve([])
      else return Promise.resolve(_elementsData.data)
    }
  
    const sizePromise = this.intrinsicSizePromise  
    const promise = sizePromise.then(() => {
      const { clips, size, time, clip } = this
      let promise = Promise.resolve([] as SvgItems)
      const component = clip ? $TIMELINE : $PLAYER
      clips.forEach(clip => {
        promise = promise.then(elements => {
          return clip.elementPromise(size, time, component).then(orError => {
            if (isDefiniteError(orError)) return elements

            const element = simplifyRecord(orError.data, size)
            return [...elements, element] 
          })
        })
      })
      return promise 
    })
  
    return promise.then(items => {
      const { clip } = this
      const elements: SvgItems = []
      if (clip) elements.push(...items)
      else elements.push(...this.editElements(items)) 
      this._elementsData = { data: elements }
      return elements
    })
  }

  private get intrinsicSizePromise(): Promise<void> {
    const { clips, time, quantize } = this
    const args: InstanceCacheArgs = {
      quantize, visible: true, time, clipTime: timeRangeFromTime(time)
    }
    const promises = clips.map(clip => {
      args.clipTime = clip.timeRange
      return clip.clipCachePromise(args)
    })
    return Promise.all(promises).then(VOID_FUNCTION)
  }

  override get mash(): ClientMashAsset { return this.args.mash }

  get selectedClip(): ClientClip | undefined { return this.args.selectedClip }

  get svgItemsPromise(): Promise<SvgItems> { 
    return this.elementsPromise as Promise<SvgItems>
  }

  private _trackPreviews?: ClientSegmentDescriptions
  private get trackPreviews() { 
    return this._trackPreviews ||= this.clips.map(clip => 
      new ClientSegmentDescriptionClass({ clip, mashDescription: this })
    )
  }
}

export class NonePreview extends ClientMashDescriptionClass {
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
    MOVIEMASHER.dispatch(event)
    return track
  }

  override get assetObject(): ClientMashAssetObject {
    const { encodings, encoding } = this
    return { ...super.assetObject, encodings, encoding }
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
  
  dispatchChanged(edit: Edit): void {
    this.clearPreview()
    if (isChangePropertyEdit(edit)) {
      const { property, target } = edit
      switch(property) {
        case `${$CONTENT}${DOT}gain`: {
          if (isClientClip(target)) {
            this.composition.adjustClipGain(target, this.quantize)
          }    
          break
        }
      }
    }
    MOVIEMASHER.dispatch(new EventEdited(edit))
    // console.log(this.constructor.name, 'dispatchChanged', SAVE)
    MOVIEMASHER.dispatch(new EventChangedServerAction(SAVE))
    this.draw()
  }

  private dispatchChangedPreviews(time: Time): void {
    this.drawingTime = time
    this.clearPreview()
    MOVIEMASHER.dispatch(new EventChangedPreviews())
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
      const { frame } = timeFromSeconds(time.seconds, this.quantize)
      const event = new EventChangedFrame(frame)
      MOVIEMASHER.dispatch(event)
    }
  }

  private drawingTime?: Time

  drawnTime?: Time

  elementsPromise(outputSize?: number | Size, selectedClip?: ClientClip): Promise<SvgItems> {
    const { size: mashSize } = this         
    const size = outputSize ? containSize(mashSize, outputSize) : mashSize

    const options: ClientMashDescriptionOptions = { size }
    const preview = this.mashDescription(options, selectedClip)
    // console.log(this.constructor.name, 'elementsPromise', size, preview.constructor.name)
    return preview.elementsPromise 
  }

  private emitIfFramesChange(method: () => void): void {
    const origFrames = this.frames
    method()
    const { totalFrames } = this
    if (origFrames !== totalFrames) this.framesHaveChanged(totalFrames)
  }

  declare encoding: string
  
  encodings: Encodings = []

  private _frame = 0 // initial frame supplied to constructor

  get frame(): number { return this.time.scale(this.quantize, 'floor').frame }
  
  framesHaveChanged(frames?: number): void {
    const totalFrames = frames || this.totalFrames
    MOVIEMASHER.dispatch(new EventChangedFrames(totalFrames))
    if (this.frame > totalFrames) this.seekToTime(timeFromArgs(totalFrames, this.quantize))
  }

  private handleDrawInterval(): void {
    // console.log(this.constructor.name, 'handleDrawInterval', this._playing)
    // what time does the audioContext think it is?
    const { composition, endTime } = this
    const { seconds } = composition

    // are we beyond the end of mash?
    if (seconds >= endTime.seconds) {
      // should we loop back to beginning?
      if (this.loop) this.seekToTime(this.time.withFrame(0))
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
    const { buffer, encodings } = object
    if (isAboveZero(buffer)) this.buffer = buffer
    if (isArray(encodings)) this.encodings.push(...encodings)
    this._mashDescription = new NonePreview({ mash: this, time: timeFromArgs() })
    this.properties.push(this.propertyInstance({
      targetId: $MASH, name: 'encoding', type: $STRING, 
      defaultValue: '', order: -1
    }))
    super.initializeProperties(object)  

    MOVIEMASHER.listenersAdd(this.listeners)
  }

  get loading(): boolean { return !!this.loadingPromises.length}

  private loadingPromises: Promise<void>[] = []
  
  protected listeners: EventDispatcherListeners = {}
  
  private _mashDescription?: ClientMashDescription
  override mashDescription(options: ClientMashDescriptionOptions, selectedClip?: ClientClip): ClientMashDescription { 
    return this._mashDescription ||= this.mashDescriptionInitialize(options, selectedClip) 
  }

  private mashDescriptionInitialize(options: ClientMashDescriptionOptions, selectedClip?: ClientClip): ClientMashDescription {
    return new ClientMashDescriptionClass(this.mashDescriptionArgs(options, selectedClip))
  }

  private mashDescriptionArgs(options: ClientMashDescriptionOptions = {}, selectedClip?: ClientClip): ClientMashDescriptionArgs {
    const { drawingTime, time, quantize } = this
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
    MOVIEMASHER.dispatch(new EventChangedClientAction(PLAY))
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

  putPromise(): Promise<void> { 
    // make sure we've loaded fonts in order to calculate intrinsic rect
    const promises = this.clips.flatMap(clip => {
      const { container } = clip
      if (container && isTextInstance(container)) {
        if (!container.intrinsicsKnown({ size: true })) {
          
          const args: CacheOptions = { visible: true }
          return container.asset.assetCachePromise(args)
        }
      }
      return [] 
    })  
    return Promise.all(promises).then(VOID_FUNCTION)
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
    MOVIEMASHER.dispatch(event)
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
    const { canSave } = this.actions
    // console.log(this.constructor.name, 'saveNeeded', canSave)
    return canSave
  }

  override async savePromise(progress?: ServerProgress): Promise<StringDataOrError> { 
    const orError = await this.savingPromise(progress)
    if (!isDefiniteError(orError)) {
      this.actions.save()
      // console.log(this.constructor.name, 'ClientMashAssetClass savePromise calling', orError.data)
      this.saveId(orError.data)
    } else {
      console.error(this.constructor.name, 'savePromise', orError)
    }
    return orError

  }


  private seekTime?: Time

  seekToTime(time: Time): Promise<void> | undefined {
    const { quantize } = this

    const quantized = timeFromSeconds(time.seconds, quantize)


    if (!this.seekTime?.equalsTime(quantized)) {
      this.seekTime = time      
      const { frame } = quantized
      // console.log(this.constructor.name, 'seekToTime', time, quantized)
      const event = new EventChangedFrame(frame)
      MOVIEMASHER.dispatch(event)
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
      case 'gain': {
        if (this._composition) this.composition.setGain(Number(value), this.quantize) 
        break
      }
      case 'aspectHeight':
      case 'aspectWidth':
      case 'aspectShortest': {
        const { size } = this
        if (sizeNotZero(size)) {
          MOVIEMASHER.dispatch(new EventChangedSize(this.size))
        } 
        break
      }
    }
    return tuple
  }

  protected override shouldSelectProperty(property: Property, targetId: TargetId): Property | undefined {
    const { name } = property
    if (name === 'encoding') return 

    return super.shouldSelectProperty(property, targetId)
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
    console.debug(this.constructor.name, 'toJSON')
    const { encodings, encoding } = this
    return { ...super.toJSON(), encodings, encoding }
  }

  override trackInstance(args: TrackArgs): ClientTrack {
    return new ClientTrackClass(args)
  }
  
  declare tracks: ClientTracks

  override unload(): void {
    super.unload()

    this.paused = true
    MOVIEMASHER.listenersRemove(this.listeners)
    this.clearDrawInterval()
  }

  updateAssetId(oldId: string, newId: string): void {
    // console.log(this.constructor.name, 'updateAssetId', oldId, newId)
    this.clips.forEach(clip => clip.updateAssetId(oldId, newId))
  }
}
