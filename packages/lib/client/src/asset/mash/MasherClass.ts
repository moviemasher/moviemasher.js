
import type { AddClipActionObject, AddTrackActionObject, ChangePropertiesActionObject, MoveClipActionObject, RemoveClipActionObject } from '@moviemasher/lib-shared'
import type { Action, Actions, ClientAction, ClientAsset, ClientAssets, ClientClip, ClientClips, ClientMashAsset, ClipFromIdEvent, IconFromFrameEvent, StringEvent, MashIndex, MashMoveClipEvent, MashRemoveTrackEvent, Masher, MasherArgs, Previews, Selectable, SelectedPropertiesEvent, Timeout, TrackClipsEvent } from '@moviemasher/runtime-client'
import type { AssetCacheArgs, AssetObject, AssetType, ClipObject, EventDispatcherListenerRecord, MashAssetObject, PropertyIds, Size, StringRecord, Strings, TargetId, TargetIds, Time, TimeRange, Track, } from '@moviemasher/runtime-shared'

import { ClientActionTogglePaused, ActionTypeAddClip, ActionTypeAddTrack, ActionTypeMoveClip, ActionTypeRemoveClip, ActionsClass, ClientActionAdd, ClientActionAddTrack, ClientActionRedo, ClientActionRemove, ClientActionRender, ClientActionSave, ClientActionUndo, CurrentIndex, Default, LastIndex, NextIndex, End, assertAboveZero, assertArray, assertClientClip, assertClientMashAsset, assertClip, assertMashAsset, assertPositive, assertSizeAboveZero, assertTrack, assertTrue, colorFromRgb, colorRgbDifference, colorToRgb, idGenerate, idGenerateString, idIsTemporary, idTemporary, isAboveZero, isChangeAction, isClip, isLoadType, isMashAsset, isPositive, sizeAboveZero, sizeCover, sizeEven, svgDefsElement, svgPatch, svgPatternElement, svgPolygonElement, svgSvgElement, svgUrl, timeFromArgs, timeFromSeconds, timeRangeFromArgs, sizeContain, ClientActionFlip, ActionTypeChangeMultiple } from '@moviemasher/lib-shared'
import { EventAction, EventActionEnabled, EventAddAssets, EventAssetObject, EventChangeAssetObject, EventChangeClipId, EventChangeFrame, EventChanged, EventChangedAssetObject, EventChangedClipId, EventChangedMashAsset, EventChangedPreviews, EventChangedTargetIds, EventClipId, EventDataType, EventManagedAsset, EventManagedAssetId, EventMashAsset, EventPreviews, EventPropertyIds, EventReleaseManagedAssets, EventSelectedProperties, EventTargetIds, EventTypeAdded, EventTypeClipFromId, EventTypeFps, EventTypeIconFromFrame, EventTypeMashMoveClip, EventTypeMashRemoveClip, EventTypeMashRemoveTrack, EventTypeTrackClips, EventTypeVolume, EventValue, MovieMasher, TypeAsset, TypeClip, TypeContainer, TypeContent, TypeMash, TypesTarget, isTargetId } from '@moviemasher/runtime-client'
import { DotChar, SourceMash, TypeAudio, TypeVideo, assertAsset, isArray, isAssetType, isBoolean, isNumber } from '@moviemasher/runtime-shared'

