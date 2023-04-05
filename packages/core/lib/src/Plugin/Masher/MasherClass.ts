import {
  StringRecord} from '../../Types/Core.js'
import {PreviewItems} from '../../Helpers/Svg/Svg.js'
import {sizeCopy, sizeAboveZero, assertSizeAboveZero, SizeZero, isSize} from '../../Utility/Size.js'
import {Media, MediaObject, MediaObjects, MediaArray} from '../../Media/Media.js'
import {assertMashMedia, isMashMedia, MashMedia, MashAndMediaObject, Movable, Movables, MashMediaObject, MashMasherArgs} from '../../Media/Mash/Mash.js'
import {Emitter} from '../../Helpers/Emitter.js'
import {Time, TimeRange} from '../../Helpers/Time/Time.js'
import {
  timeFromArgs, timeFromSeconds, timeRangeFromArgs} from '../../Helpers/Time/TimeUtilities.js'
import {assertEffect} from '../../Media/Effect/Effect.js'
import {assertTrack, Track} from '../../Media/Mash/Track/Track.js'
import {Default} from '../../Setup/Default.js'
import {
  ActionType, EventType, MasherAction, TypeAudio, TypeVideo
} from '../../Setup/Enums.js'
import {isLoadType} from '../../Setup/LoadType.js'
import {
  assertAboveZero, assertObject, assertPopulatedObject, isPositive,
  assertPositive, assertTrue, isAboveZero, isArray, 
  isBoolean, isNumber} from '../../Utility/Is.js'
import {
  ClipOrEffect, Masher, MasherArgs, MashIndex, MashingType, isMashingType,
} from './Masher.js'
import {editorSelectionInstance} from './EditorSelection/EditorSelectionFactory.js'

import {EditorSelection, EditorSelectionObject} from './EditorSelection/EditorSelection.js'
import {Action, ActionOptions} from './Actions/Action/Action.js'
import {ChangeAction} from './Actions/Action/ChangeAction.js'
import {Actions} from './Actions/Actions.js'

import {mashMedia} from '../../Media/Mash/MashFactory.js'

import {MediaCollection} from '../../Media/Mash/MediaCollection/MediaCollection.js'
import {assertClip, isClip, ClipObject, Clip, Clips} from '../../Media/Mash/Track/Clip/Clip.js'
import {clipInstance} from '../../Media/Mash/Track/Clip/ClipFactory.js'
import {assertContent} from '../../Media/Content/ContentFunctions.js'
import {svgSvgElement, svgPolygonElement, svgPatch} from '../../Helpers/Svg/SvgFunctions.js'
import {idIsTemporary, idTemporary} from '../../Utility/Id.js'
import {PreloadOptions} from '../../Base/Code.js'
import {Rect, rectsEqual} from '../../Utility/Rect.js'
import {isPoint, pointCopy, PointZero} from '../../Utility/Point.js'
import {MoveActionOptions} from './Actions/Action/MoveAction.js'
import {CurrentIndex, LastIndex, NextIndex} from '../../Setup/Constants.js'

type Timeout = ReturnType<typeof setTimeout>

export class MasherClass implements Masher {
  constructor(args: MasherArgs) {
    const {
      autoplay,
      precision,
      loop,
      fps,
      volume,
      buffer,
      mashingType,
      readOnly,
      dimensions,
      mash,
      patchSvg,
      eventTarget
    } = args
    if (patchSvg) svgPatch(patchSvg)
    this.eventTarget = eventTarget || new Emitter()

    const point = isPoint(dimensions) ? pointCopy(dimensions) : PointZero
    const size = isSize(dimensions) ? sizeCopy(dimensions) : SizeZero
    this._rect = { ...point, ...size } 
    
    if (isMashingType(mashingType)) this._editType = mashingType
    if (readOnly) this.readOnly = true
    this.editing = !this.readOnly
    if (isBoolean(autoplay)) this.autoplay = autoplay
    if (isNumber(precision)) this.precision = precision
    if (isBoolean(loop)) this._loop = loop
    if (isNumber(fps)) this._fps = fps
    if (isNumber(volume)) this._volume = volume
    if (isNumber(buffer)) this._buffer = buffer
    
    this.actions = new Actions(this)
   
    if (mash) this.load(mash)
  }

