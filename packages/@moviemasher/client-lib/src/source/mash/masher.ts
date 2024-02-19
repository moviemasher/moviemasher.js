
import type { AssetCacheArgs, AssetObject, RawType, ChangePropertiesEditObject, ClipObjects, EventDispatcherListeners, MashAssetObject, PropertyId, PropertyIds, ScalarsById, Size, Strings, SvgItems, TargetId, TargetIds, Time } from '@moviemasher/shared-lib/types.js'
import type { AddClipsEditObject, AddTrackEditObject, ClientAction, ClientAsset, ClientAssets, ClientClip, ClientClips, ClientMashAsset, ClipIconArgs, ClipLocation, Edits, Masher, MasherArgs, MasherOptions, MoveClipEditObject, RemoveClipEditObject, Selectable, SelectedProperty, Timeout } from '../../types.js'

import { $ASSET, $AUDIO, $CHANGES, $CLIP, $CONTAINER, $CONTENT, $END, $FLIP, $MASH, $ROUND, $VIDEO, DOT, MOVIEMASHER, TARGET_IDS, arrayRemove, idGenerate, idGenerateString, idTemporary, isDefiniteError } from '@moviemasher/shared-lib/runtime.js'
import { colorFromRgb, colorRgbDifference, colorToRgb } from '@moviemasher/shared-lib/utility/color.js'
import { isArray, isPositive, isDefined } from '@moviemasher/shared-lib/utility/guard.js'
import { assertDefined, assertPositive, isEndpoint, isMashAsset, isPropertyId } from '@moviemasher/shared-lib/utility/guards.js'
import { assertSizeNotZero, containSize, evenSize, sizeNotZero } from '@moviemasher/shared-lib/utility/rect.js'
import { svgDefsElement, svgPatternElement, svgPolygonElement, svgSet, svgSvgElement, svgUrl } from '@moviemasher/shared-lib/utility/svg.js'
import { timeFromArgs, timeFromSeconds } from '@moviemasher/shared-lib/utility/time.js'
import { isClientAudibleInstance, isClientVisibleInstance } from '../../guards/ClientGuards.js'
import { assertClientClip, assertClientMashAsset, isClientMashAsset } from '../../guards/ClientMashGuards.js'
import { isTargetId } from '../../guards/TypeGuards.js'
import { ADD, ADD_TRACK, INDEX_CURRENT, INDEX_LAST, INDEX_NEXT, MOVE_CLIP, PLAY, REDO, REMOVE, REMOVE_CLIP, UNDO, VIEW, isClientAsset } from '../../runtime.js'
import { EventAddAssets, EventAssetId, EventChangeAssetId, EventChangeClipId, EventChangeDragging, EventChangeFrame, EventChangeScalar, EventChangeScalars, EventChangedAssetId, EventChangedClientAction, EventChangedClipId, EventChangedFrames, EventChangedMashAsset, EventChangedPreviews, EventChangedSize, EventChangedTargetIds, EventClip, EventClipId, EventDataType, EventDoClientAction, EventDragging, EventEnabledClientAction, EventManagedAsset, EventManagedAssetPromise, EventMashAsset, EventMashTime, EventMoveClip, EventPreviews, EventPropertyIds, EventRemoveClip, EventScalar, EventSelectable, EventSelectedProperties, EventTargetIds, EventTimeRange, EventTrackClipIcon, EventTrackClips, EventWillDestroy } from '../../utility/events.js'
import { endpointUrl } from '../../utility/request.js'

const Defaults: MasherArgs = { buffer: 10, fps: 30, loop: true }

type TargetIdPropertyNamesRecord = {
  [index in TargetId]?: Strings
}