export type TargetIdPropertyNamesRecord = {
  [index in TargetId]?: Strings
}
export class MasherClass implements Masher {
  constructor(args: MasherArgs) {
    const {
      autoplay, buffer, fps, loop, mash, mashingType, patchSvg,
      precision, readOnly, volume,
    } = args
    if (patchSvg) svgPatch(patchSvg)

    if (isAssetType(mashingType)) this._mashingType = mashingType
    if (readOnly) this.readOnly = true
    this.editing = !this.readOnly
    if (isBoolean(autoplay)) this.autoplay = autoplay
    if (isNumber(precision)) this.precision = precision
    if (isBoolean(loop)) this._loop = loop
    if (isNumber(fps)) this._fps = fps
    if (isNumber(volume)) this._volume = volume
    if (isNumber(buffer)) this._buffer = buffer
    
    this.actions = new ActionsClass(this)

    this.listeners[EventAssetObject.Type] = this.handleAssetObject.bind(this)
    this.listeners[EventAction.Type] = this.handleAction.bind(this)
    this.listeners[EventActionEnabled.Type] = this.handleActionEnabled.bind(this)
    this.listeners[EventAddAssets.Type] = this.handleAddAssets.bind(this)
    this.listeners[EventChangeAssetObject.Type] = this.handleSetAssetObject.bind(this)
    this.listeners[EventChangeClipId.Type] = this.handleSelectClipId.bind(this)
    this.listeners[EventChangeFrame.Type] = this.handleChangeFrame.bind(this)
    this.listeners[EventClipId.Type] = this.handleClipId.bind(this)
    this.listeners[EventDataType.Type] = this.handleDataType.bind(this)
    this.listeners[EventMashAsset.Type] = this.handleMashAsset.bind(this)
    this.listeners[EventPreviews.Type] = this.handlePreviewItems.bind(this)
    this.listeners[EventPropertyIds.Type] = this.handlePropertyIds.bind(this)
    this.listeners[EventSelectedProperties.Type] = this.handleSelectedProperties.bind(this)
    this.listeners[EventTargetIds.Type] = this.handleTargetIds.bind(this)
    this.listeners[EventValue.Type] = this.handleValue.bind(this)

    this.listeners[EventTypeClipFromId] = this.handleClipFromId.bind(this)
    this.listeners[EventTypeIconFromFrame] = this.handleIconFromFrame.bind(this)
    this.listeners[EventTypeMashMoveClip] = this.handleMoveClip.bind(this)
    this.listeners[EventTypeMashRemoveClip] = this.handleRemoveClip.bind(this)
    this.listeners[EventTypeMashRemoveTrack] = this.handleRemoveTrack.bind(this)
    this.listeners[EventTypeTrackClips] = this.handleTrackClips.bind(this)
    
    MovieMasher.eventDispatcher.listenersAdd(this.listeners)

    if (mash) this.load(mash)
  }

  actions: Actions

  private add() {
    const { assetObject, time } = this
    if (!assetObject) return 

    const { asset, mashAsset } = this
    if (!(asset && mashAsset)) return 

    const { selection } = this
    const mashIndex: MashIndex = { clip: -1, track: 0 }
    if (selection) {
      const { track } = selection
      mashIndex.clip = track.dense ? track.clips.indexOf(selection) : selection.endFrame
      mashIndex.track = track.index
    } else if (time) {
      mashIndex.clip = time.scale(mashAsset.quantize).frame
    }
    this.addAssets(asset, mashIndex)
  }

  private addAssets(asset: ClientAsset | ClientAssets, mashIndex?: MashIndex): Promise<ClientAssets> {
    const installedAssets = isArray(asset) ? asset : [asset]
    if (!installedAssets.length) return Promise.resolve([])
   
    const assetTypes = installedAssets.map(media => media.type)
    const event = new CustomEvent(EventTypeAdded, { detail: { definitionTypes: assetTypes } })
    MovieMasher.eventDispatcher.dispatch(event)

    if (!mashIndex) return Promise.resolve(installedAssets)
    
    const clips: ClientClips = installedAssets.map(asset => {
      const clipObject: ClipObject = asset.clipObject()
      return this.mashAsset!.clipInstance(clipObject) as ClientClip
    })

    const { clip: frameOrIndex = -1, track: trackIndex = 0 } = mashIndex

    const [firstClip] = clips

    return this.assureMash(installedAssets).then(() => {
      const { mashAsset } = this
      assertMashAsset(mashAsset)
    
      const { tracks } = mashAsset
      const { length } = tracks
      assertAboveZero(length)

      const trackPositive = isPositive(trackIndex)
      const track = trackPositive ? tracks[trackIndex] : undefined
      const trackClips = track?.clips || []
      let index = trackIndex
      if (index < 0) index = length
      else if (index >= length) index = length - 1

      const dense = track?.dense 

      const redoSelection = firstClip 
      
      const createTracks = trackPositive ? 0 : clips.length
      const options: AddClipActionObject = {
        clips, type: ActionTypeAddClip, trackIndex,
        undoSelection: this.selection,
        redoSelection, createTracks, mashAsset,
      }
      const clipIndex = this.clipIndex(frameOrIndex, trackClips, dense)
      if (dense) options.insertIndex = clipIndex
      else {
        if (createTracks) options.redoFrame = clipIndex
        else {
          assertTrack(track)
          track.assureFrames(mashAsset.quantize, clips)
          options.redoFrame = track.frameForClipNearFrame(firstClip, clipIndex)
        }
      }
      this.actions.create(options)
      return this.loadMashAndDraw()  
    }).then(() => installedAssets) 
  }