  actions: Actions

  addEffect(effect: Movable, index?: number): void {
    const { selection, actions } = this
    const { clip, mash } = selection
    assertMashMedia(mash)
    assertClip(clip)
    
    const { content } = clip
    assertContent(content)

    const objects = content.effects as Movables
    const insertIndex = isPositive(index) ? index : objects.length
    const redoObjects = [...objects]
    redoObjects.splice(insertIndex, 0, effect)
    const options: MoveActionOptions = {
      objects,
      undoObjects: [...objects],
      redoObjects,
      type: ActionType.Move
    }
    actions.create(options)
    mash.draw()
  }

  addMedia(media: Media | MediaArray, editorIndex?: MashIndex): Promise<Media[]> {
    const mediaArray = isArray(media) ? media : [media]
    if (!mediaArray.length) return Promise.resolve([])
    console.log(this.constructor.name, 'addMedia', mediaArray.length, editorIndex)
    
    const installedMedia = this.media.install(mediaArray)
    const definitionTypes = installedMedia.map(media => media.type)
    this.eventTarget.emit(EventType.Added, { definitionTypes })

    if (!editorIndex) return Promise.resolve(installedMedia)
    
    const clips = installedMedia.map(definition => {
      const { id, type } = definition
      const clipObject: ClipObject = {}
      if (definition.isVector) clipObject.containerId = id
      else clipObject.contentId = id
  
      if (type === TypeAudio) clipObject.containerId = ''
      return clipInstance(clipObject)
    })

    const { clip: frameOrIndex = -1, track: trackIndex = 0 } = editorIndex

    const [firstClip] = clips

    const promise = this.assureMash(installedMedia)
    return promise.then(() => {
      const { mashMedia: mash } = this
      assertMashMedia(mash)
    
      const { tracks } = mash
      const { length } = tracks
      assertAboveZero(length)

      const trackPositive = isPositive(trackIndex)
      const track = trackPositive ? tracks[trackIndex] : undefined
      const trackClips = track?.clips || []
      let index = trackIndex
      if (index < 0) index = length
      else if (index >= length) index = length - 1

      const dense = track?.dense 

      const redoSelection: EditorSelectionObject = { 
        ...this.selection.object, clip: firstClip 
      }
      const createTracks = trackPositive ? 0 : clips.length
      const options: ActionOptions = {
        clips, type: ActionType.AddClipToTrack, trackIndex,
        redoSelection, createTracks
      }
      const clipIndex = this.clipIndex(frameOrIndex, trackClips, mash, dense)
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
    }).then(() => installedMedia) 
  }