export class MasherClass implements Masher {
  constructor(args: MasherArgs) {
    const { buffer, fps, loop, mash } = args
    if (isDefined(fps)) this._fps = fps
    if (isDefined(buffer)) this._buffer = buffer
    if (isDefined(loop)) this._loop = loop
    this.listeners = {
      [EventAddAssets.Type]: this.handleAddAssets.bind(this),
      [EventAssetId.Type]: this.handleAssetId.bind(this),
      [EventChangeAssetId.Type]: this.handleChangeAssetId.bind(this),
      [EventChangeClipId.Type]: this.handleSelectClipId.bind(this),
      [EventChangeDragging.Type]: this.handleChangeDragging.bind(this),
      [EventChangeFrame.Type]: this.handleChangeFrame.bind(this),
      [EventChangeScalar.Type]: this.handleChangeScalar.bind(this),
      [EventChangeScalars.Type]: this.handleChangeScalars.bind(this),
      [EventClip.Type]: this.handleClip.bind(this),
      [EventClipId.Type]: this.handleClipId.bind(this),
      [EventDataType.Type]: this.handleDataType.bind(this),
      [EventDoClientAction.Type]: this.handleAction.bind(this),
      [EventDragging.Type]: this.handleDragging.bind(this),
      [EventEnabledClientAction.Type]: this.handleActionEnabled.bind(this),
      [EventMashAsset.Type]: this.handleMashAsset.bind(this),
      [EventMashTime.Type]: this.handleFrame.bind(this),
      [EventMoveClip.Type]: this.handleMoveClip.bind(this),
      [EventPreviews.Type]: this.handlePreviews.bind(this),
      [EventPropertyIds.Type]: this.handlePropertyIds.bind(this),
      [EventRemoveClip.Type]: this.handleRemoveClip.bind(this),
      [EventScalar.Type]: this.handleValue.bind(this),
      [EventSelectable.Type]: this.handleSelectable.bind(this),
      [EventSelectedProperties.Type]: this.handleSelectedProperties.bind(this),
      [EventTargetIds.Type]: this.handleTargetIds.bind(this),
      [EventTimeRange.Type]: this.handleTimeRange.bind(this),
      [EventTrackClipIcon.Type]: this.handleTrackClipIcon.bind(this),
      [EventTrackClips.Type]: this.handleTrackClips.bind(this),
      [EventWillDestroy.Type]: this.handleWillDestroy.bind(this),
    }
    MOVIEMASHER.listenersAdd(this.listeners)
    if (mash) this.load(mash)
  }
  
  private actionIsHandled(action: ClientAction): boolean { 
    switch(action) {
      case ADD: 
      case ADD_TRACK: 
      case VIEW:
      case $FLIP: 
      case REDO: 
      case REMOVE: 
      case PLAY: 
      case UNDO: return true
    }
    return false
  }

  private get actions(): Edits {
    const { mashAsset } = this
    assertClientMashAsset(mashAsset)
    
    return mashAsset.actions
  }

  private add() {
    const { time } = this
    const { asset, mashAsset } = this
    if (!(asset && mashAsset)) return 

    const { selection } = this
    const mashIndex: ClipLocation = { track: 0 }
    if (selection) {
      const { track } = selection
      mashIndex.track = track.index
      if (track.dense) mashIndex.index = track.clips.indexOf(selection)
      else mashIndex.frame = selection.endFrame
    } else if (time) mashIndex.frame = time.scale(mashAsset.quantize).frame
    
    this.addAssets(asset, mashIndex)
  }

  private addAssets(asset: ClientAsset | ClientAssets, mashIndex?: ClipLocation): Promise<ClientAssets> {
    console.log(this.constructor.name, 'addAssets', mashIndex)
    const installedAssets = isArray(asset) ? asset : [asset]
    if (!installedAssets.length) return Promise.resolve([])

    if (!mashIndex) return Promise.resolve(installedAssets)
    
    const { mashAsset } = this
    assertClientMashAsset(mashAsset)

    const clips = installedAssets.map(asset => (
       mashAsset.clipInstance(asset.clipObject()) 
    ))

    const { frame, index = -1, track = 0 } = mashIndex

    const [firstClip] = clips

    return this.assureMash(installedAssets).then(() => {
      const { mashAsset } = this
      assertDefined(mashAsset)
    
      const { tracks } = mashAsset
      const { length } = tracks
     
      let trackIndex = track
      if (trackIndex < 0) trackIndex = length
      else if (trackIndex >= length) trackIndex = length - 1

      const trackPositive = isPositive(trackIndex)
      const existingTrack = trackPositive ? tracks[track] : undefined
      const trackClips = existingTrack?.clips || []
 
      const dense = existingTrack?.dense 
      
      const createTracks = trackIndex < length ? 0 : clips.length
      const options: AddClipsEditObject = {
        clips, type: ADD, trackIndex, createTracks, mashAsset
      }
      const definedIndex = dense ? index : frame 
      assertDefined(definedIndex, 'definedIndex')
      
      const clipIndex = this.clipIndex(definedIndex, trackClips, dense)
      if (dense) options.insertIndex = clipIndex
      else {
        if (createTracks) options.redoFrame = clipIndex
        else {
          assertDefined(existingTrack)

          existingTrack.assureFrames(mashAsset.quantize, clips)
          options.redoFrame = existingTrack.frameForClipNearFrame(firstClip, clipIndex)
        }
      }
      this.actions.create(options)
      return this.loadMashAndDraw()  
    }).then(() => installedAssets) 
  }

