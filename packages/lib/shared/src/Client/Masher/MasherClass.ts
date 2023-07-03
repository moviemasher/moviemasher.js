
import type { Action, Actions, ClientAsset, ClientAssetManager, ClientAssets, MashAddAssetsEvent, MashMoveClipEvent, ClipEvent, MashRemoveTrackEvent, PreviewItems, PreviewItemsEvent, RectEvent, ClipOrFalseEvent } from '@moviemasher/runtime-client'
import type { AssetCacheArgs, AssetObject, AssetObjects, AssetType, ClipObject, EventDispatcherListenerRecord, MashAsset, MashAssetObject, NumberEvent, Rect, StringRecord, Time, TimeRange, Track } from '@moviemasher/runtime-shared'

import type { ClientAction } from '@moviemasher/runtime-client'
import type { AddClipActionObject, AddTrackActionObject, RemoveClipActionObject } from './Actions/Action/ActionTypes.js'
import type { MashIndex, Masher, MasherArgs } from '@moviemasher/runtime-client'

import type { ClientClip, ClientClips, ClientMashAsset } from '@moviemasher/runtime-client'

import { EventTypeFrame, EventTypeMashAddAssets, EventTypeMashAddTrack, EventTypeMashMoveClip, EventTypeMashRemoveClip, EventTypeMashRemoveTrack, EventTypePreviewItems, EventTypeSelectClip, MovieMasher, isClientAsset } from '@moviemasher/runtime-client'
import {
  SourceMash, TypeAudio, TypeVideo,
  arrayFromOneOrMore,
  isArray,
  isAssetType,
  isBoolean, isNumber
} from '@moviemasher/runtime-shared'


import {
  timeFromArgs, timeFromSeconds, timeRangeFromArgs
} from '../../Helpers/Time/TimeUtilities.js'
import {
  ActionTypeAddClip, ActionTypeAddTrack, ActionTypeMoveClip,
  ActionTypeRemoveClip
} from '../../Setup/ActionTypeConstants.js'
import {
  ClientActionRedo, ClientActionRemove, ClientActionRender,
  ClientActionSave, ClientActionUndo
} from '../ClientActionConstants.js'
import { Default } from '../../Setup/Default.js'
import {
  EventTypeAction,
  EventTypeAdded, EventTypeDraw, EventTypeFps, EventTypeResize, EventTypeVolume
} from '@moviemasher/runtime-client'
import { assertMashAsset, isMashAsset } from '../../Shared/Mash/MashGuards.js'
import { assertTrack } from '../../Shared/Mash/Track/TrackGuards.js'
import { SizeZero } from '../../Utility/SizeConstants.js'
import { assertSizeAboveZero, isSize, sizeAboveZero, sizeCopy } from '../../Utility/SizeFunctions.js'

import { isLoadType } from '../../Setup/LoadType.js'
import {
  assertAboveZero, assertObject,
  assertPositive, assertTrue, isAboveZero,
  isPositive
} from '../../Shared/SharedGuards.js'

import { assertClientMashAsset, isClientMashAsset } from '../Mash/ClientMashGuards.js'
import { svgPatch, svgPolygonElement, svgSvgElement } from '../SvgFunctions.js'
import { CurrentIndex, LastIndex, NextIndex } from '../../Setup/Constants.js'
import { isClip } from '../../Shared/Mash/Clip/ClipFunctions.js'
import { idGenerateString, idIsTemporary, idTemporary } from '../../Utility/IdFunctions.js'
import { PointZero } from '../../Utility/PointConstants.js'
import { isPoint, pointCopy } from '../../Utility/PointFunctions.js'
import { rectsEqual } from '../../Utility/RectFunctions.js'
import { isChangeAction } from './Actions/Action/ActionFunctions.js'
import { ActionsClass } from './Actions/ActionsClass.js'

type Timeout = ReturnType<typeof setTimeout>