  private clipIndex(frameOrIndex: number, clips: Clips, mash: MashMedia, dense?: boolean): number {
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

  addMediaObjects(objects: MediaObject | MediaObjects, editorIndex?: MashIndex): Promise<Media[]> {
    const array = isArray(objects) ? objects : [objects]
    if (!array.length) return Promise.resolve([])
    
    const mediaArray = this.media.define(array)
    return this.addMedia(mediaArray, editorIndex)
  }
  
  addTrack(): void {
    const { mashMedia: mash } = this
    const redoSelection: EditorSelectionObject = { mash }
    this.actions.create({ 
      redoSelection, type: ActionType.AddTrack, createTracks: 1 
    })
  }

  private assureMash(media: MediaArray) {

    const { mashMedia } = this
    console.log(this.constructor.name, 'assureMash', !!mashMedia)
    if (!isMashMedia(mashMedia)) {
      const [firstMedia] = media
      const { label } = firstMedia
      const mash: MashAndMediaObject = { label, media: [], id: idTemporary() }
      return this.load(mash)
    }
    return Promise.resolve()
  }

  autoplay = Default.editor.autoplay

  private _buffer = Default.editor.buffer
  get buffer(): number { return this._buffer }
  set buffer(value: number) {
    const number = Number(value)
    if (this._buffer !== number) {
      this._buffer = number
      const { mashMedia } = this
      if (mashMedia) mashMedia.buffer = number
    }
  }

  can(masherAction: MasherAction): boolean {
    const { selection } = this
    const { track, clip, mash } = selection
    switch (masherAction) {
      case MasherAction.Save: return this.actions.canSave
      case MasherAction.Undo: return this.actions.canUndo
      case MasherAction.Redo: return this.actions.canRedo
      case MasherAction.Remove: return !!(clip || track)
      case MasherAction.Render: return !this.actions.canSave && !!(mash?.id && !idIsTemporary(mash.id))
    }
  }

  private clearActions(): void {
    if (!this.actions.instances.length) return

    this.actions = new Actions(this)
    this.eventTarget.emit(EventType.Action)
  }

  get clips(): Clips { return this.mashMedia?.clips || [] }

  create() { return this.load({ id: idTemporary() }) }

  get currentTime(): number {
    const { mashMedia: mash } = this
    if (mash && mash.drawnTime) return mash.drawnTime.seconds
    return 0
  }

  get definitions(): Media[] {
    const { mashMedia } = this
    if (!mashMedia) return []
    
    return mashMedia.definitionIds.map(id => this.media.fromId(id))
  }

  get definitionsUnsaved(): Media[] {
    const { definitions } = this

    return definitions.filter(definition => {
      const { type, id } = definition
      if (!isLoadType(type)) return false

      return idIsTemporary(id)
    })
  }

  private destroy() {  
    const { mashMedia } = this
    if (mashMedia) {
      this.paused = true
      mashMedia.destroy() 
      delete this.mashMedia 
      this.clearActions()
      this.selection.clear()
      this.media.undefineAll()
    }
  }

  dragging = false

  private drawTimeout?: Timeout

  get duration(): number { return this.mashMedia?.duration || 0 }

  _editType?: MashingType
  get mashingType(): MashingType {
    return this._editType ||= TypeVideo
  }

  editing: boolean 

  private get endTime(): Time {
    const { mashMedia: mash } = this
    return mash ? mash.endTime.scale(this.fps, 'floor') : timeFromArgs()
  }

  eventTarget: Emitter

  private _fps = Default.editor.fps
  get fps(): number {
    return this._fps || this.mashMedia?.quantize || Default.editor.fps
  }
  set fps(value: number) {
    const number = Number(value)
    // setting to zero means fallback to mash rate
    if (this._fps !== number) {
      this._fps = number
      this.eventTarget.emit(EventType.Fps)
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

    const promise = this.mashMedia?.seekToTime(timeFromArgs(goFrame, fps))
    if (promise) return promise

    return Promise.resolve()
  }

  handleAction(action: Action): void {
    const { mashMedia } = this
    assertTrue(mashMedia)
    // console.log(this.constructor.name, 'handleAction')
    const { selection } = action
    const { mash } = selection
  
    if (isMashMedia(mash)) {
      mash.clearPreview()
      if (action instanceof ChangeAction) {
        const { property, target } = action
        switch(property) {
          case 'gain': {
            if (isClip(target)) {
              mash.composition.adjustClipGain(target, mash.quantize)
            }    
            break
          }
        }
      }
    } 

    this.selection.object = selection

    // console.log(this.constructor.name, 'handleAction', this.selection.selectTypes, selection)

    const promise = mashMedia.reload() || Promise.resolve()
    
    promise.then(() => {
      if (!mash) this.handleDraw()
      // console.log(this.constructor.name, 'handleAction', type)
      this.eventTarget.emit(EventType.Action, { action })
    })
  }

  private handleDraw(event?: Event): void {
    // console.log(this.constructor.name, 'handleDraw')
    if (this.drawTimeout || !this.mashMedia?.loading) return

      this.drawTimeout = setTimeout(() => {
        // console.log(this.constructor.name, 'handleDraw drawTimeout')
        this.eventTarget.dispatch(EventType.Draw)
        delete this.drawTimeout
      }, 10)
    
  }

  load(data: MashMediaObject): Promise<void> {
    this.mashMediaObject = data
    // console.log(this.constructor.name, 'load', data)
    return this.loadMashMediaObject()
  }

  private loadMashMediaObject(): Promise<void> {
    const { rect, mashMediaObject } = this
    assertObject(mashMediaObject, 'mashMediaObject')
    const { kind } = mashMediaObject

    if (!sizeAboveZero(rect)) {
      if (kind !== TypeAudio) return Promise.resolve()
    }

    delete this.mashMediaObject

    return this.mashMediaObjectLoadPromise(mashMediaObject).then(() => {
      return this.goToTime().then(() => {
        const { mashMedia: mash } = this
        if (isMashMedia(mash)) mash.clearPreview()
        if (this.autoplay) this.paused = false
      })
    })
  }

  private loadMashAndDraw(): Promise<void> {
    const { mashMedia } = this
    assertMashMedia(mashMedia)

    const args: PreloadOptions = { editing: true, visible: true }
    if (!this.paused) args.audible = true
    return mashMedia.loadPromise(args).then(() => { mashMedia.draw() })
  }

  mashMedia: MashMedia | undefined 
  // { return this.mashMedia }

  // private mashMedia?: MashMedia
  // private get mashMediaUNUSED(): MashMedia {
  //   console.trace('mashMedia')
  //   return this.mashMedia ||= this.mashMediaInitialize
  // }
  // private get mashMediaInitialize(): MashMedia {
  //   const { mashMediaObject = { id: idTemporary() } } = this

  //   return this.mashMediaFromObject(mashMediaObject)
  // }

  private mashMediaFromObject(mashAndMedia: MashMediaObject): MashMedia {
    const { rect, buffer, gain, loop } = this
    const editorArgs: MashMasherArgs = {
      ...mashAndMedia, 
      mediaCollection: this.media, 
      masher: this, emitter: this.eventTarget,
      size: sizeCopy(rect),
      buffer, gain, loop
    }
    this.destroy()
    return this.mashMedia = mashMedia(mashAndMedia, editorArgs)
  }

  private mashMediaObject?: MashMediaObject

  private mashMediaObjectLoadPromise(object: MashMediaObject): Promise<void> {
    const mash = this.mashMediaFromObject(object)
    return mash.loadPromise({ editing: true, visible: true }).then(() => {
      this.selection.set(mash)
      this.handleDraw() 
    })
  }

  private _loop = Default.editor.loop
  get loop(): boolean { return this._loop }
  set loop(value: boolean) {
    const boolean = !!value
    this._loop = boolean
    const { mashMedia: mash } = this
    if (mash) mash.loop = boolean
  }


  media = new MediaCollection()

  move(object: ClipOrEffect, editorIndex: MashIndex = {}): void {
    assertPopulatedObject(object, 'clip')

    if (isClip(object)) {
      this.moveClip(object, editorIndex)
      return
    }
    assertEffect(object)

    const { clip: frameOrIndex = 0 } = editorIndex
    this.moveEffect(object, frameOrIndex)
  }

  moveClip(clip: Clip, editorIndex: MashIndex = {}): void {
    assertClip(clip)

    const { clip: frameOrIndex = 0, track: track = 0} = editorIndex
    assertPositive(frameOrIndex)

    const { mashMedia: mash } = this
    assertMashMedia(mash)

    const { tracks } = mash

    const { trackNumber: undoTrack } = clip
    const options: any = {
      clip,
      trackIndex: track,
      undoTrackIndex: undoTrack,
      type: ActionType.MoveClip
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

  moveEffect(effect: Movable, index?: number): void {
    const { selection, actions } = this
    const { clip, mash } = selection
    assertClip(clip)
    assertMashMedia(mash)

    const { content } = clip
    assertContent(content)

    const objects = content.effects as Movables
    const currentIndex = objects.indexOf(effect)
    const posIndex = isPositive(index) ? index : objects.length
    const spliceIndex = currentIndex < posIndex ? posIndex - 1 : posIndex
    const redoObjects = objects.filter(e => e !== effect)
    redoObjects.splice(spliceIndex, 0, effect)
    const options: MoveActionOptions = {
      type: ActionType.Move, 
      objects, 
      undoObjects: [...objects], 
      redoObjects, 
    }
    actions.create(options)
    mash.draw()
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
      const { mashMedia: mash } = this
      if (mash) mash.gain = this.gain
    }
  }

  pause(): void { this.paused = true }

  get paused(): boolean {
    const { mashMedia: mash } = this
    return mash ? mash.paused : true
  }
  set paused(value: boolean) {
    const { mashMedia: mash } = this
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

  readOnly = false

  private _rect: Rect
  get rect(): Rect { return this._rect }
  set rect(value: Rect) {
    assertSizeAboveZero(value)
    if (rectsEqual(this.rect, value)) return

    this._rect = value
    const { mashMediaObject } = this


    // console.log(this.constructor.name, 'rect', rect, '=>', value, !!editedData)
    
    const promise = mashMediaObject ? this.loadMashMediaObject() : Promise.resolve()
    promise.then(() => {
      const { mashMedia, rect, eventTarget } = this
      if (!mashMedia) return
 
      mashMedia.imageSize = sizeCopy(rect)
      eventTarget.emit(EventType.Resize, { rect: value })
      this.redraw()
    })
  }

  redo(): void { if (this.actions.canRedo) this.handleAction(this.actions.redo()) }

  redraw(): void {
    const { mashMedia } = this
    if (!mashMedia) return
    mashMedia.clearPreview()
    this.eventTarget.dispatch(EventType.Draw)
  }

  removeClip(clip: Clip): void {
    const { mashMedia } = this
    assertMashMedia(mashMedia)

    const { track } = clip
    const { clip: _, ...redoSelection } = this.selection

    const options = {
      redoSelection,
      clip,
      track,
      index: track.clips.indexOf(clip),
      type: ActionType.RemoveClip
    }
    this.actions.create(options)
  }

  removeEffect(effect: Movable): void {
    const { selection, actions } = this
    const { clip, mash } = selection
    assertClip(clip)
    assertMashMedia(mash)

    const { content } = clip
    assertContent(content)
    const objects = content.effects as Movables
    const options: MoveActionOptions = {
      type: ActionType.Move,
      objects: objects,
      undoObjects: [...objects],
      redoObjects: objects.filter(other => other !== effect),
    }
    actions.create(options)
    mash.draw()
  }

  removeTrack(track: Track): void {
    // TODO: create remove track action...
    console.debug(this.constructor.name, 'removeTrack coming soon...')
  }

  saved(temporaryIdLookup?: StringRecord): void {
    if (temporaryIdLookup) {
      const { mashMedia } = this
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
    this.eventTarget.emit(EventType.Action)
  }

  _selection?: EditorSelection
  get selection() { 
    if (this._selection) return this._selection 

    const selection = editorSelectionInstance()
    selection.editor = this
    return this._selection = selection
  }

  previewItems(enabled?: boolean): Promise<PreviewItems> {
    const { mashMedia, rect } = this
    const color = mashMedia ? mashMedia.color : undefined      
    const size = sizeCopy(rect)
    const colorElement = svgSvgElement(size, svgPolygonElement(size, '', color))
    const promise = Promise.resolve([colorElement])
    if (!mashMedia) return promise
    
    const editor = (enabled && this.paused) ? this : undefined
    return promise.then(elements => {
      return mashMedia.previewItemsPromise(editor).then(items => {
        return [...elements, ...items]
      })
    })
  }

  get time(): Time { return this.mashMedia?.time || timeFromArgs(0, this.fps)}

  set time(value: Time) { this.goToTime(value) }

  get timeRange(): TimeRange {
    return this.mashMedia?.timeRange || timeRangeFromArgs(0, this.fps) 
  }

  undo(): void {
    const { canUndo } = this.actions
    if (canUndo) this.handleAction(this.actions.undo())
  }

  unload(): void {
    this.destroy()
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
      
  //     if (isMedia(target)) {
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

      const { mashMedia: mash } = this
      if (mash) mash.gain = this.gain
      this.eventTarget.emit(EventType.Volume)
    }
  }
}