  private addTrack(): void {
    const { mashAsset } = this
    if (!mashAsset) return

    const object: AddTrackEditObject = { 
      mashAsset, type: ADD_TRACK, createTracks: 1,
    }
    this.actions.create(object)
  }

  private _asset?: ClientAsset
  private get asset(): ClientAsset | undefined {
    const {_asset, assetId} = this
    if (_asset) return _asset

    if (!assetId) {
      // console.warn(this.constructor.name, 'assetId not set')
      return 
    }
    const event = new EventManagedAsset(assetId)
    MOVIEMASHER.dispatch(event)
    const { asset } = event.detail
    return this._asset = asset
  }

  private _assetId?: string
  private get assetId(): string | undefined {
    return this._assetId
  }
  private set assetId(id: string | undefined) {
    if (id === this._assetId) return

    delete this._asset
    this._assetId = id
    MOVIEMASHER.dispatch(new EventChangedAssetId(id))
    MOVIEMASHER.dispatch(new EventChangedTargetIds(this.selectedTargetIds))
  }

  private assureMash(assets: ClientAssets) {
    const { mashAsset: mashMedia, mashingType: type } = this
    // console.log(this.constructor.name, 'assureMash', !!mashMedia)
    if (isMashAsset(mashMedia)) return Promise.resolve()
    
    // console.log(this.constructor.name, 'assureMash NOT $MASH $ASSET!', mashMedia)
    const [firstMedia] = assets
    const { label } = firstMedia
    const mash: MashAssetObject = { 
      label, assets: [], id: idTemporary(), type, source: $MASH
    }
    return this.load(mash)
  }

  private _buffer = Defaults.buffer
  private get buffer(): number { return this._buffer }
  private set buffer(value: number) {
    const number = Number(value)
    if (this._buffer !== number) {
      this._buffer = number
      const { mashAsset: mashMedia } = this
      if (mashMedia) mashMedia.buffer = number
    }
  }

  private can(clientAction: ClientAction): boolean {
    const { selection: clip, mashAsset: mash, assetId, actions } = this    
    switch (clientAction) {
      case PLAY: return !!mash?.paused
      case $FLIP:
      case ADD_TRACK: return !!mash
      case VIEW: return !!mash?.encoding
      case ADD: return !!(assetId && mash)
      case UNDO: return actions.canUndo
      case REDO: return actions.canRedo
      case REMOVE: return !!clip
    }
    return false
  }

  private clipFromId(clipId: string): ClientClip | undefined {
    if (!clipId) return

    const { mashAsset } = this
    if (!mashAsset) return

    const { tracks } = mashAsset
    for (const track of tracks) {
      const { clips } = track
      const clip = clips.find(clip => clip.id === clipId)
      if (clip) {
        // console.log(this.constructor.name, 'clipFromId', clipId, clip.containerId)
        return clip
      }
    }
    return 
  }

  private clipIndex(frameOrIndex: number, clips: ClientClips, dense?: boolean): number {
    if (isPositive(frameOrIndex)) return frameOrIndex
    
    const { mashAsset} = this
    assertDefined(mashAsset)

    switch (frameOrIndex) {
      case INDEX_LAST: {
        if (dense) return clips.length
        
        const lastClip = clips[clips.length - 1]
        if (!lastClip) return 0

        const { frame, frames } = lastClip
        return frame + frames
      }
      case INDEX_NEXT:
      case INDEX_CURRENT: {
        const { frame } = this.time.scale(mashAsset.quantize)
        if (!dense) return frame

        const onIndex = clips.findIndex(clip => 
          clip.frame <= frame && clip.frame + clip.frames > frame
        )
        if (!isPositive(onIndex)) return clips.length

        const index = frameOrIndex === INDEX_NEXT ? onIndex + 1 : onIndex
        const clip = clips[index]
        if (!clip) return clips.length

        return clip.frame
      }
      default: return 0
    }
  }

  private dragging = false

  private drawTimeout?: Timeout

  private _mashingType?: RawType
  private get mashingType(): RawType {
    return this._mashingType ||= $VIDEO
  }

  private encodingView() {
    const { mashAsset } = this
    if (!mashAsset) return

    const { encoding } = mashAsset
    if (!encoding) return

    const object = mashAsset.encodings.find(object => object.id === encoding)
    if (!object) return

    const { request } = object    
    const { endpoint } = request
    const url = isEndpoint(endpoint) ? endpointUrl(endpoint) : endpoint
    if (!url) return

    globalThis.window.open(url, '_blank')
  }

  private get endTime(): Time {
    const { mashAsset: mash } = this
    return mash ? mash.endTime.scale(this.fps, 'floor') : timeFromArgs()
  }