  addTrack(): void {
    const { mashAsset } = this
    if (!mashAsset) return

    const object: AddTrackActionObject = { 
      mashAsset,
      redoSelection: false, 
      type: ActionTypeAddTrack, createTracks: 1,
      undoSelection: this.selection, 
    }
    this.actions.create(object)
  }

  private _asset?: ClientAsset
  private get asset(): ClientAsset | undefined {
    const {_asset, assetObject} = this
    if (_asset) return _asset

    if (!assetObject) {
      console.warn(this.constructor.name, 'asset assetObject not set')
      return 
    }
    const event = new EventManagedAsset(assetObject)
    MovieMasher.eventDispatcher.dispatch(event)
    const { asset } = event.detail
    return this._asset = asset
  }

  private assetObject?: AssetObject

  private assureMash(media: ClientAssets) {
    const { mashAsset: mashMedia, mashingType: type } = this
    // console.log(this.constructor.name, 'assureMash', !!mashMedia)
    if (isMashAsset(mashMedia)) return Promise.resolve()
    
    // console.log(this.constructor.name, 'assureMash NOT MASH ASSET!', mashMedia)
    const [firstMedia] = media
    const { label } = firstMedia
    const mash: MashAssetObject = { 
      label, media: [], id: idTemporary(), type, source: SourceMash
    }
    return this.load(mash)
  }

  autoplay = Default.editor.autoplay

  private _buffer = Default.editor.buffer
  get buffer(): number { return this._buffer }
  set buffer(value: number) {
    const number = Number(value)
    if (this._buffer !== number) {
      this._buffer = number
      const { mashAsset: mashMedia } = this
      if (mashMedia) mashMedia.buffer = number
    }
  }

  can(clientAction: ClientAction): boolean {
    const { selection: clip, mashAsset: mash, assetObject, actions } = this    
    switch (clientAction) {
      case ClientActionTogglePaused:
      case ClientActionFlip:
      case ClientActionAddTrack: return !!mash
      case ClientActionAdd: return !!(assetObject && mash)
      case ClientActionSave: return actions.canSave
      case ClientActionUndo: return actions.canUndo
      case ClientActionRedo: return actions.canRedo
      case ClientActionRemove: return !!clip
      case ClientActionRender: return !actions.canSave && !!(mash?.id && !idIsTemporary(mash.id))
    }
    return false
  }

  private clearActions(): void {
    if (!this.actions.instances.length) return

    this.actions = new ActionsClass(this)
    MovieMasher.eventDispatcher.dispatch(new EventChanged())
  }

  private clipFromId(clipId: string): ClientClip | undefined {
    if (!clipId) return
    const { mashAsset } = this
    if (!mashAsset) return

    const { tracks } = mashAsset
    for (const track of tracks) {
      const { clips } = track
      const clip = clips.find(clip => clip.id === clipId)
      if (clip) return clip
    }
    return 
  }

  private clipIndex(frameOrIndex: number, clips: ClientClips, dense?: boolean): number {
    if (isPositive(frameOrIndex)) return frameOrIndex
    
    const { mashAsset} = this
    assertMashAsset(mashAsset)

    switch (frameOrIndex) {
      case LastIndex: {
        if (dense) return clips.length
        
        const lastClip = clips[clips.length - 1]
        if (!lastClip) return 0

        const { frame, frames } = lastClip
        return frame + frames
      }
      case NextIndex:
      case CurrentIndex: {
        const { frame } = this.time.scale(mashAsset.quantize)
        if (!dense) return frame

        const onIndex = clips.findIndex(clip => 
          clip.frame <= frame && clip.frame + clip.frames > frame
        )
        if (!isPositive(onIndex)) return clips.length

        const index = frameOrIndex === NextIndex ? onIndex + 1 : onIndex
        const clip = clips[index]
        if (!clip) return clips.length

        return clip.frame
      }
      default: return 0
    }
  }

  get clips(): ClientClips { return this.mashAsset?.clips || [] }

  create() { 
    return this.load({ 
      id: idTemporary(), type: this.mashingType, source: SourceMash 
    }) 
  }

  get currentTime(): number {
    const { mashAsset } = this
    if (mashAsset && mashAsset.drawnTime) return mashAsset.drawnTime.seconds
    return 0
  }