export class MasherClass implements Masher {
  constructor(args: MasherArgs) {
    const {
      autoplay, buffer, dimensions, fps, loop, mash, mashingType, patchSvg,
      precision, readOnly, volume,
    } = args
    if (patchSvg) svgPatch(patchSvg)

    const point = isPoint(dimensions) ? pointCopy(dimensions) : PointZero
    const size = isSize(dimensions) ? sizeCopy(dimensions) : SizeZero
    this._rect = { ...point, ...size } 
    
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
   
    this.listeners[EventTypeSelectClip] = this.handleSelectClip.bind(this)

    this.listeners[EventTypePreviewItems] = this.handlePreviewItems.bind(this)
    this.listeners[EventTypeMashAddAssets] = this.handleAddAssets.bind(this)
    this.listeners[EventTypeMashAddTrack] = this.handleAddTrack.bind(this)
    this.listeners[EventTypeMashMoveClip] = this.handleMoveClip.bind(this)
    this.listeners[EventTypeMashRemoveClip] = this.handleRemoveClip.bind(this)
    this.listeners[EventTypeMashRemoveTrack] = this.handleRemoveTrack.bind(this)
    this.listeners[EventTypeFrame] = this.handleFrame.bind(this)
    MovieMasher.eventDispatcher.listenersAdd(this.listeners)

    if (mash) this.load(mash)
  }

  actions: Actions