  private flip(): void {
    const { mashAsset, actions } = this
    if (!mashAsset) return

    const aspectWidth = mashAsset.value('aspectWidth') || 0
    const aspectHeight = mashAsset.value('aspectHeight') || 0
    const size = { width: aspectWidth, height: aspectHeight }
    const widthId = `${$MASH}${DOT}aspectWidth`
    const heightId = `${$MASH}${DOT}aspectHeight`
    const { width, height } = size
    const redoValues: ScalarsById = { [widthId]: height, [heightId]: width }
    const undoValues: ScalarsById = { [widthId]: width, [heightId]: height }
    const actionObject: ChangePropertiesEditObject = {
      type: $CHANGES, target: mashAsset, redoValues, undoValues
    }
    actions.create(actionObject)
  }

  private _fps = Defaults.fps
  private get fps(): number {
    return this._fps || this.mashAsset?.quantize || Defaults.fps
  }
  private set fps(value: number) {
    const number = Number(value)
    // setting to zero means fallback to mash rate
    if (this._fps !== number) {
      this._fps = number
      this.time = this.time.scale(this.fps)
    }
  }

  private goToTime(value: Time): Promise<void> {
    const { fps, time } = this
    const goTime = timeFromSeconds(value.seconds, fps) 
    const { frame: currentFrame } = time
    const { frame: attemptFrame } = goTime
    const { frame: endFrame } = this.endTime
    const lastFrame = endFrame - 1
    const goFrame = lastFrame < 1 ? 0 : Math.min(attemptFrame, lastFrame)
    
    if (value && currentFrame === goFrame) return Promise.resolve()

    const promise = this.mashAsset?.seekToTime(timeFromArgs(goFrame, fps))
    if (promise) return promise

    return Promise.resolve()
  }

  private dispatchDrawLater(): void {
    if (this.drawTimeout || !this.mashAsset) return

    this.drawTimeout = setTimeout(() => {
      MOVIEMASHER.dispatch(new EventChangedPreviews())
      delete this.drawTimeout
    }, 10)
  }

  private handleAddAssets(event: EventAddAssets) {
    event.stopImmediatePropagation()
    const { detail } = event
    const { mashIndex, assets } = detail
    // console.log(this.constructor.name, 'handleAddAssets...')
    this.addAssets(assets, mashIndex)
    // console.log(this.constructor.name, 'handleAddAssets!')
  }

  private handleChangeDragging(event: EventChangeDragging) {
    this.dragging = event.detail
    this.redraw()
    event.stopImmediatePropagation()
  }

  private handleChangeFrame(event: EventChangeFrame) {
    const { detail: frame } = event
    const { mashAsset } = this
    const { quantize } = mashAsset!

    const time = timeFromArgs(frame, quantize)
    // console.log(this.constructor.name, 'handleChangeFrame', time)
    this.goToTime(time) 
  }

  private handleClipId(event: EventClipId) {
    event.detail.clipId = this.selection ? this.selection.id : ''
    event.stopImmediatePropagation()
  }

  private handleDataType(event: EventDataType) {
    const { propertyId } = event.detail
    const target = this.selectable(propertyId)
    if (!target) {
      // console.warn(this.constructor.name, 'handleDataType', 'undefined target', propertyId)
      return
    }
    const propertyName = propertyId.split(DOT).pop()
    assertDefined(propertyName)
    
    const property = target.propertyFind(propertyName)
    if (!property) {
      // console.warn(this.constructor.name, 'handleDataType', 'no property', propertyId)
      return
    }

    event.stopImmediatePropagation()
    event.detail.dataType = property.type
  }

  private handleDragging(event: EventDragging) {
    event.detail.dragging = this.dragging
    event.stopImmediatePropagation()
  }

  private handleFrame(event: EventMashTime) {
    event.stopImmediatePropagation()
    const { mashAsset } = this
    const { detail } = event

    const frame = mashAsset?.frame || 0
    const quantize = mashAsset?.quantize || this.fps
    detail.time = timeFromArgs(frame, quantize)
  }

  private handleMashAsset(event: EventMashAsset) {
    event.stopImmediatePropagation()
    event.detail.mashAsset = this.mashAsset
  }

  private handlePropertyIds(event: EventPropertyIds) {
    const { targetIds, propertyIds } = event.detail
    propertyIds.push(...this.selectedPropertyIds(targetIds))
    // console.debug(this.constructor.name, 'handlePropertyIds', targetIds, propertyIds)
    event.stopImmediatePropagation()
  }

