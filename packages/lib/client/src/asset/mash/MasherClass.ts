
import type { AddClipsEditObject, AddTrackEditObject, ChangePropertiesEditObject, ClientAction, ClientAsset, ClientAssets, ClientClip, ClientClips, ClientMashAsset, ClipLocation, Edits, Masher, MasherArgs, MasherOptions, MoveClipEditObject, PreviewElements, RemoveClipEditObject, Selectable, SelectedProperty, Timeout } from '@moviemasher/runtime-client'
import type { AssetCacheArgs, AssetObject, AssetType, EventDispatcherListeners, MashAssetObject, PropertyId, PropertyIds, ScalarsById, Size, Strings, TargetId, TargetIds, Time } from '@moviemasher/runtime-shared'

import { colorFromRgb, colorRgbDifference, colorToRgb } from '@moviemasher/lib-shared/utility/color.js'
import { assertArray, assertDefined, assertPopulatedString, assertPositive, isEndpoint, isMashAsset, isPositive, isPropertyId } from '@moviemasher/lib-shared/utility/guards.js'
import { assertSizeAboveZero, sizeAboveZero, sizeContain, sizeCover, sizeEven } from '@moviemasher/lib-shared/utility/rect.js'
import { timeFromArgs } from '@moviemasher/lib-shared/utility/time.js'
import { ADD, ADD_TRACK, EventAddAssets, EventAssetId, EventChangeAssetId, EventChangeClipId, EventChangeDragging, EventChangeFrame, EventChangeScalar, EventChangeScalars, EventChangedAssetId, EventChangedClientAction, EventChangedClipId, EventChangedMashAsset, EventChangedPreviews, EventChangedTargetIds, EventClipId, EventDataType, EventDoClientAction, EventDragging, EventEnabledClientAction, EventManagedAsset, EventMashAsset, EventMashTime, EventMoveClip, EventPreviews, EventPropertyIds, EventReleaseManagedAssets, EventRemoveClip, EventScalar, EventSelectedProperties, EventTargetIds, EventTimeRange, EventTrackClipIcon, EventTrackClips, INDEX_CURRENT, INDEX_LAST, INDEX_NEXT, MOVE_CLIP, MOVIEMASHER, PLAY, REDO, REMOVE, REMOVE_CLIP, UNDO, VIEW, } from '@moviemasher/runtime-client'
import { ASSET_TARGET, AUDIO, CHANGE_MULTIPLE, CLIP_TARGET, CONTAINER, CONTENT, DOT, END, FLIP, MASH, TARGET_IDS, VIDEO, assertAsset, errorThrow, idGenerate, idGenerateString, idTemporary, isArray, isBoolean, isNumber } from '@moviemasher/runtime-shared'
import { assertClientClip, assertClientMashAsset } from '../../guards/ClientMashGuards.js'
import { svgDefsElement, svgPatch, svgPatternElement, svgPolygonElement, svgSvgElement, svgUrl } from '../../utility/svg.js'
import { isTargetId } from '../../guards/TypeGuards.js'
import { endpointUrl } from '../../utility/request.js'

const Defaults: MasherArgs = { buffer: 10, fps: 30, loop: true }

type TargetIdPropertyNamesRecord = {
  [index in TargetId]?: Strings
}

export class MasherClass implements Masher {
  constructor(args: MasherArgs) {
    const { buffer, fps, loop, mash, patchSvg } = args
    if (isNumber(fps)) this._fps = fps
    if (isNumber(buffer)) this._buffer = buffer
    if (isBoolean(loop)) this._loop = loop
    this.listeners = {
      [EventDragging.Type]: this.handleDragging.bind(this),
      [EventMashTime.Type]: this.handleFrame.bind(this),
      [EventChangeDragging.Type]: this.handleChangeDragging.bind(this),
      [EventTimeRange.Type]: this.handleTimeRange.bind(this),

      [EventAssetId.Type]: this.handleAssetId.bind(this),
      [EventChangeAssetId.Type]: this.handleChangeAssetId.bind(this),
      [EventChangeScalars.Type]: this.handleChangeScalars.bind(this),

      [EventChangeScalar.Type]: this.handleChangeScalar.bind(this),
      [EventTargetIds.Type]: this.handleTargetIds.bind(this),
      [EventPropertyIds.Type]: this.handlePropertyIds.bind(this),
      [EventSelectedProperties.Type]: this.handleSelectedProperties.bind(this),
      [EventScalar.Type]: this.handleValue.bind(this),
      [EventDataType.Type]: this.handleDataType.bind(this),

      [EventClipId.Type]: this.handleClipId.bind(this),

      [EventDoClientAction.Type]: this.handleAction.bind(this),
      [EventEnabledClientAction.Type]: this.handleActionEnabled.bind(this),
      [EventAddAssets.Type]: this.handleAddAssets.bind(this),
      [EventChangeClipId.Type]: this.handleSelectClipId.bind(this),
      [EventChangeFrame.Type]: this.handleChangeFrame.bind(this),
      [EventMashAsset.Type]: this.handleMashAsset.bind(this),
      [EventPreviews.Type]: this.handlePreviewItems.bind(this),

      [EventTrackClipIcon.Type]: this.handleIconFromFrame.bind(this),
      [EventMoveClip.Type]: this.handleMoveClip.bind(this),
      [EventRemoveClip.Type]: this.handleRemoveClip.bind(this),
      [EventTrackClips.Type]: this.handleTrackClips.bind(this),
    }
    MOVIEMASHER.eventDispatcher.listenersAdd(this.listeners)

    if (patchSvg) svgPatch(patchSvg)
    if (mash) this.load(mash)
  }

