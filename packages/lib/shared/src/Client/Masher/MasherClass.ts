
import type { Action, Actions, ClientAsset, ClientAssetManager, ClientAssets, MashAddAssetsEvent, MashMoveClipEvent, MashRemoveTrackEvent, PreviewItems, PreviewItemsEvent, RectEvent, MashAssetEvent, TrackClipsEvent, ClipFromIdEvent, IconFromFrameEvent } from '@moviemasher/runtime-client'
import type { AssetCacheArgs, AssetObject, AssetObjects, AssetType, ClipObject, EventDispatcherListenerRecord, MashAssetObject, NumberEvent, Rect, Size, StringEvent, StringRecord, Time, TimeRange, Track } from '@moviemasher/runtime-shared'

import type { ClientAction } from '@moviemasher/runtime-client'
import type { AddClipActionObject, AddTrackActionObject, MoveClipActionObject, RemoveClipActionObject } from './Actions/Action/ActionTypes.js'
import type { MashIndex, Masher, MasherArgs } from '@moviemasher/runtime-client'

import type { ClientClip, ClientClips, ClientMashAsset } from '@moviemasher/runtime-client'

import { EventTypeClipFromId, EventTypeFrame, EventTypeIconFromFrame, EventTypeMashAddAssets, EventTypeMashAddTrack, EventTypeMashAsset, EventTypeMashMoveClip, EventTypeMashRemoveClip, EventTypeMashRemoveTrack, EventTypePreviewItems, EventTypeSelectClip, EventTypeTrackClips, MovieMasher, isClientAsset } from '@moviemasher/runtime-client'
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
import { assertSizeAboveZero, isSize, sizeAboveZero, sizeCeil, sizeCopy, sizeCover, sizeEven } from '../../Utility/SizeFunctions.js'

import { isLoadType } from '../../Setup/LoadType.js'
import {
  assertAboveZero, 
  assertPositive, assertTrue, isAboveZero,
  isPositive
} from '../../Shared/SharedGuards.js'