  private handleValue(event: EventScalar) {
    const { propertyId } = event.detail
    const [targetId, propertyName] = propertyId.split(DOT)
    if (!isTargetId(targetId)) return

    const target = this.selectable(targetId)
    if (!target) {
      // console.log(this.constructor.name, 'handleValue', 'no target', propertyId)
      return
    }
    event.stopImmediatePropagation()
    event.detail.value = target.value(propertyName)
  }

  private clipSize = (mashSize: Size, resizeWidth: number, height: number): Size => {    
    const ratio = mashSize.width / mashSize.height
    const frameWidth = height * ratio
    const width = Math.max(frameWidth, resizeWidth)
    return { width, height}
  }

  private handleTrackClipIcon(event: EventTrackClipIcon) {
    const { detail } = event
    const { clipId, gap = 0, scale, clipSize } = detail
    const { height: clipHeight } = clipSize
    const clip = this.clipFromId(clipId)
    if (!clip) return

    const { content } = clip
    const audible = isClientAudibleInstance(content)
    const visible = isClientVisibleInstance(content)

    // TODO: support different a/v ratios
    const ratio = 3
    let audibleHeight = audible ? 1 : 0
    audibleHeight &&= visible ? Math.round(clipHeight / ratio): clipHeight
    const visibleHeight = visible ? clipHeight - audibleHeight : 0

    const args: ClipIconArgs = {
      audible, 
      gap,
      scale,
      clipSize,
      visible,
      audibleHeight,
      visibleHeight,
    }    
    if (visible) {
      const { size: mashSize } = this.mashAsset!
      assertSizeNotZero(mashSize, 'size')

      const atLeastAFrameSize = this.clipSize(mashSize, clipSize.width, visibleHeight)
      const frameSize = evenSize(containSize(mashSize, atLeastAFrameSize), $ROUND)
      const { width, height } = frameSize
      args.width = width
      const { color: mashColor } = this.mashAsset!
      const reversedColor = colorFromRgb(colorRgbDifference(colorToRgb(mashColor)))
      const framePolygon = svgPolygonElement(frameSize, '', mashColor)
      const spaceRect = { x: width, y: 0, width: gap, height }
      const spacePolygon = svgPolygonElement(spaceRect, '', reversedColor)
      const patternSize = { width: width + gap, height: clipHeight }
      const patternId = idGenerate('pattern')
      const patternItems = [framePolygon, spacePolygon]
      const pattern = svgPatternElement(patternSize, patternId, patternItems)
      svgSet(pattern, 'userSpaceOnUse', 'patternUnits')

      const defsElement = svgDefsElement([pattern])
      const patternedPolygon = svgPolygonElement(atLeastAFrameSize, '', svgUrl(patternId))
      detail.background = svgSvgElement(atLeastAFrameSize, [defsElement, patternedPolygon])
    } else {
      detail.background = svgPolygonElement(clipSize)
    }
    detail.promise = clip.svgItemPromise(args)
    event.stopImmediatePropagation()
  }

  private handleMoveClip(event: EventMoveClip) {
    const { clipLocation, clipId } = event.detail
    const clip = clipId ? this.clipFromId(clipId) : this.selection
    if (!clip) return
    
    this.move(clip, clipLocation)
    event.stopImmediatePropagation()
  }

  private handleAction(event: EventDoClientAction) { 
    const { detail: action } = event
    // console.debug(this.constructor.name, 'handleAction', action)
    if (!this.actionIsHandled(action)) return

    event.stopImmediatePropagation()
    switch(action) {
      case ADD: return this.add()
      case ADD_TRACK: return this.addTrack()
      case VIEW: return this.encodingView()
      case $FLIP: return this.flip()
      case REDO: return this.redo()
      case REMOVE: return this.removeClip()
      case PLAY: return this.togglePaused()
      case UNDO: return this.undo()
      default: return
    }
  }
  private handleAssetId(event: EventAssetId) {
    event.stopImmediatePropagation()
    event.detail.assetId = this.assetId
  }

  private handleChangeAssetId(event: EventChangeAssetId) {
    event.stopImmediatePropagation()
    this.assetId = event.detail
    MOVIEMASHER.dispatch(new EventChangedClientAction(ADD))

  }

  private handleActionEnabled(event: EventEnabledClientAction) { 
    const { detail } = event
    const { clientAction } = detail
    if (this.actionIsHandled(clientAction) && this.can(clientAction)) {
      // console.debug(this.constructor.name, 'handleActionEnabled TRUE', clientAction)
      detail.enabled = true
      event.stopImmediatePropagation()
    }
  }
  
  private handleChangeScalar(event: EventChangeScalar) {
    const { detail } = event
    const { propertyId, value } = detail
    const target = this.selectable(propertyId)
    if (!target) {
      // console.error(this.constructor.name, 'handleChangeScalar', 'no target', propertyId)
      return 
    }
    
    const actionObject = target.changeScalar(propertyId, value)
    this.actions.create(actionObject)
    event.stopImmediatePropagation()
  }