  get definitions(): ClientAssets {
    const { mashAsset } = this
    if (!mashAsset) return []
    
    return mashAsset.assetIds.flatMap(id => {
      const event = new EventManagedAsset(id)
      MovieMasher.eventDispatcher.dispatch(event)
      const { asset } = event.detail
      return asset ? [asset] : []
  })
  }

  get definitionsUnsaved(): ClientAssets {
    const { definitions } = this

    return definitions.filter(definition => {
      const { type, id } = definition
      if (!isLoadType(type)) return false

      return idIsTemporary(id)
    })
  }

  destroy() {  
    this.destroyMash()
    MovieMasher.eventDispatcher.listenersRemove(this.listeners)
  }

  private destroyMash() {  
    const { mashAsset } = this
    if (mashAsset) {
      this.paused = true
      mashAsset.destroy() 
      delete this._mashAsset 
      this.clearActions()
      this.selection = false
      MovieMasher.eventDispatcher.dispatch(new EventReleaseManagedAssets())
    }
  }

  dragging = false

  private drawTimeout?: Timeout

  get duration(): number { return this.mashAsset?.duration || 0 }

  private _mashingType?: AssetType
  get mashingType(): AssetType {
    return this._mashingType ||= TypeVideo
  }

  editing: boolean 

  private get endTime(): Time {
    const { mashAsset: mash } = this
    return mash ? mash.endTime.scale(this.fps, 'floor') : timeFromArgs()
  }

  private _fps = Default.editor.fps
  get fps(): number {
    return this._fps || this.mashAsset?.quantize || Default.editor.fps
  }
  set fps(value: number) {
    const number = Number(value)
    // setting to zero means fallback to mash rate
    if (this._fps !== number) {
      this._fps = number
      MovieMasher.eventDispatcher.dispatch(new CustomEvent(EventTypeFps))
      this.time = this.time.scale(this.fps)
    }
  }

  get frame(): number { return this.time.frame }
  set frame(value: number) { this.goToTime(timeFromArgs(Number(value), this.fps)) }

  get frames(): number { return this.endTime.frame }

  // private get gain(): number { return this.muted ? 0.0 : this.volume }