import { assertClientMashAsset, isClientMashAsset } from '../Mash/ClientMashGuards.js'
import { svgDefsElement, svgPatch, svgPatternElement, svgPolygonElement, svgSvgElement, svgUrl } from '../SvgFunctions.js'
import { CurrentIndex, LastIndex, NextIndex } from '../../Setup/Constants.js'
import { assertClip, isClip } from '../../Shared/Mash/Clip/ClipFunctions.js'
import { idGenerate, idGenerateString, idIsTemporary, idTemporary } from '../../Utility/IdFunctions.js'
import { PointZero } from '../../Utility/PointConstants.js'
import { isPoint, pointCopy } from '../../Utility/PointFunctions.js'
import { rectsEqual } from '../../Utility/RectFunctions.js'
import { isChangeAction } from './Actions/Action/ActionFunctions.js'
import { ActionsClass } from './Actions/ActionsClass.js'
import { colorFromRgb, colorRgbDifference, colorToRgb } from '../../Helpers/Color/ColorFunctions.js'

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
    this.listeners[EventTypeTrackClips] = this.handleTrackClips.bind(this)
    this.listeners[EventTypeClipFromId] = this.handleClipFromId.bind(this)
    this.listeners[EventTypeIconFromFrame] = this.handleIconFromFrame.bind(this)

    
    MovieMasher.eventDispatcher.listenersAdd(this.listeners)

    if (mash) this.load(mash)
  }

  actions: Actions

  private addAssets(asset: ClientAsset | ClientAssets, editorIndex?: MashIndex): Promise<ClientAssets> {
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

  private addAssetObjects(objects: AssetObject | AssetObjects, editorIndex?: MashIndex): Promise<ClientAssets> {
    // console.log(this.constructor.name, 'addMediaObjects')
    const array = arrayFromOneOrMore(objects) 
    if (!array.length) {
      console.log(this.constructor.name, 'addMediaObjects NO OBJECTS', objects, editorIndex)
      return Promise.resolve([])
    }
    const promises = array.map(object => this.media.assetPromise(object))

    return Promise.all(promises).then(assets => {
      const clientAssets = assets.filter<ClientAsset>(isClientAsset)
      return this.addAssets(clientAssets, editorIndex)
    })  
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

  private clipFromId(clipId: string): ClientClip | undefined {
    const { mashAsset } = this
    if (!(mashAsset && clipId)) return

    const { tracks } = mashAsset
    for (const track of tracks) {
      const { clips } = track
      const clip = clips.find(clip => clip.id === clipId)
      if (clip) return clip
    }
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
    const { mashAsset } = this
    if (mashAsset) {
      this.paused = true
      mashAsset.destroy() 
      delete this._mashAsset 
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
    const { mashAsset } = this
    if (!mashAsset) return
    
    if (isClientMashAsset(mashAsset)) {
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
    } 

    this.selection = action.selection

    // console.log(this.constructor.name, 'handleAction', this.selection.selectTypes, selection)

    const promise = mashAsset.reload() || Promise.resolve()
    
    promise.then(() => {
      this.dispatchDrawLater()
      // console.log(this.constructor.name, 'handleAction', type)
      MovieMasher.eventDispatcher.dispatch(new CustomEvent(EventTypeAction, { detail: { action }}))
    })
  }

  private dispatchDrawLater(): void {
    // console.log(this.constructor.name, 'dispatchDrawLater')
    if (this.drawTimeout || !this.mashAsset?.loading) return
  
    this.drawTimeout = setTimeout(() => {
      MovieMasher.eventDispatcher.dispatch(new CustomEvent(EventTypeDraw))
      delete this.drawTimeout
    }, 10)
  
  }

  handleAddAssets(event: MashAddAssetsEvent) {
    const { detail } = event
    const { mashIndex, assetObjects } = detail
    console.log(this.constructor.name, 'handleAddAssets...')
    detail.promise = this.addAssetObjects(assetObjects, mashIndex)
    // console.log(this.constructor.name, 'handleAddAssets!')
    event.stopImmediatePropagation()
  }

  handleAddTrack(event: CustomEvent) {
    this.addTrack()
    event.stopImmediatePropagation()
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

  private handleFrame(event: NumberEvent) {
    this.goToTime(timeFromArgs(event.detail, this.mashAsset!.quantize)) 
  }

  private backgroundNode = (size: Size, patternedSize: Size, spacing = 0) => {
    const { width, height } = size
    const { color: fill } = this.mashAsset!
    const rgb = colorToRgb(fill)
    const differenceRgb = colorRgbDifference(rgb)
    const forecolor = colorFromRgb(differenceRgb)
    const framePolygon = svgPolygonElement(size, '', fill)
    const spaceRect = { 
      x: width, y: 0,
      width: spacing, height, 
    }
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
    const viewerSize: Size = this.rect
    
    assertSizeAboveZero(viewerSize, 'viewerSize')

    const ratio = viewerSize.width / viewerSize.height
    return height * ratio
  }


  private handleIconFromFrame(event: IconFromFrameEvent) {
    const { detail } = event
    const { clipId, gap, scale, clipSize } = detail

    const size = this.clipSize(clipSize)

    const clip = this.clipFromId(clipId)
    if (!clip) return

    const { imageSize } = this.mashAsset!
    assertSizeAboveZero(imageSize, 'track.mash.imageSize')

    const frameSize = sizeEven(sizeCover(imageSize, size, true))
    detail.background = this.backgroundNode(frameSize, size, gap)
    detail.promise = clip.clipIcon(frameSize, size, scale, gap)
  }

  private handleMoveClip(event: MashMoveClipEvent) {
    const { selection: clip } = this
    assertClip(clip)

    const { detail: mashIndex } = event
    this.move(clip, mashIndex)
    event.stopImmediatePropagation()
  }

  private loadMashAssetObject(assetObject: AssetObject): Promise<MashAssetObject> {
    const { source } = assetObject
    // simply return object promise if it is already a mash
    if (source === SourceMash) return Promise.resolve(assetObject)
    
    // otherwise, load asset so we can create a clip with it
    return MovieMasher.assetManager.assetPromise(assetObject).then(asset => {
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
    })
  }

  handlePreviewItems(event: PreviewItemsEvent) {
    const { detail } = event
    const { disabled } = detail
    // console.log(this.constructor.name, 'handlePreviewItems', disabled)

    detail.promise = this.previewItems(!disabled)
    event.stopImmediatePropagation()
  }

  handleRemoveClip(event: StringEvent) {
    const { detail: clipId } = event
    const clip = this.clipFromId(clipId)
    if (clip) {
      this.removeClip(clip)
      event.stopImmediatePropagation()
    }
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

  private handleSelectClip(event: StringEvent) {
    this.selection = this.clipFromId(event.detail) || false
    this.redraw()
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
    return this.loadMashAssetObject(data).then(mashMediaObject => {
      return this.mashAssetObjectLoadPromise(mashMediaObject).then(() => {
        const { type } = mashMediaObject
        const { rect } = this
        if (!(sizeAboveZero(rect) || type === TypeAudio)) {
          return Promise.resolve()
        }
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
    if (this._mashAsset === value) return

    this.destroyMash()
    this._mashAsset = value

    const event: MashAssetEvent = new CustomEvent(EventTypeMashAsset, { detail: value })
    MovieMasher.eventDispatcher.dispatch(event)
  }

  private mashAssetObjectLoadPromise(object: MashAssetObject): Promise<void> {
    // console.log(this.constructor.name, 'mashMediaObjectLoadPromise', object)
  
    const { rect, buffer, loop } = this
    const assetObject: MashAssetObject = {
      ...object, size: sizeCopy(rect), buffer, loop, 
    }
    return this.media.assetPromise(assetObject).then(asset => {
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
    })
  }
  get media(): ClientAssetManager {
    return MovieMasher.assetManager
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