  private handleChangeScalars(event: EventChangeScalars) {
    const { detail: scalars  } = event
    const [propertyId] = Object.keys(scalars)
    if (!isPropertyId(propertyId)) {
      // console.error(this.constructor.name, 'handleChangeScalars', 'invalid propertyId', propertyId)
      return
    }
    const target = this.selectable(propertyId)
    if (!target) {
      // console.error(this.constructor.name, 'handleChangeScalars', 'no target', propertyId)
      return 
    }
    const actionObject = target.changeScalars(scalars)
    this.actions.create(actionObject)
    event.stopImmediatePropagation()
  }

  private handleClip(event: EventClip) {
    event.stopImmediatePropagation()
    const { detail } = event
    const { clipId } = detail
    detail.clip = this.clipFromId(clipId)
  }

  private handlePreviews(event: EventPreviews) {
    const { detail } = event
    const { size: maxDimension } = detail
    detail.promise = this.elementsPromise(maxDimension)
    event.stopImmediatePropagation()
  }

  private handleRemoveClip(event: EventRemoveClip) {
    const { clipId } = event.detail
    const clip = this.clipFromId(clipId)
    if (clip) {
      this.removeClip(clip)
      event.stopImmediatePropagation()
    }
  }

  private handleSelectClipId(event: EventChangeClipId) {
    const { detail: clipId } = event
    this.selection = this.clipFromId(clipId) || false
    this.redraw()
  }

  private handleSelectedProperties(event: EventSelectedProperties) {
    event.stopImmediatePropagation()
    const { selectedProperties, selectorTypes = TARGET_IDS} = event.detail
    const propertyNamesByTarget: TargetIdPropertyNamesRecord = {}
    selectorTypes.forEach(selector => {
      const [target, property] = selector.split(DOT)
      if (!isTargetId(target)) return

      propertyNamesByTarget[target] ||= []
      if (isTargetId(selector)) return

      const types = propertyNamesByTarget[target]
      assertDefined(types)
  
      types.push(property)
    })
    Object.entries(propertyNamesByTarget).forEach(([targetId, propertyNames]) => {
      if (!isTargetId(targetId)) return

      const selectable = this.selectable(targetId)
      if (!selectable) return

      selectedProperties.push(...propertyNames.flatMap(propertyName => {
        const propertyId: PropertyId = `${targetId}.${propertyName}`
        const property = selectable.propertyFind(propertyName)
        if (property) {
          const selectedProperty: SelectedProperty = {
            propertyId, property, value: selectable.value(propertyName)
          }
          return [selectedProperty]
        } else {
          // console.warn(this.constructor.name, 'handleSelectedProperties', 'property not found', propertyId)
        }
        return []
      }))
    })

    // if any selected properties are tweens, set their frame appropriately
    const { selection } = this
    if (!selection) return // only container and content instances have tweens

    const tweens = selectedProperties.filter(selectedProperty => {
      return selectedProperty.property.tweens
    })
    if (!tweens.length) return 
    
    const { frame, last } = selection.timeRange
    tweens.forEach(tween => {
      tween.frame = tween.property.name.endsWith($END) ? last : frame
    })
  }

  private handleSelectable(event: EventSelectable) {
    event.stopImmediatePropagation()
    const { detail } = event
    detail.selectable = this.selectable(detail.targetId)
  }

  private handleTimeRange(event: EventTimeRange) {
    event.stopImmediatePropagation()
    const { selection } = this
    if (!selection) return // only container and content instances have tweens

    event.detail.timeRange = selection.timeRange
  }

  private handleTargetIds(event: EventTargetIds) {
    event.stopImmediatePropagation()
    event.detail.push(...this.selectedTargetIds)
  }

  private handleTrackClips(event: EventTrackClips) {
    const { detail } = event
    const { trackIndex } = detail
    const { mashAsset } = this
    if (!mashAsset) return

    const track = mashAsset.tracks[trackIndex]
    if (!track) return

    detail.clips = track.clips
    detail.dense = track.dense
    event.stopImmediatePropagation()
  }

  private handleWillDestroy(event: EventWillDestroy) {
    const { _mashAsset: mash } = this
    if (!mash) return

    const { detail: ids } = event
    const { assetIds } = mash
    // console.log(this.constructor.name, 'handleWillDestroy', ids.join(', '), 'removing', assetIds.join(', '))
    arrayRemove(ids, assetIds)
  }
  