  goToTime(value: Time): Promise<void> {
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

  dispatchChanged(action: Action): void {
    const { mashAsset } = this
    if (!mashAsset) return
  
    mashAsset.clearPreview()
    if (isChangeAction(action)) {
      const { property, target } = action
      switch(property) {
        case 'gain': {
          if (isClip(target)) {
            mashAsset.composition.adjustClipGain(target, mashAsset.quantize)
          }    
          break
        }
      }
    }

    this.selection = action.selection
    // console.log(this.constructor.name, 'dispatchChanged', action.constructor.name)
    MovieMasher.eventDispatcher.dispatch(new EventChanged(action))

    const promise = mashAsset.reload() || Promise.resolve()
    
    promise.then(() => this.dispatchDrawLater())
  }

  private dispatchDrawLater(): void {
    // console.log(this.constructor.name, 'dispatchDrawLater')
    if (this.drawTimeout || !this.mashAsset?.loading) return
  
    this.drawTimeout = setTimeout(() => {
      MovieMasher.eventDispatcher.dispatch(new EventChangedPreviews())
      delete this.drawTimeout
    }, 10)
  
  }

  handleAddAssets(event: EventAddAssets) {
    event.stopImmediatePropagation()
    const { detail } = event
    const { mashIndex, assets } = detail
    // console.log(this.constructor.name, 'handleAddAssets...')
    this.addAssets(assets, mashIndex)
    // console.log(this.constructor.name, 'handleAddAssets!')
  }

  private handleClipFromId(event: ClipFromIdEvent) {
    const { mashAsset } = this
    if (!mashAsset) return

    const { detail } = event
    const { clipId } = detail
    const { tracks } = mashAsset
    for (const track of tracks) {
      const { clips } = track
      const clip = clips.find(clip => clip.id === clipId)
      if (clip) {
        detail.clip = clip
        event.stopImmediatePropagation()
        return
      }
    }
  }

  private handleClipId(event: EventClipId) {
    event.detail.clipId = this.selection ? this.selection.id : ''
    event.stopImmediatePropagation()
  }

  private handleDataType(event: EventDataType) {
    const { propertyId } = event.detail
    const [targetId, propertyName] = propertyId.split(DotChar)
    if (!isTargetId(targetId)) {
      console.warn(this.constructor.name, 'handleDataType', 'invalid targetId', targetId)
      return
    }
    const target = this.selectable(targetId)
    if (!target) {
      console.warn(this.constructor.name, 'handleDataType', 'undefined target', targetId)
      return
    }

    const property = target.propertyFind(propertyName)
    if (!property) {
      console.warn(this.constructor.name, 'handleDataType', 'no property', targetId, propertyName)
      return
    }

    event.stopImmediatePropagation()

    const { type } = property
    console.debug(this.constructor.name, 'handleDataType', 'dataType', targetId, propertyName, type)
    
    event.detail.dataType = type

  }

  private handleChangeFrame(event: EventChangeFrame) {
    const { detail: frame } = event
    console.trace(this.constructor.name, 'handleChangeFrame', this.frame, frame)

    this.goToTime(timeFromArgs(event.detail, this.mashAsset!.quantize)) 
  }

  private handleMashAsset(event: EventMashAsset) {
    event.stopImmediatePropagation()
    event.detail.mashAsset = this.mashAsset
  }

  private handlePropertyIds(event: EventPropertyIds) {
    const { targetIds, propertyIds } = event.detail
    propertyIds.push(...this.selectedPropertyIds(targetIds))
    event.stopImmediatePropagation()
  }

  private handleValue(event: EventValue) {
    const { propertyId } = event.detail
    const [targetId, propertyName] = propertyId.split(DotChar)
    if (!isTargetId(targetId)) return

    const target = this.selectable(targetId)
    if (!target) return

    event.stopImmediatePropagation()
    event.detail.value = target.value(propertyName)
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


  private handleIconFromFrame(event: IconFromFrameEvent) {
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
  }

  private handleMoveClip(event: MashMoveClipEvent) {
    const { selection: clip } = this
    assertClip(clip)

    const { detail: mashIndex } = event
    this.move(clip, mashIndex)
    event.stopImmediatePropagation()
  }

  private loadMashAssetObject(assetObject: AssetObject): MashAssetObject {
    const { source } = assetObject
    // simply return object promise if it is already a mash
    if (source === SourceMash) return assetObject
    
    // otherwise, load asset so we can create a clip with it
    const event = new EventManagedAsset(assetObject)
    MovieMasher.eventDispatcher.dispatch(event)
    const { asset } = event.detail
    assertAsset(asset)
    const { id, type } = asset
    const clipObject: ClipObject = {}
    if (asset.canBeContent) clipObject.contentId = id
    else clipObject.containerId = id
    const mash: MashAssetObject = {
      id: idGenerateString(), type,
      media: [assetObject],
      source: SourceMash,
      tracks: [{ clips: [clipObject]}],
    }
    return mash
  }

  private handleAction(event: EventAction) { 
    const { detail: action } = event
    if (!this.actionIsHandled(action)) return

    event.stopImmediatePropagation()
    switch(action) {
      case ClientActionTogglePaused: return this.togglePaused()
      case ClientActionAddTrack: return this.addTrack()
      case ClientActionAdd: return this.add()
      case ClientActionSave: return this.save()
      case ClientActionUndo: return this.undo()
      case ClientActionRedo: return this.redo()
      case ClientActionRemove: return this.removeClip()
      case ClientActionRender: return this.render()
      case ClientActionFlip: return this.rotate()
    }
  }
  
  private actionIsHandled(action: ClientAction): boolean { 
    switch(action) {
      case ClientActionTogglePaused: 
      case ClientActionAddTrack: 
      case ClientActionFlip: 
      case ClientActionAdd: 
      case ClientActionSave: 
      case ClientActionUndo: 
      case ClientActionRedo: 
      case ClientActionRemove: 
      case ClientActionRender: return true
    }
    return false
  }

  private handleAssetObject(event: EventAssetObject) { 
    const { assetObject } = this
    console.debug(this.constructor.name, 'handleAssetObject', assetObject)
    event.detail.assetObject = assetObject
    // event.stopImmediatePropagation()
  }

  private handleActionEnabled(event: EventActionEnabled) { 
    const { detail } = event
    const { clientAction: action } = detail
    // console.log(this.constructor.name, 'handleActionEnabled', detail)
    if (!this.actionIsHandled(action)) return
    
    detail.enabled = this.can(action)
    event.stopImmediatePropagation()
  }
  

  private handlePreviewItems(event: EventPreviews) {
    const { detail } = event
    const { disabled, maxDimension } = detail
    // console.log(this.constructor.name, 'handlePreviewItems', disabled)

    detail.promise = this.previewsPromise(maxDimension, !disabled)
    event.stopImmediatePropagation()
  }

  private handleRemoveClip(event: StringEvent) {
    const { detail: clipId } = event
    const clip = this.clipFromId(clipId)
    if (clip) {
      this.removeClip(clip)
      event.stopImmediatePropagation()
    }
  }

  private handleRemoveTrack(event: MashRemoveTrackEvent) {
    const { detail } = event
    const { track } = detail
    this.removeTrack(track)
    event.stopImmediatePropagation()
  }

  private handleSetAssetObject(event: EventChangeAssetObject) {
    event.stopImmediatePropagation()
    const { detail: assetObject } = event
    const { assetObject: currentAssetObject } = this
    if (assetObject === currentAssetObject) {
      console.warn(this.constructor.name, 'handleSetAssetObject', 'assetObject is the same', assetObject)
      return
    }
    console.debug(this.constructor.name, 'handleSetAssetObject', assetObject)
    this.assetObject = assetObject
    delete this._asset
    MovieMasher.eventDispatcher.dispatch(new EventChangedAssetObject(assetObject))
    MovieMasher.eventDispatcher.dispatch(new EventChangedTargetIds(this.selectedTargetIds))
  }

  private handleSelectClipId(event: EventChangeClipId) {
    this.selection = this.clipFromId(event.detail) || false
    this.redraw()
  }

  private handleSelectedProperties(event: SelectedPropertiesEvent) {
    event.stopImmediatePropagation()
    const { actions } = this
    const { detail: { selectedProperties, selectorTypes = TypesTarget} } = event
    const propertyNamesByTarget: TargetIdPropertyNamesRecord = {}
    selectorTypes.forEach(selector => {
      const [target, property] = selector.split(DotChar)
      if (!isTargetId(target)) return

      propertyNamesByTarget[target] ||= []
      if (isTargetId(selector)) return

      const types = propertyNamesByTarget[target]
      assertArray(types, `propertyNamesByTarget[${target}]`)
  
      types.push(property)
    })
    Object.entries(propertyNamesByTarget).forEach(([targetId, propertyNames]) => {
      if (!isTargetId(targetId)) return

      const selectable = this.selectable(targetId)
      if (!selectable) return

      const items = selectable.selectedProperties(actions, propertyNames)
      selectedProperties.push(...items)
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
      tween.frame = tween.property.name.endsWith(End) ? last : frame
    })
  }

  private handleTargetIds(event: EventTargetIds) {
    event.stopImmediatePropagation()
    event.detail.push(...this.selectedTargetIds)
  }

  private handleTrackClips(event: TrackClipsEvent) {
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
    const mashMediaObject = this.loadMashAssetObject(data)
    return this.mashAssetObjectLoadPromise(mashMediaObject).then(() => {
      const { type } = mashMediaObject
      const { size } = this.mashAsset!
      const { fps } = this
      if (!(sizeAboveZero(size) || type === TypeAudio)) {
        return Promise.resolve()
      }
      return this.goToTime(timeFromArgs(0, fps)).then(() => {
        const { mashAsset: mash } = this
        if (isMashAsset(mash)) mash.clearPreview()
        if (this.autoplay) this.paused = false
      })
    })
  }

  private loadMashAndDraw(): Promise<void> {
    const { mashAsset: mashMedia } = this
    assertMashAsset(mashMedia)
    const { timeToBuffer } = mashMedia
    const args: AssetCacheArgs = { 
      time: timeToBuffer, assetTime: timeToBuffer,
      visible: true, audible: false, 
    }

    if (!this.paused) args.audible = true
    return mashMedia.assetCachePromise(args).then(() => { mashMedia.draw() })
  }

  private listeners: EventDispatcherListenerRecord = {}

  private _loop = Default.editor.loop
  get loop(): boolean { return this._loop }
  set loop(value: boolean) {
    const boolean = !!value
    this._loop = boolean
    const { mashAsset: mash } = this
    if (mash) mash.loop = boolean
  }

  _mashAsset: ClientMashAsset | undefined 
  get mashAsset(): ClientMashAsset | undefined { return this._mashAsset }
  set mashAsset(value: ClientMashAsset | undefined) {
    if (this._mashAsset === value) {
      console.debug(this.constructor.name, 'set mashAsset set to same value')
      return
    }
    console.debug(this.constructor.name, 'set mashAsset dispatching changed', value?.id)

    this.destroyMash()
    this._mashAsset = value

    MovieMasher.eventDispatcher.dispatch(new EventChangedMashAsset(value))
  }

  private mashAssetObjectLoadPromise(object: MashAssetObject): Promise<void> {
    const { buffer, loop } = this
    const assetObject: MashAssetObject = {
      ...object, buffer, loop, 
    }
    const event = new EventManagedAsset(assetObject)
    MovieMasher.eventDispatcher.dispatch(event)
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

  move(clip: ClientClip, editorIndex: MashIndex = {}): void {
    const { clip: frameOrIndex = 0, track: trackIndex = 0} = editorIndex
    const { mashAsset } = this
    assertMashAsset(mashAsset)

    const { tracks } = mashAsset

    const { trackNumber: undoTrackIndex } = clip
    assertPositive(undoTrackIndex)


    const options: MoveClipActionObject = {
      redoSelection: clip, undoSelection: clip, 
      createTracks: 0,
      clip, mashAsset, trackIndex, undoTrackIndex, type: ActionTypeMoveClip
    }
    const creating = !isPositive(trackIndex)
    const track = creating ? undefined : tracks[trackIndex]
    if (creating) options.createTracks = 1

    const undoDense = tracks[undoTrackIndex].dense 
    const redoDense = track?.dense
    const currentIndex = track?.clips.indexOf(clip) ?? -1

    if (redoDense) {
      if (isPositive(frameOrIndex)) options.insertIndex = frameOrIndex
      else if (creating) options.insertIndex = 0
      else options.insertIndex = track.clips.length
    }
    if (undoDense) {
      options.undoInsertIndex = currentIndex
      if (frameOrIndex < currentIndex) options.undoInsertIndex += 1
    }

    if (!(redoDense && undoDense)) {
      const { frame } = clip
      options.undoFrame = frame
      options.redoFrame = track?.frameForClipNearFrame(clip, frameOrIndex) ?? 0
    }
    this.actions.create(options)
  }

  moveTrack(): void {
    // TODO: create move track action...
    console.debug(this.constructor.name, 'moveTrack coming soon...')
  }

  private _muted = false
  get muted(): boolean { return this._muted }
  set muted(value: boolean) {
    const boolean = !!value
    if (this._muted !== boolean) {
      this._muted = boolean
      // const { mashMedia: mash } = this
      // if (mash) mash.gain = this.gain
    }
  }

  pause(): void { this.paused = true }

  get paused(): boolean {
    const { mashAsset: mash } = this
    return mash ? mash.paused : true
  }
  set paused(value: boolean) {
    const { mashAsset: mash } = this
    if (mash) mash.paused = value

    // bring back selection
    if (value) this.redraw()
  }

  play(): void { this.paused = false }

  get position(): number {
    let per = 0
    if (this.time.frame) {
      per = this.time.seconds / this.duration
      if (per !== 1) per = parseFloat(per.toFixed(this.precision))
    }
    return per
  }
  set position(value: number) {
    this.goToTime(timeFromSeconds(this.duration * Number(value), this.fps))
  }

  get positionStep(): number {
    return parseFloat(`0.${'0'.repeat(this.precision - 1)}1`)
  }

  precision = Default.editor.precision

  private previewsPromise(maxDimension?: number, enabled?: boolean): Promise<Previews> {
    const { mashAsset } = this
    if (!mashAsset || mashAsset.type === TypeAudio) return Promise.resolve([])

    const { color, size: assetSize } = mashAsset         
    const size = maxDimension ? sizeContain(assetSize, maxDimension) : assetSize

    if (!sizeAboveZero(size)) return Promise.resolve([])

    const colorElement = svgSvgElement(size, svgPolygonElement(size, '', color))
    const promise = Promise.resolve([colorElement])
    const editor = (enabled && this.paused) ? this : undefined
    return promise.then(elements => {
      return mashAsset.mashPreviewsPromise(size, editor).then(items => {
        return [...elements, ...items]
      })
    })
  }

  private selectedPropertyIds(targetIds: TargetIds): PropertyIds {
    const ids = targetIds.length ? targetIds : TypesTarget
    const propertyIds: PropertyIds = []
    ids.forEach(id => {
      const target = this.selectable(id)
      if (target) propertyIds.push(...target.propertyIds(ids))
    })
    return propertyIds
  }

  readOnly = false

  redo(): void { 
    if (this.actions.canRedo) this.dispatchChanged(this.actions.redo()) 
  }

  redraw(): void {
    const { mashAsset } = this
    if (!mashAsset) return

    mashAsset.clearPreview()
    MovieMasher.eventDispatcher.dispatch(new EventChangedPreviews())
  }

  removeClip(clientClip?: ClientClip): void {
    const clip = clientClip || this.selection
    const { mashAsset, actions } = this
    assertMashAsset(mashAsset)
    assertClientClip(clip)

    const { track } = clip
    const options: RemoveClipActionObject = {
      redoSelection: false,
      clip,
      track,
      index: track.clips.indexOf(clip),
      type: ActionTypeRemoveClip,
      undoSelection: this.selection,
    }
    actions.create(options)
  }

  removeTrack(_track: Track): void {
    // TODO: create remove track action...
    console.debug(this.constructor.name, 'removeTrack coming soon...')
  }

  private render(): void {}

  private rotate(): void {
    const { mashAsset, selection, actions } = this
    if (!mashAsset) return

    const aspectWidth = mashAsset.value('aspectWidth') || 0
    const aspectHeight = mashAsset.value('aspectHeight') || 0
    const size = { width: aspectWidth, height: aspectHeight }
    const redoValues = { aspectWidth: size.height, aspectHeight: size.width }
    const undoValues = { aspectWidth: size.width, aspectHeight: size.height }
    const actionObject: ChangePropertiesActionObject = {
      type: ActionTypeChangeMultiple,
      property: 'rotate', target: mashAsset, redoValues, undoValues,
      redoSelection: selection, undoSelection: selection,
    }
    actions.create(actionObject)
  }

  private save(): void {}

  saved(temporaryIdLookup?: StringRecord): void {
    if (temporaryIdLookup) {
      const { mashAsset: mashMedia } = this
      assertTrue(mashMedia)

      Object.entries(temporaryIdLookup).forEach(([temporaryId, permanentId]) => {
        if (mashMedia.id === temporaryId) {
          mashMedia.id = permanentId
        } else {
          MovieMasher.eventDispatcher.dispatch(new EventManagedAssetId(temporaryId, permanentId))
        } 
      })
    }
    this.actions.save()
    MovieMasher.eventDispatcher.dispatch(new EventChanged())
  }

  private _selection: ClientClip | false = false
  get selection(): ClientClip | false { return this._selection }
  set selection(value: ClientClip | false) {
    if (this._selection === value) {
      console.warn(this.constructor.name, 'selection', 'same value', value ? value.id : '')
      return
    }
    this._selection = value
    console.debug(this.constructor.name, 'selection', 'dispatching', value ? value.id : '')
    const event: StringEvent = new EventChangedClipId(value ? value.id : '')
    MovieMasher.eventDispatcher.dispatch(event)
    MovieMasher.eventDispatcher.dispatch(new EventChangedTargetIds(this.selectedTargetIds))
  }

  private selectable(targetId: TargetId): Selectable | false {
    const { mashAsset, selection } = this
    switch (targetId) {
      case TypeMash: return mashAsset || false
      case TypeClip: return selection
      case TypeContent: return selection && selection.content 
      case TypeContainer: return selection && selection.container || false
      case TypeAsset: return this.asset || false
    }
  }

  private get selectedTargetIds(): TargetIds {
    const ids: TargetIds = []
    const { mashAsset, selection, assetObject } = this
    if (mashAsset) {
      ids.push(TypeMash)
      if (selection) {
        ids.push(TypeClip)
        ids.push(TypeContent)
        if (selection.container) ids.push(TypeContainer)
      }
    }
    if (assetObject) ids.push(TypeAsset)
    return ids
  }

  get time(): Time { return this.mashAsset?.time || timeFromArgs(0, this.fps)}

  set time(value: Time) { this.goToTime(value) }

  get timeRange(): TimeRange {
    return this.mashAsset?.timeRange || timeRangeFromArgs(0, this.fps) 
  }

  private togglePaused(): void {
    this.paused = !this.paused
  }

  undo(): void {
    const { canUndo } = this.actions
    if (canUndo) this.dispatchChanged(this.actions.undo())
  }

  unload(): void {
    this.destroyMash()
  }

  private _volume = Default.editor.volume
  get volume(): number { return this._volume }
  set volume(value: number) {
    const number = Number(value)
    if (this._volume !== number) {
      assertPositive(number)
      this._volume = number
      if (isAboveZero(number)) this.muted = false

      // const { mashMedia: mash } = this
      // if (mash) mash.gain = this.gain

      MovieMasher.eventDispatcher.dispatch(new CustomEvent(EventTypeVolume))
    }
  }
}