  private get actions(): Edits {
    const { mashAsset } = this
    if (!mashAsset) return errorThrow('Mash asset not loaded')

    return mashAsset.actions
  }

  private add() {
    const { time } = this
    // console.log(this.constructor.name, 'add', time)
  

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
    // console.log(this.constructor.name, 'addAssets', mashIndex)
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
      // isDefined<number>(frame) ? frame : frameOrIndex
      
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
    MOVIEMASHER.eventDispatcher.dispatch(event)
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
    MOVIEMASHER.eventDispatcher.dispatch(new EventChangedAssetId(id))
    MOVIEMASHER.eventDispatcher.dispatch(new EventChangedTargetIds(this.selectedTargetIds))
  }

  private assureMash(assets: ClientAssets) {
    const { mashAsset: mashMedia, mashingType: type } = this
    // console.log(this.constructor.name, 'assureMash', !!mashMedia)
    if (isMashAsset(mashMedia)) return Promise.resolve()
    
    // console.log(this.constructor.name, 'assureMash NOT MASH ASSET_TARGET!', mashMedia)
    const [firstMedia] = assets
    const { label } = firstMedia
    const mash: MashAssetObject = { 
      label, assets: [], id: idTemporary(), type, source: MASH
    }
    return this.load(mash)
  }