  load = async (data: AssetObject): Promise<void> => {
    data.id ||= idGenerateString()
    const mashMediaObject = await this.mashAssetObject(data)
    const { buffer, loop } = this
    const assetObject: MashAssetObject = {
      ...mashMediaObject, buffer, loop, 
    }
    const event = new EventManagedAssetPromise(assetObject)
    MOVIEMASHER.dispatch(event)
    const { promise } = event.detail
    if (!promise) return
  
    const orError = await promise
    if (isDefiniteError(orError)) return
    
    const { data: asset } = orError
    if (!isClientMashAsset(asset)) return

    this.mashAsset = asset
    this.selection = false
    this.dispatchDrawLater() 

    const { type } = mashMediaObject
    const { size } = asset
    const { fps } = this
    if (!(sizeNotZero(size) || type === $AUDIO)) return 
    
    await this.goToTime(timeFromArgs(0, fps))
    asset.clearPreview()
  }

  private loadMashAndDraw(): Promise<void> {
    const { mashAsset: mashMedia } = this
    assertDefined(mashMedia)
    const { timeToBuffer } = mashMedia
    const args: AssetCacheArgs = { 
      time: timeToBuffer, assetTime: timeToBuffer,
      visible: true, audible: false, 
    }

    if (!this.paused) args.audible = true
    return mashMedia.assetCachePromise(args).then(() => { mashMedia.draw() })
  }

  private listeners: EventDispatcherListeners = {}

  private _loop = Defaults.loop
  private get loop(): boolean { return this._loop }
  private set loop(value: boolean) {
    // console.log(this.constructor.name, 'loop', value)
    const boolean = !!value
    this._loop = boolean
    const { mashAsset: mash } = this
    if (mash) mash.loop = boolean
  }

  private _mashAsset: ClientMashAsset | undefined 
  private get mashAsset(): ClientMashAsset | undefined { return this._mashAsset }
  private set mashAsset(asset: ClientMashAsset | undefined) {
    const { _mashAsset } = this
    if (_mashAsset === asset) return
   
    if (_mashAsset) {
      this.paused = true
      this.selection = false
    }
    this._mashAsset = asset
    if (asset) {
      MOVIEMASHER.dispatch(new EventChangedSize(asset.size))
      MOVIEMASHER.dispatch(new EventChangedFrames(asset.totalFrames))
    }
    MOVIEMASHER.dispatch(new EventChangedMashAsset(asset))
    MOVIEMASHER.dispatch(new EventChangedClientAction(ADD))
    MOVIEMASHER.dispatch(new EventChangedClientAction(ADD_TRACK))
    MOVIEMASHER.dispatch(new EventChangedClientAction($FLIP))
    MOVIEMASHER.dispatch(new EventChangedClientAction(PLAY))
    MOVIEMASHER.dispatch(new EventChangedClientAction(VIEW))
  }

  private mashAssetObject = async (assetObject: AssetObject): Promise<MashAssetObject> => {
    const { source, label, type } = assetObject
    // simply return object promise if it is already a mash
    if (source === $MASH) return assetObject

    // otherwise, load asset so we can create a clip with it
    const clips: ClipObjects = []
    const mash: MashAssetObject = {
      id: idGenerateString(), type, label,
      assets: [assetObject],
      source: $MASH,
      tracks: [{ clips}],
    }    
    const event = new EventManagedAssetPromise(assetObject)
    MOVIEMASHER.dispatch(event)
    const { promise } = event.detail
    if (promise) {
      const orError = await promise
      if (!isDefiniteError(orError)) {
        const { data: asset } = orError
        if (isClientAsset(asset)) {
          mash.type = asset.type
          clips.push(asset.clipObject())
        }
      }
    }
    return mash
  }

  private move(clip: ClientClip, editorIndex: ClipLocation = {}): void {
    const { frame, index = 0, track: trackIndex = 0} = editorIndex
    const { mashAsset } = this
    assertDefined(mashAsset)

    const { tracks } = mashAsset

    const { trackNumber: undoTrackIndex } = clip
    assertPositive(undoTrackIndex)

    const options: MoveClipEditObject = {
      createTracks: 0, clip, mashAsset, 
      trackIndex, undoTrackIndex, type: MOVE_CLIP
    }
    const creating = !isPositive(trackIndex)
    const redoTrack = creating ? undefined : tracks[trackIndex]
    if (creating) options.createTracks = 1

    const undoTrack = tracks[undoTrackIndex]
    const undoDense = undoTrack.dense 
    const redoDense = redoTrack?.dense
    const currentIndex = redoTrack ? redoTrack.clips.indexOf(clip) : INDEX_LAST

    if (redoDense) {
      options.insertIndex = isPositive(index) ? index : redoTrack.clips.length
    } else {
      // console.log(this.constructor.name, 'move', 'redo not dense', frame, index, !!redoTrack)
      options.redoFrame = redoTrack ? redoTrack.frameForClipNearFrame(clip, frame) : 0
    }

    if (undoDense) {
      options.undoInsertIndex = currentIndex
      if (redoDense === undoDense && index < currentIndex) {
        options.undoInsertIndex += 1
      }
    } else {
      const { frame } = clip
      options.undoFrame = frame
    }
    this.actions.create(options)
  }