  private addMedia(asset: ClientAsset | ClientAssets, editorIndex?: MashIndex): Promise<ClientAssets> {
    const assets = isArray(asset) ? asset : [asset]
    if (!assets.length) {
      // console.log(this.constructor.name, 'addMedia NO ASSETS', assets.length, editorIndex)
      return Promise.resolve([])
    }
    // console.log(this.constructor.name, 'addMedia', assets.length, editorIndex)
    
    const installedAssets = this.media.install(assets) 
    const assetTypes = installedAssets.map(media => media.type)
    const event = new CustomEvent(EventTypeAdded, { detail: { definitionTypes: assetTypes } })
    MovieMasher.eventDispatcher.dispatch(event)

    if (!editorIndex) return Promise.resolve(installedAssets)
    
    const clips: ClientClips = installedAssets.map(definition => {
      const { id, type } = definition
      const clipObject: ClipObject = {}
      if (definition.isVector) clipObject.containerId = id
      else clipObject.contentId = id
  
      if (type === TypeAudio) clipObject.containerId = ''
      return this.mashAsset!.clipInstance(clipObject) as ClientClip
    })

    const { clip: frameOrIndex = -1, track: trackIndex = 0 } = editorIndex

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
        redoSelection, createTracks, mashAsset: mashAsset,
      }
      const clipIndex = this.clipIndex(frameOrIndex, trackClips, mashAsset, dense)
      if (dense) options.insertIndex = clipIndex
      else {
        if (createTracks) options.redoFrame = clipIndex
        else {
          assertTrack(track)
          options.redoFrame = track.frameForClipNearFrame(firstClip, clipIndex)
        }
      }
      this.actions.create(options)
      return this.loadMashAndDraw()  
    }).then(() => installedAssets) 
  }

  private clipIndex(frameOrIndex: number, clips: ClientClips, mash: MashAsset, dense?: boolean): number {
    if (isPositive(frameOrIndex)) return frameOrIndex
    
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
        const { frame } = this.time.scale(mash.quantize)
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

  private addMediaObjects(objects: AssetObject | AssetObjects, editorIndex?: MashIndex): Promise<ClientAssets> {
    // console.log(this.constructor.name, 'addMediaObjects')
    const array = arrayFromOneOrMore(objects) 
    if (!array.length) {
      console.log(this.constructor.name, 'addMediaObjects NO OBJECTS', objects, editorIndex)
      return Promise.resolve([])
    }
    const promises = array.map(object => this.media.assetPromise(object))

    return Promise.all(promises).then(assets => {
      const clientAssets = assets.filter<ClientAsset>(isClientAsset)
      return this.addMedia(clientAssets, editorIndex)
    })  
  }
  
  addTrack(): void {
    const { mashAsset } = this
    if (!mashAsset) return

    const object: AddTrackActionObject = { 
      redoSelection: false, 
      type: ActionTypeAddTrack, createTracks: 1,
      undoSelection: this.selection, mashAsset,
    }
    this.actions.create(object)
  }

  private assureMash(media: ClientAssets) {
    const { mashAsset: mashMedia } = this
    // console.log(this.constructor.name, 'assureMash', !!mashMedia)
    if (isMashAsset(mashMedia)) return Promise.resolve()
    
    console.log(this.constructor.name, 'assureMash NOT MASH ASSET!', mashMedia)
    const [firstMedia] = media
    const { label } = firstMedia
    const mash: MashAssetObject = { 
      label, media: [], id: idTemporary(), type: this.mashingType,
      source: SourceMash
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

  can(masherAction: ClientAction): boolean {
    const { selection: clip, mashAsset: mash } = this    
    switch (masherAction) {
      case ClientActionSave: return this.actions.canSave
      case ClientActionUndo: return this.actions.canUndo
      case ClientActionRedo: return this.actions.canRedo
      case ClientActionRemove: return !!clip
      case ClientActionRender: return !this.actions.canSave && !!(mash?.id && !idIsTemporary(mash.id))
    }
  }

  private clearActions(): void {
    if (!this.actions.instances.length) return

    this.actions = new ActionsClass(this)
    MovieMasher.eventDispatcher.dispatch(new CustomEvent(EventTypeAction))
  }

  get clips(): ClientClips { return this.mashAsset?.clips || [] }

  create() { 
    return this.load({ 
      id: idTemporary(), type: this.mashingType, source: SourceMash 
    }) 
  }

  get currentTime(): number {
    const { mashAsset: mash } = this
    if (mash && mash.drawnTime) return mash.drawnTime.seconds
    return 0
  }

  get definitions(): ClientAssets {
    const { mashAsset: mashMedia } = this
    if (!mashMedia) return []
    
    return mashMedia.assetIds.map(id => this.media.fromId(id) as ClientAsset)
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
    const { mashAsset: mashMedia } = this
    if (mashMedia) {
      this.paused = true
      mashMedia.destroy() 
      delete this.mashAsset 
      this.clearActions()
      this.selection = false
      this.media.undefineAll()
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

  private get gain(): number { return this.muted ? 0.0 : this.volume }

  goToTime(value?: Time): Promise<void> {
    const { fps, time } = this
    const { frame: currentFrame } = time
    const goTime = value ? value.scaleToFps(fps) : timeFromArgs(0, fps)
    const { frame: attemptFrame } = goTime
    const { frame: endFrame } = this.endTime
    const lastFrame = endFrame - 1
    const goFrame = lastFrame < 1 ? 0 : Math.min(attemptFrame, lastFrame)
    
    if (value && currentFrame === goFrame) return Promise.resolve()

    const promise = this.mashAsset?.seekToTime(timeFromArgs(goFrame, fps))
    if (promise) return promise

    return Promise.resolve()
  }

  handleAction(action: Action): void {
    const { mashAsset: mashMedia } = this
    if (!mashMedia) return
    
    const { mashAsset: mash } = this
  
    if (isClientMashAsset(mash)) {
      mash.clearPreview()
      if (isChangeAction(action)) {
        const { property, target } = action
        switch(property) {
          case 'gain': {
            if (isClip(target)) {
              mashMedia.composition.adjustClipGain(target, mash.quantize)
            }    
            break
          }
        }
      }
    } 

    this.selection = action.selection

    // console.log(this.constructor.name, 'handleAction', this.selection.selectTypes, selection)

    const promise = mashMedia.reload() || Promise.resolve()
    
    promise.then(() => {
      this.dispatchDrawLater()
      // console.log(this.constructor.name, 'handleAction', type)
      MovieMasher.eventDispatcher.dispatch(new CustomEvent(EventTypeAction, { detail: { action }}))
    })
  }

  private dispatchDrawLater(): void {
    console.log(this.constructor.name, 'dispatchDrawLater')
    if (this.drawTimeout || !this.mashAsset?.loading) return

      this.drawTimeout = setTimeout(() => {
        MovieMasher.eventDispatcher.dispatch(new CustomEvent(EventTypeDraw))
        delete this.drawTimeout
      }, 10)
    
  }

  handleAddAssets(event: MashAddAssetsEvent) {
    const { detail } = event
    const { mashIndex, assetObjects } = detail
    // console.log(this.constructor.name, 'handleAddAssets...')
    detail.promise = this.addMediaObjects(assetObjects, mashIndex)
    // console.log(this.constructor.name, 'handleAddAssets!')
    event.stopImmediatePropagation()
  }

  handleAddTrack(event: CustomEvent) {
    this.addTrack()
    event.stopImmediatePropagation()
  }

  handleFrame(event: NumberEvent) {
    this.frame = event.detail
  }

  handleMoveClip(event: MashMoveClipEvent) {
    const { detail } = event
    const { mashIndex, clip } = detail
    this.move(clip, mashIndex)
    event.stopImmediatePropagation()
  }

  loadMashAssetObject(assetObject: AssetObject): Promise<MashAssetObject> {
    const { source } = assetObject
    if (source === SourceMash) return Promise.resolve(assetObject)
    
    // console.log(this.constructor.name, 'loadMashAssetObject', source)
    return MovieMasher.assetManager.assetPromise(assetObject).then(asset => {
      const { id, type } = asset

      // console.log(this.constructor.name, 'loadMashAssetObject assetPromise', id, type)

      const clipObject: ClipObject = {}
      if (asset.canBeContent) clipObject.contentId = id
      else clipObject.containerId = id
      const mash: MashAssetObject = {
        id: idGenerateString(), type,
        media: [assetObject],
        source: SourceMash,
        tracks: [{ clips: [clipObject]}],
      }
      // console.log(this.constructor.name, 'loadMashAssetObject assetPromise', id, type)

      return mash
    })
  }

  handlePreviewItems(event: PreviewItemsEvent) {
    const { detail } = event
    const { disabled } = detail
    // console.log(this.constructor.name, 'handlePreviewItems', disabled)

    detail.promise = this.previewItems(!disabled)
    event.stopImmediatePropagation()
  }

  handleRemoveClip(event: ClipEvent) {
    const { detail: clip } = event
    this.removeClip(clip)
    event.stopImmediatePropagation()
  }

  handleRemoveTrack(event: MashRemoveTrackEvent) {
    const { detail } = event
    const { track } = detail
    this.removeTrack(track)
    event.stopImmediatePropagation()
  }

  handleResize(event: RectEvent) {
    this.rect = event.detail
  }

  private handleSelectClip(event: ClipOrFalseEvent) {
    this.selection = event.detail
    this.redraw()
  }

  load(data: AssetObject): Promise<void> {
    data.id ||= idGenerateString()
    return this.loadMashAssetObject(data).then(mashMediaObject => {
      this.mashMediaObject = mashMediaObject
      // console.log(this.constructor.name, 'load', data)
     
      assertObject(mashMediaObject, 'mashMediaObject')
      const { type: kind } = mashMediaObject

      delete this.mashMediaObject
      
      return this.mashAssetObjectLoadPromise(mashMediaObject).then(() => {
        const { rect } = this
        if (!(sizeAboveZero(rect) || kind === TypeAudio)) return Promise.resolve()
        return this.goToTime().then(() => {
          const { mashAsset: mash } = this
          if (isMashAsset(mash)) mash.clearPreview()
          if (this.autoplay) this.paused = false
        })
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

  mashAsset: ClientMashAsset | undefined 

  private mashAssetFromObject(object: MashAssetObject): Promise<ClientMashAsset> {
    const { rect, buffer, loop } = this
    const clientObject: MashAssetObject = {
      ...object,
      size: sizeCopy(rect),
      buffer,loop, 
    }
    this.destroyMash()
    return this.media.assetPromise(clientObject).then(asset => {
      assertClientMashAsset(asset)
      return this.mashAsset = asset
    })
  }

  private mashMediaObject?: MashAssetObject

  private mashAssetObjectLoadPromise(object: MashAssetObject): Promise<void> {
    // console.log(this.constructor.name, 'mashMediaObjectLoadPromise', object)
  
    return this.mashAssetFromObject(object).then(mashAsset => {
  
      const { timeToBuffer } = mashAsset
      const args: AssetCacheArgs = { 
        time: timeToBuffer, assetTime: timeToBuffer,
        visible: true, audible: false, 
      }
      // console.log(this.constructor.name, 'mashMediaObjectLoadPromise mashMediaFromObject', mashAsset)
      return mashAsset.assetCachePromise(args).then(() => {
        // console.log(this.constructor.name, 'mashMediaObjectLoadPromise assetCachePromise')
        this.selection = false
        this.dispatchDrawLater() 
      })
    })
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

  get media(): ClientAssetManager {
    return MovieMasher.assetManager
  }

  move(clip: ClientClip, editorIndex: MashIndex = {}): void {
    const { clip: frameOrIndex = 0, track: track = 0} = editorIndex
    assertPositive(frameOrIndex)

    const { mashAsset: mash } = this
    assertMashAsset(mash)

    const { tracks } = mash

    const { trackNumber: undoTrack } = clip
    const options: any = {
      clip,
      trackIndex: track,
      undoTrackIndex: undoTrack,
      type: ActionTypeMoveClip
    }
    const creating = !isPositive(track)
    if (creating) options.createTracks = 1

    const undoDense = isPositive(undoTrack) && tracks[undoTrack].dense 
    const redoDense = isPositive(track) && tracks[track].dense
   
    const currentIndex = creating ? -1 : tracks[track].clips.indexOf(clip)

    if (redoDense) options.insertIndex = frameOrIndex
    if (undoDense) {
      options.undoInsertIndex = currentIndex
      if (frameOrIndex < currentIndex) options.undoInsertIndex += 1
    }

    if (!(redoDense && undoDense)) {
      const { frame } = clip
      const insertFrame = creating ? 0 : tracks[track].frameForClipNearFrame(clip, frameOrIndex)
      const offset = insertFrame - frame
      if (!offset && track === undoTrack) return // no change

      options.undoFrame = frame
      options.redoFrame = frame + offset
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

  private previewItems(enabled?: boolean): Promise<PreviewItems> {
    const { mashAsset: mashMedia, rect } = this
    const color = mashMedia ? mashMedia.color : undefined      
    const size = sizeCopy(rect)
    const colorElement = svgSvgElement(size, svgPolygonElement(size, '', color))
    const promise = Promise.resolve([colorElement])

    if (!(mashMedia && (sizeAboveZero(rect) || mashMedia.type === TypeAudio))) {
      console.log(this.constructor.name, 'previewItems', 'no mashMedia or size', !!mashMedia, rect)
      return promise
    }
    const editor = (enabled && this.paused) ? this : undefined
    return promise.then(elements => {
      return mashMedia.mashPreviewItemsPromise(editor).then(items => {
        return [...elements, ...items]
      })
    })
  }

  readOnly = false

  private _rect: Rect
  get rect(): Rect { return this._rect }
  set rect(value: Rect) {
    assertSizeAboveZero(value)
    if (rectsEqual(this.rect, value)) return

    this._rect = value
    // const { mashMediaObject } = this


    // // console.log(this.constructor.name, 'rect', rect, '=>', value, !!editedData)
    
    // const promise = mashMediaObject ? this.loadMashMediaObject() : Promise.resolve()
    // promise.then(() => {
    const { mashAsset: mashMedia } = this
    if (!mashMedia) return

    mashMedia.imageSize = sizeCopy(value)

    MovieMasher.eventDispatcher.dispatch(new CustomEvent(EventTypeResize, { detail: { rect: value } }))

    this.redraw()
    // })
  }

  redo(): void { if (this.actions.canRedo) this.handleAction(this.actions.redo()) }

  redraw(): void {
    const { mashAsset: mashMedia } = this
    if (!mashMedia) return

    mashMedia.clearPreview()
    MovieMasher.eventDispatcher.dispatch(new CustomEvent(EventTypeDraw))
  }

  removeClip(clip: ClientClip): void {
    const { mashAsset: mashMedia, actions } = this
    assertMashAsset(mashMedia)

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

  removeTrack(track: Track): void {
    // TODO: create remove track action...
    console.debug(this.constructor.name, 'removeTrack coming soon...')
  }

  saved(temporaryIdLookup?: StringRecord): void {
    if (temporaryIdLookup) {
      const { mashAsset: mashMedia } = this
      assertTrue(mashMedia)

      Object.entries(temporaryIdLookup).forEach(([temporaryId, permanentId]) => {
        if (mashMedia.id === temporaryId) {
          mashMedia.id = permanentId
        } else if (this.media.installed(temporaryId)) {
          this.media.updateDefinitionId(temporaryId, permanentId)
        } else console.warn(this.constructor.name, 'saved could not find', temporaryId)
      })
    }
    this.actions.save()
    MovieMasher.eventDispatcher.dispatch(new CustomEvent(EventTypeAction))
  }

  selection: ClientClip | false = false

  get time(): Time { return this.mashAsset?.time || timeFromArgs(0, this.fps)}

  set time(value: Time) { this.goToTime(value) }

  get timeRange(): TimeRange {
    return this.mashAsset?.timeRange || timeRangeFromArgs(0, this.fps) 
  }

  undo(): void {
    const { canUndo } = this.actions
    if (canUndo) this.handleAction(this.actions.undo())
  }

  unload(): void {
    this.destroyMash()
   
  }
  // updateDefinition(definitionObject: MediaObject, definition?: Media): Promise<void> {
  //   const {id: newId, type: newType } = definitionObject
  //   const id = definitionObject.id || definition!.id
  //   assertPopulatedString(id)

  //   const target = definition || this.media.fromId(newId!)
  //   const { id: oldId } = target
  //   const idChanged = oldId !== id
  //   console.log(this.constructor.name, 'updateDefinition', idChanged, definitionObject)
  //   if (idChanged) {
  //     this.media.updateDefinitionId(target.id, id)
  //     console.log(this.constructor.name, 'updateDefinition called updateDefinitionId', target.id, id)

  //     Object.assign(target, definitionObject)
      
  //     if (isAsset(target)) {
  //       delete target.request.response
  //       if (isVideoMedia(target)) delete target.loadedVideo 
  //       if (isUpdatableDurationDefinition(target)) delete target.loadedAudio 
  //       if (isImageMedia(target)) delete target.loadedImage
  //     }    
  //   } 
  //   const { mashMedia } = this
  //   if (!(mashMedia && idChanged)) return Promise.resolve()
    
  //   const { tracks } = mashMedia
  //   const clips = tracks.flatMap(track => track.clips)
  //   clips.forEach(clip => {
  //     if (clip.containerId === oldId) clip.setValue(newId, 'containerId')
  //     if (clip.contentId === oldId) clip.setValue(newId, 'contentId')
  //   })
  //   return this.loadMashAndDraw()
  // }

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