  private backgroundNode = (size: Size, patternedSize: Size, spacing = 0) => {
    const { width, height } = size
    const { color } = this.mashAsset!
    const rgb = colorToRgb(color)
    const differenceRgb = colorRgbDifference(rgb)
    const forecolor = colorFromRgb(differenceRgb)
    const framePolygon = svgPolygonElement(size, '', color)
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
      case FLIP:
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

  destroy() {  
    this.destroyMash()
    MOVIEMASHER.eventDispatcher.listenersRemove(this.listeners)
  }

  private destroyMash() {  
    const { mashAsset } = this
    if (mashAsset) {
      this.paused = true
      mashAsset.destroy() 
      delete this._mashAsset
      this.selection = false
      MOVIEMASHER.eventDispatcher.dispatch(new EventReleaseManagedAssets())
    }
  }

  private dragging = false

  private drawTimeout?: Timeout

  private _mashingType?: AssetType
  private get mashingType(): AssetType {
    return this._mashingType ||= VIDEO
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

    const { window } = globalThis
    // console.log('encodingView', url)
    window.open(url, '_blank')

  }

  private get endTime(): Time {
    const { mashAsset: mash } = this
    return mash ? mash.endTime.scale(this.fps, 'floor') : timeFromArgs()
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
    const goTime = value.scaleToFps(fps) 
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
    const { mashAsset } = this
    const hasMashAsset = !!mashAsset
    const loading = hasMashAsset 

    const returning = this.drawTimeout || !loading
    if (returning) return
    // console.log(this.constructor.name, 'dispatchDrawLater')

    this.drawTimeout = setTimeout(() => {
      MOVIEMASHER.eventDispatcher.dispatch(new EventChangedPreviews())
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
    this.goToTime(timeFromArgs(event.detail, this.mashAsset!.quantize)) 
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
    assertPopulatedString(propertyName)
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
    if (!target) return

    event.stopImmediatePropagation()
    event.detail.value = target.value(propertyName)
  }

  private clipSize = (clipSize: Size) => {
    const frameWidth = this.frameWidth(clipSize.height)
    
    const { width: resizeWidth, height } = clipSize
    
    const width = Math.max(frameWidth, resizeWidth)
    return  { width, height }
  }

  private frameWidth = (height: number) => {
    const { size } = this.mashAsset!
    if (!size) return 0
    
    assertSizeAboveZero(size, 'size')

    const ratio = size.width / size.height
    return height * ratio
  }

  private handleIconFromFrame(event: EventTrackClipIcon) {
    const { detail } = event
    const { clipId, gap, scale, clipSize } = detail

    const myClipSize = this.clipSize(clipSize)

    const clip = this.clipFromId(clipId)
    if (!clip) return

    const { size } = this.mashAsset!
    assertSizeAboveZero(size, 'mashAsset.size')

    const frameSize = sizeEven(sizeCover(size, myClipSize, true))
    detail.background = this.backgroundNode(frameSize, myClipSize, gap)
    detail.promise = clip.clipIcon(frameSize, myClipSize, scale, gap)
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
      case FLIP: return this.flip()
      case REDO: return this.redo()
      case REMOVE: return this.removeClip()
      case PLAY: return this.togglePaused()
      case UNDO: return this.undo()
      default: return
    }
  }
  
  private actionIsHandled(action: ClientAction): boolean { 
    switch(action) {
      case ADD: 
      case ADD_TRACK: 
      case VIEW:
      case FLIP: 
      case REDO: 
      case REMOVE: 
      case PLAY: 
      case UNDO: return true
    }
    return false
  }

  private handleAssetId(event: EventAssetId) {
    event.stopImmediatePropagation()
    event.detail.assetId = this.assetId
  }

  private handleChangeAssetId(event: EventChangeAssetId) {
    event.stopImmediatePropagation()
    this.assetId = event.detail
    MOVIEMASHER.eventDispatcher.dispatch(new EventChangedClientAction(ADD))

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

  private handlePreviewItems(event: EventPreviews) {
    const { detail } = event
    const { maxDimension, disabled } = detail
    // console.log(this.constructor.name, 'handlePreviewItems', disabled)

    detail.promise = this.previewsPromise(maxDimension, disabled)
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
      assertArray(types)
  
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
      tween.frame = tween.property.name.endsWith(END) ? last : frame
    })
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
  
  load(data: AssetObject): Promise<void> {
    data.id ||= idGenerateString()
    const mashMediaObject = this.mashAssetObject(data)
    return this.mashAssetObjectLoadPromise(mashMediaObject).then(() => {
      const { type } = mashMediaObject
      const { size } = this.mashAsset!
      const { fps } = this
      if (!(sizeAboveZero(size) || type === AUDIO)) {
        return Promise.resolve()
      }
      return this.goToTime(timeFromArgs(0, fps)).then(() => {
        const { mashAsset: mash } = this
        if (isMashAsset(mash)) mash.clearPreview()
      })
    })
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
    const boolean = !!value
    this._loop = boolean
    const { mashAsset: mash } = this
    if (mash) mash.loop = boolean
  }

  private _mashAsset: ClientMashAsset | undefined 
  private get mashAsset(): ClientMashAsset | undefined { return this._mashAsset }
  private set mashAsset(value: ClientMashAsset | undefined) {
    if (this._mashAsset === value) {
      // console.debug(this.constructor.name, 'set mashAsset set to same value')
      return
    }
    // console.debug(this.constructor.name, 'set mashAsset dispatching changed', value?.id)

    this.destroyMash()
    this._mashAsset = value

    MOVIEMASHER.eventDispatcher.dispatch(new EventChangedMashAsset(value))
    
    MOVIEMASHER.eventDispatcher.dispatch(new EventChangedClientAction(ADD))
    MOVIEMASHER.eventDispatcher.dispatch(new EventChangedClientAction(ADD_TRACK))
    MOVIEMASHER.eventDispatcher.dispatch(new EventChangedClientAction(FLIP))
    MOVIEMASHER.eventDispatcher.dispatch(new EventChangedClientAction(PLAY))
    MOVIEMASHER.eventDispatcher.dispatch(new EventChangedClientAction(VIEW))
  }

  private mashAssetObject(assetObject: AssetObject): MashAssetObject {
    const { source } = assetObject
    // simply return object promise if it is already a mash
    if (source === MASH) return assetObject
    
    // otherwise, load asset so we can create a clip with it
    const event = new EventManagedAsset(assetObject)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { asset } = event.detail
    assertAsset(asset)

    const { type } = asset
    const mash: MashAssetObject = {
      id: idGenerateString(), type,
      assets: [assetObject],
      source: MASH,
      tracks: [{ clips: [asset.clipObject()]}],
    }
    return mash
  }

  private mashAssetObjectLoadPromise(object: MashAssetObject): Promise<void> {
    const { buffer, loop } = this
    const assetObject: MashAssetObject = {
      ...object, buffer, loop, 
    }
    const event = new EventManagedAsset(assetObject)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { asset } = event.detail
    assertClientMashAsset(asset)

    this.mashAsset = asset

    const { timeToBuffer } = asset
    const args: AssetCacheArgs = { 
      time: timeToBuffer, assetTime: timeToBuffer,
      visible: true, audible: false, 
    }
    // console.log(this.constructor.name, 'mashMediaObjectLoadPromise mashMediaFromObject', mashAsset)
    return asset.assetCachePromise(args).then(() => {
      // console.log(this.constructor.name, 'mashMediaObjectLoadPromise assetCachePromise')
      this.selection = false
      this.dispatchDrawLater() 
    })
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
      mash.paused = value

      // bring back selection
      if (value) this.redraw()
      MOVIEMASHER.eventDispatcher.dispatch(new EventChangedClientAction(PLAY))
    }
  }

  private previewsPromise(maxDimension?: number, _disabled?: boolean): Promise<PreviewElements> {
    const { mashAsset } = this
    if (!mashAsset || mashAsset.type === AUDIO) return Promise.resolve([])

    const { color, size: assetSize } = mashAsset         
    const size = maxDimension ? sizeContain(assetSize, maxDimension) : assetSize

    if (!sizeAboveZero(size)) return Promise.resolve([])

    const colorElement = svgSvgElement(size, svgPolygonElement(size, '', color))
    const promise = Promise.resolve([colorElement])
    return promise.then(elements => {
      return mashAsset.mashPreviewsPromise(size, this.selection || undefined).then(items => {
        return [...elements, ...items]
      })
    })
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
    MOVIEMASHER.eventDispatcher.dispatch(new EventChangedPreviews())
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

  private flip(): void {
    const { mashAsset, actions } = this
    if (!mashAsset) return

    const aspectWidth = mashAsset.value('aspectWidth') || 0
    const aspectHeight = mashAsset.value('aspectHeight') || 0
    const size = { width: aspectWidth, height: aspectHeight }
    const widthId = `${MASH}${DOT}aspectWidth`
    const heightId = `${MASH}${DOT}aspectHeight`
    const { width, height } = size
    const redoValues: ScalarsById = { [widthId]: height, [heightId]: width }
    const undoValues: ScalarsById = { [widthId]: width, [heightId]: height }
    const actionObject: ChangePropertiesEditObject = {
      type: CHANGE_MULTIPLE, target: mashAsset, redoValues, undoValues
    }
    actions.create(actionObject)
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

    MOVIEMASHER.eventDispatcher.dispatch(new EventChangedClipId(value ? value.id : ''))
    MOVIEMASHER.eventDispatcher.dispatch(new EventChangedTargetIds(this.selectedTargetIds))
    MOVIEMASHER.eventDispatcher.dispatch(new EventChangedClientAction(REMOVE))
  }

  private selectable(id: TargetId | PropertyId): Selectable | false {
    const { mashAsset, selection } = this
    const targetId = isPropertyId(id) ? id.split(DOT).shift() : id
    if (!isTargetId(targetId)) {
      // console.warn(this.constructor.name, 'selectable', 'invalid target id', id)
      return false
    }
    switch (targetId) {
      case MASH: return mashAsset || false
      case CLIP_TARGET: return selection
      case CONTENT: return selection && selection.content 
      case CONTAINER: return selection && selection.container || false
      case ASSET_TARGET: return this.asset || false
    }
  }

  private get selectedTargetIds(): TargetIds {
    const ids: TargetIds = []
    const { mashAsset, selection, assetId } = this
    if (mashAsset) {
      ids.push(MASH)
      if (selection) {
        ids.push(CLIP_TARGET)
        ids.push(CONTENT)
        if (selection.container) ids.push(CONTAINER)
      }
    }
    if (assetId) ids.push(ASSET_TARGET)
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
    this.destroyMash()
  }
}

export const masherInstance = (options: MasherOptions = {}): Masher => {
  const args: MasherArgs = { ...Defaults, ...options }
  return new MasherClass(args)
}