  private get paused(): boolean {
    const { mashAsset: mash } = this
    return mash ? mash.paused : true
  }

  private set paused(value: boolean) {
    const { mashAsset: mash } = this
    if (mash) {
      const mashUpdating = mash.paused !== value
      if (mashUpdating) mash.paused = value

      // bring back selection
      if (value) this.redraw()
      if (!mashUpdating) MOVIEMASHER.dispatch(new EventChangedClientAction(PLAY))
    }
  }

  private elementsPromise(outputSize?: number | Size): Promise<SvgItems> {
    const { mashAsset } = this
    if (!mashAsset || mashAsset.type === $AUDIO) return Promise.resolve([])

    return mashAsset.elementsPromise(outputSize, this.selection || undefined)
  }

  private selectedPropertyIds(targetIds: TargetIds): PropertyIds {
    const ids = targetIds.length ? targetIds : TARGET_IDS
    const propertyIds: PropertyIds = []
    ids.forEach(id => {
      const target = this.selectable(id)
      if (target) {
        propertyIds.push(...target.propertyIds(ids))
      } else {
        // console.warn(this.constructor.name, 'selectedPropertyIds missing target', id)
      }
    })
    return propertyIds
  }

  private redo(): void { 
    if (this.actions.canRedo) this.actions.redo()
  }

  private redraw(): void {
    const { mashAsset } = this
    if (!mashAsset) return

    mashAsset.clearPreview()
    MOVIEMASHER.dispatch(new EventChangedPreviews())
  }

  private removeClip(clientClip?: ClientClip): void {
    const clip = clientClip || this.selection
    const { mashAsset, actions } = this
    assertDefined(mashAsset)
    assertClientClip(clip)

    const { track } = clip
    const options: RemoveClipEditObject = {
      clip,
      track,
      index: track.clips.indexOf(clip),
      type: REMOVE_CLIP,
    }
    actions.create(options)
  }

  private _selection: ClientClip | false = false
  private get selection(): ClientClip | false { return this._selection }
  private set selection(value: ClientClip | false) {
    if (this._selection === value) {
      // console.warn(this.constructor.name, 'selection', 'same value', value ? value.id : '')
      return
    }
    this._selection = value

    // console.debug(this.constructor.name, 'selection', 'dispatching', value ? value.id : '')

    MOVIEMASHER.dispatch(new EventChangedClipId(value ? value.id : ''))
    MOVIEMASHER.dispatch(new EventChangedTargetIds(this.selectedTargetIds))
    MOVIEMASHER.dispatch(new EventChangedClientAction(REMOVE))
  }

  private selectable(id: TargetId | PropertyId): Selectable | false {
    const { mashAsset, selection } = this
    const targetId = isPropertyId(id) ? id.split(DOT).shift() : id
    if (!isTargetId(targetId)) {
      // console.warn(this.constructor.name, 'selectable', 'invalid target id', id)
      return false
    }
    switch (targetId) {
      case $MASH: return mashAsset || false
      case $CLIP: return selection
      case $CONTENT: return selection && selection.content 
      case $CONTAINER: return selection && selection.container || false
      case $ASSET: return this.asset || false
    }
  }

  private get selectedTargetIds(): TargetIds {
    const ids: TargetIds = []
    const { mashAsset, selection, assetId } = this
    if (mashAsset) {
      ids.push($MASH)
      if (selection) {
        ids.push($CLIP)
        ids.push($CONTENT)
        if (selection.container) ids.push($CONTAINER)
      }
    }
    if (assetId) ids.push($ASSET)
    return ids
  }

  private get time(): Time { return this.mashAsset?.time || timeFromArgs(0, this.fps)}

  private set time(value: Time) { this.goToTime(value) }

  private togglePaused(): void {
    this.paused = !this.paused
  }

  private undo(): void {
    const { canUndo } = this.actions
    if (canUndo) this.actions.undo()
  }

  unload(): void {
    this.mashAsset = undefined
    
  }
}

export const masherInstance = (options: MasherOptions = {}): Masher => {
  const args: MasherArgs = { ...Defaults, ...options }
  return new MasherClass(args)
}
