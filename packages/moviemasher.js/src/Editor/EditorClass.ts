import {
  PreviewItems,
  StringObject, Timeout, UnknownObject} from "../declarations"
import { sizeCopy, sizeAboveZero, assertSizeAboveZero, SizeZero, isSize } from "../Utility/Size"
import { Definition, DefinitionObject, DefinitionObjects, isDefinitionObject } from "../Definition/Definition"
import { Edited, isEdited } from "../Edited/Edited"
import { assertMash, isMash, Mash, MashAndDefinitionsObject, Movable, Movables } from "../Edited/Mash/Mash"
import { Emitter } from "../Helpers/Emitter"
import { Time, TimeRange } from "../Helpers/Time/Time"
import {
  timeFromArgs, timeFromSeconds, timeRangeFromArgs} from "../Helpers/Time/TimeUtilities"
import { assertEffect, Effect } from "../Media/Effect/Effect"
import { assertTrack, Track } from "../Edited/Mash/Track/Track"
import { BrowserLoaderClass } from "../Loader/BrowserLoaderClass"
import { Default } from "../Setup/Default"
import {
  ActionType, assertDefinitionType, assertEditType, DefinitionType, EditType, 
  isDefinitionType, EventType, isEditType, isLoadType, LayerType, MasherAction
} from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import {
  assertAboveZero, assertObject, assertPopulatedObject, isPositive,
  assertPopulatedString, assertPositive, assertTrue, isAboveZero, isArray, 
  isBoolean, isNumber, isPopulatedString} from "../Utility/Is"
import {
  assertMashData, CastData, ClipOrEffect, EditedData, Editor, EditorArgs, 
  EditorIndex, isCastData, MashData,
} from "./Editor"
import { editorSelectionInstance } from "./EditorSelection/EditorSelectionFactory"

import { EditorSelection, EditorSelectionObject } from "./EditorSelection/EditorSelection"
import { Action, ActionOptions } from "./Actions/Action/Action"
import { ChangeAction } from "./Actions/Action/ChangeAction"
import { Actions } from "./Actions/Actions"

import { Factory } from "../Definitions/Factory"
import { assertCast, castInstance, isCast } from "../Edited/Cast/CastFactory"
import { mashInstance } from "../Edited/Mash/MashFactory"
import {
  assertLayer, assertLayerFolder, assertLayerMash
} from "../Edited/Cast/Layer/LayerFactory"

import { Layer, LayerAndPosition, LayerObject } from "../Edited/Cast/Layer/Layer"
import { Defined } from "../Base/Defined"
import { assertClip, isClip, ClipObject, Clip, Clips } from "../Edited/Mash/Track/Clip/Clip"
import { clipDefault } from "../Edited/Mash/Track/Clip/ClipFactory"
import { assertContent, isContentDefinition } from "../Content/Content"
import { DataPutRequest } from "../Api/Data"
import { PreviewOptions } from "../Edited/Mash/Preview/Preview"
import { svgElement, svgPolygonElement } from "../Utility/Svg"
import { idGenerate, idIsTemporary } from "../Utility/Id"
import { Cast } from "../Edited/Cast/Cast"
import { PreloadOptions } from "../MoveMe"
import { arrayUnique } from "../Utility/Array"
import { isUpdatableDurationDefinition } from "../Mixin/UpdatableDuration"
import { ActivityType } from "../Utility/Activity"
import { isVideoDefinition } from "../Media/Video/Video"
import { isImageDefinition } from "../Media/Image/Image"
import { Rect, rectsEqual } from "../Utility/Rect"
import { isPoint, pointCopy, PointZero } from "../Utility/Point"
import { MoveEffectActionObject, MoveEffectOptions } from "./Actions/Action/MoveEffectAction"
import { MoveActionOptions } from "./Actions/Action/MoveAction"

export class EditorClass implements Editor {
  constructor(args: EditorArgs) {
    const {
      autoplay,
      precision,
      loop,
      fps,
      volume,
      buffer,
      endpoint,
      preloader,
      editType,
      readOnly,
      dimensions,
      edited,
    } = args
    const point = isPoint(dimensions) ? pointCopy(dimensions) : PointZero
    const size = isSize(dimensions) ? sizeCopy(dimensions) : SizeZero
    this._rect = { ...point, ...size } 
    
    if (isEditType(editType)) this._editType = editType
    if (readOnly) this.readOnly = true
    this.editing = !this.readOnly
    if (isBoolean(autoplay)) this.autoplay = autoplay
    if (isNumber(precision)) this.precision = precision
    if (isBoolean(loop)) this._loop = loop
    if (isNumber(fps)) this._fps = fps
    if (isNumber(volume)) this._volume = volume
    if (isNumber(buffer)) this._buffer = buffer
    
    this.actions = new Actions(this)
    this.preloader = preloader || new BrowserLoaderClass(endpoint)
    if (edited) this.load(edited)
  }

  actions: Actions

  add(object: DefinitionObject | DefinitionObjects, editorIndex?: EditorIndex): Promise<Definition[]> {
    const objects = isArray(object) ? object : [object]
    if (!objects.length) return Promise.resolve([])
    
    const definitions = objects.map(definitionObject => {
      assertPopulatedObject(definitionObject)
    
      return Defined.fromObject(definitionObject)
    })
    if (!editorIndex) return Promise.resolve(definitions)
    
    const clips = definitions.map(definition => {
      const { id, type } = definition
      const clipObject: ClipObject = {}
      if (isContentDefinition(definition)) clipObject.contentId = id
      else clipObject.containerId = id

      if (type === DefinitionType.Audio) clipObject.containerId = ''
      return clipDefault.instanceFromObject(clipObject)
    })
    const options = { editing: true, duration: true }
    const unknownClips = clips.filter(clip => clip.intrinsicsKnown(options))
    const files = unknownClips.flatMap(clip => clip.intrinsicGraphFiles(options))
    const { preloader } = this
    const promise = preloader.loadFilesPromise(files)
    return promise.then(() => {
      return this.addClip(clips, editorIndex).then(() => definitions)
    })
  }

  addClip(clip: Clip | Clips, editorIndex: EditorIndex): Promise<void> {
    const { clip: frameOrIndex = 0, track: trackIndex = 0 } = editorIndex
    const clips = isArray(clip) ? clip : [clip]
    const [firstClip] = clips
    if (!firstClip) return Promise.resolve()

    const promise = this.assureMash(clip)
    return promise.then(() => {
      const { mash } = this.selection
      assertMash(mash)
    
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
      
      if (dense) {
        const insertIndex = isPositive(frameOrIndex) ? frameOrIndex : trackClips.length
        options.insertIndex = insertIndex
      } else {
        if (createTracks) options.redoFrame = isPositive(frameOrIndex) ? frameOrIndex : 0
        else {
          assertTrack(track)
          const frame = isPositive(frameOrIndex) ? frameOrIndex : track.frames
          options.redoFrame = track.frameForClipNearFrame(firstClip, frame)
        }
      }
      this.actions.create(options)
      return this.loadMashAndDraw()  
    })
    
  }

  addEffect(effect: Movable, index?: number): void {
    const { selection, actions } = this
    const { clip, mash } = selection
    assertMash(mash)
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

  addFiles(files: File[], editorIndex?: EditorIndex): Promise<Definition[]> {
    const { preloader, eventTarget, rect } = this
    let promise: Promise<DefinitionObjects> = Promise.resolve([])
    preloader.filePromises(files, rect).forEach(filePromise => {
      promise = promise.then(objects => {
        const id = idGenerate('activity')
        const info: UnknownObject = { id, type: ActivityType.Analyze }
        eventTarget.emit(EventType.Active, info)
        return filePromise.then(definitionOrError => {
          const activityInfo = { ...info }
          const { label } = definitionOrError
          activityInfo.label = label
          if (isDefinitionObject(definitionOrError)) {
            objects.push(definitionOrError)
            const { url, type } = definitionOrError
            assertPopulatedString(url)

            // console.log(this.constructor.name, "addFiles.filePromises", url, type)
            const info = preloader.info(url)
            assertObject(info)

            activityInfo.type = ActivityType.Complete
            activityInfo.value = info
          } else {
            const { error, value } = definitionOrError
            activityInfo.type = ActivityType.Error
            activityInfo.error = error
            activityInfo.value = value
          }
          eventTarget.emit(EventType.Active, activityInfo)
          return objects
        })
      })
    })
    return promise.then(objects => {
      return this.add(objects, editorIndex).then(definitions => {
        if (definitions.length) {
          const definitionTypes = arrayUnique(definitions.map(object => object.type))
          this.eventTarget.emit(EventType.Added, { definitionTypes })
        }
        return definitions
      })

     
    })
  }

  addFolder(label?: string, layerAndPosition?: LayerAndPosition): void {
    const { cast } = this.selection
    assertCast(cast)

    const layer = cast.createLayer({ type: LayerType.Folder, label })
    assertLayerFolder(layer)

    const redoSelection: EditorSelectionObject = { cast, layer }
    const options = { 
      type: ActionType.AddLayer, redoSelection, layerAndPosition 
    }
    this.actions.create(options)
  }

  addMash(mashAndDefinitions?: MashAndDefinitionsObject, layerAndPosition?: LayerAndPosition): void {
    const { cast } = this.selection
    assertCast(cast)

    const mashObject = mashAndDefinitions?.mashObject || {}
    // console.log(this.constructor.name, "addMash", mashObject)
    const definitionObjects = mashAndDefinitions?.definitionObjects || []

    Defined.define(...definitionObjects)
    const layerObject: LayerObject = { type: LayerType.Mash, mash: mashObject }
    const layer = cast.createLayer(layerObject)
    assertLayerMash(layer)

    const { mash } = layer
    this.configureMash(mash)
    const redoSelection: EditorSelectionObject = { cast, layer, mash }
    const options = { 
      type: ActionType.AddLayer, redoSelection, layerAndPosition 
    }
    this.actions.create(options)
  }

  addTrack(): void {
    const { mash, cast } = this.selection
    const redoSelection: EditorSelectionObject = { mash, cast }
    this.actions.create({ 
      redoSelection, type: ActionType.AddTrack, createTracks: 1 
    })
  }

  private assureMash(clip: Clip | Clips) {
    const { selection, editType } = this
    const { mash } = selection
    
    if (!isMash(mash)) {
      const first = isArray(clip) ? clip[0] : clip
      const { label } = first.content.definition
      const mashObject = { label }
      if (editType === EditType.Mash) return this.load({ mash: mashObject})
      this.addMash({ mashObject, definitionObjects: [] })
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
      const { edited } = this
      if (edited) edited.buffer = number
    }
  }

  can(masherAction: MasherAction): boolean {
    const { selection } = this
    const { track, clip, mash, layer } = selection
    switch (masherAction) {
      case MasherAction.Save: return this.actions.canSave
      case MasherAction.Undo: return this.actions.canUndo
      case MasherAction.Redo: return this.actions.canRedo
      case MasherAction.Remove: return !!(clip || track || layer)
      case MasherAction.Render: return !this.actions.canSave && !!(mash?.id && !idIsTemporary(mash.id))
      default: throw Errors.argument + 'can'
    }
  }

  private castDestroy(): boolean {
    const { cast } = this.selection
    if (!cast) return false

    cast.destroy()
    this.preloader.flushFilesExcept()
    return true
  }

  private clearActions(): void {
    if (!this.actions.instances.length) return

    this.actions = new Actions(this)
    this.eventTarget.emit(EventType.Action)
  }

  get clips(): Clips { return this.selection.mash!.clips }

  compose(mash: Mash, frame: number, frames: number): void {
    console.log(this.constructor.name, "compose", mash.label, "FRAME", frame, "FRAMES", frames)

  }

  private configureCast(cast: Cast): Promise<void> {
    this.configureEdited(cast)
    return cast.loadPromise({ editing: true, visible: true }).then(() => {
      this.selection.set(cast)
      this.handleDraw() 
    })
  }

  private configureEdited(edited: Edited): void {
    edited.editor = this
    const { rect } = this
    if (sizeAboveZero(rect)) edited.imageSize = sizeCopy(rect)
    edited.emitter = this.eventTarget
  }

  private configureMash(mash: Mash): Promise<void> {
    mash.buffer = this.buffer
    mash.gain = this.gain
    mash.loop = this.loop
    this.configureEdited(mash)
    return mash.loadPromise({ editing: true, visible: true }).then(() => {
      this.selection.set(mash)
      this.handleDraw() 
    })
  }

  create() { this.load({ [this.editType]: {} }) }

  get currentTime(): number {
    const { mash } = this.selection
    if (mash && mash.drawnTime) return mash.drawnTime.seconds
    return 0
  }

  dataPutRequest(): Promise<DataPutRequest> {
    const { edited, editType } = this
    assertObject(edited)
    assertEditType(editType)

    // set edit's label if it's empty
    const { label } = edited 
    if (!isPopulatedString(label)) {
      const defaultLabel = Default[editType].label
      assertPopulatedString(defaultLabel, 'defaultLabel')
      edited.setValue(defaultLabel, 'label')
    }
  
    return edited.putPromise().then(() => {
      if (isMash(edited)) {
        return {
          mash: edited.toJSON(),
          definitionIds: edited.definitionIds
        }
      } 
      if (isCast(edited)) {
        return {
          cast: edited.toJSON(),
          definitionIds: Object.fromEntries(edited.mashes.map(mash => (
            [mash.id, mash.definitionIds]
          )))
        }
      }
      throw new Error(Errors.internal)
    })
  }

  define(objectOrArray: DefinitionObject | DefinitionObjects) {
    const objects = Array.isArray(objectOrArray) ? objectOrArray : [objectOrArray]
    objects.forEach(object => {
      const { id, type } = object
      assertPopulatedString(id, 'define id')

      if (Defined.fromId(id)) {
        // redefining...
        console.warn(this.constructor.name, "define NOT redefining", id)
        return
      }
      assertDefinitionType(type)

      const definition = Factory[type].definition(object)
      Defined.install(definition)
    })
  }

  get definitions(): Definition[] {
    const { mashes } = this

    const ids = [...new Set(mashes.flatMap(mash => mash.definitionIds))]
    const definitions = ids.map(id => Defined.fromId(id))
    return definitions
  }

  get definitionsUnsaved(): Definition[] {
    const { definitions } = this

    return definitions.filter(definition => {
      const { type, id } = definition
      if (!isLoadType(type)) return false

      return idIsTemporary(id)
    })
  }

  private destroy() { if (!this.castDestroy()) this.mashDestroy() }

  dragging = false

  private drawTimeout?: Timeout

  get duration(): number { return this.selection.mash?.duration || 0 }

  _editType?: EditType
  get editType(): EditType {
    if (!this._editType) this._editType = this.editingCast ? EditType.Cast : EditType.Mash
    return this._editType!
  }

  get edited(): Edited | undefined { return this.selection.cast || this.selection.mash }

  editedData?: EditedData

  editing: boolean 

  get editingCast(): boolean { return !!this.selection.cast }

  private get endTime(): Time {
    const { mash } = this.selection
    return mash ? mash.endTime.scale(this.fps, 'floor') : timeFromArgs()
  }

  eventTarget = new Emitter()

  private _fps = Default.editor.fps
  get fps(): number {
    return this._fps || this.selection.mash?.quantize || Default.editor.fps
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

    const promise = this.selection.mash?.seekToTime(timeFromArgs(goFrame, fps))
    if (promise) return promise

    return Promise.resolve()
  }

  handleAction(action: Action): void {
    const { edited } = this
    assertTrue(edited)
    // console.log(this.constructor.name, "handleAction")
    const { selection } = action
    const { mash } = selection
  
    if (isMash(mash)) {
      mash.clearPreview()
      if (action instanceof ChangeAction) {
        const { property, target } = action
        switch(property) {
          case "gain": {
            if (isClip(target)) {
              mash.composition.adjustClipGain(target, mash.quantize)
            }    
            break
          }
        }
      }
    } 

    this.selection.object = selection

    // console.log(this.constructor.name, "handleAction", this.selection.selectTypes, selection)

    const promise = edited.reload() || Promise.resolve()
    
    promise.then(() => {
      if (!mash) this.handleDraw()
      // console.log(this.constructor.name, "handleAction", type)
      this.eventTarget.emit(EventType.Action, { action })
    })
  }

  private handleDraw(event?: Event): void {
    // console.log(this.constructor.name, "handleDraw")
    if (this.drawTimeout || !this.edited?.loading) return

      this.drawTimeout = setTimeout(() => {
        // console.log(this.constructor.name, "handleDraw drawTimeout")
        this.eventTarget.dispatch(EventType.Draw)
        delete this.drawTimeout
      }, 10)
    
  }

  load(data: EditedData): Promise<void> {
    this.editedData = data
    // console.log(this.constructor.name, "load", data)
    return this.loadEditedData()
  }


  private loadCastData(data: CastData = {}) {
    const { cast: castObject = {}, definitions: definitionObjects = [] } = data
    Defined.undefineAll()
    Defined.define(...definitionObjects)

    this.eventTarget.trap(EventType.Draw, this.handleDraw.bind(this))

    const cast = castInstance(castObject, this.preloader)
    return this.configureCast(cast)
  }

  private loadEditedData(): Promise<void> {
    const { rect, editedData: data } = this
    if (!sizeAboveZero(rect)) {
      // console.log(this.constructor.name, "loadEditedData DEFFERING LOAD", rect)
      return Promise.resolve()
    }

    assertObject(data)
    delete this.editedData
    this.destroy()
    this.paused = true
    this.clearActions()
    this.selection.clear()
    
    // console.log(this.constructor.name, "loadEditedData LOADING", rect, data)
    if (isCastData(data)) return this.loadCastData(data)

    assertMashData(data)

    return this.loadMashData(data).then(() => {
      return this.goToTime().then(() => {
        const { edited: mash } = this
        if (isMash(mash)) mash.clearPreview()
        if (this.autoplay) this.paused = false
      })
    })
  }

  private loadMashAndDraw(): Promise<void> {
    const { mash } = this.selection
    if (!mash) throw new Error(Errors.selection)
    const args: PreloadOptions = { editing: true, visible: true }
    if (!this.paused) args.audible = true
    return mash.loadPromise(args).then(() => { mash.draw() })
  }

  private loadMashData(data: MashData = {}): Promise<void> {
    const { mash: mashObject = {}, definitions: definitionObjects = [] } = data
    // console.log(this.constructor.name, "loadMashData LOADING", mashObject, definitionObjects)
    Defined.undefineAll()
    Defined.define(...definitionObjects)
    const mash = mashInstance({ ...mashObject, preloader: this.preloader })
    this.mashDestroy()
    return this.configureMash(mash)
  }

  private _loop = Default.editor.loop
  get loop(): boolean { return this._loop }
  set loop(value: boolean) {
    const boolean = !!value
    this._loop = boolean
    const { mash } = this.selection
    if (mash) mash.loop = boolean
  }

  private mashDestroy(): boolean {
    const { mash } = this.selection
    if (!mash) return false

    mash.destroy()
    this.preloader.flushFilesExcept()
    return true
  }

  private get mashes(): Mash[] {
    const { edited } = this
    if (!edited) return []

    return isCast(edited) ? edited.mashes : [edited as Mash]
  }

  move(object: ClipOrEffect, editorIndex: EditorIndex = {}): void {
    assertPopulatedObject(object, 'clip')

    if (isClip(object)) {
      this.moveClip(object, editorIndex)
      return
    }
    assertEffect(object)

    const { clip: frameOrIndex = 0 } = editorIndex
    this.moveEffect(object, frameOrIndex)
  }

  moveClip(clip: Clip, editorIndex: EditorIndex = {}): void {
    assertClip(clip)

    const { clip: frameOrIndex = 0, track: track = 0} = editorIndex
    assertPositive(frameOrIndex)

    const { mash } = this.selection
    assertMash(mash)

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
    assertMash(mash)

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

  moveLayer(layer: Layer, layerAndPosition?: LayerAndPosition): void {
    const { cast } = this.selection
    assertCast(cast)
    assertLayer(layer)

    const redoSelection: EditorSelectionObject = { cast, layer }
    const options = { type: ActionType.MoveLayer, redoSelection, layerAndPosition }
    this.actions.create(options)
  }

  moveTrack(): void {
    // TODO: create remove track action...
    console.debug(this.constructor.name, "moveTrack coming soon...")
  }

  private _muted = false
  get muted(): boolean { return this._muted }
  set muted(value: boolean) {
    const boolean = !!value
    if (this._muted !== boolean) {
      this._muted = boolean
      const { mash } = this.selection
      if (mash) mash.gain = this.gain
    }
  }

  pause(): void { this.paused = true }

  get paused(): boolean {
    const { mash } = this.selection
    return mash ? mash.paused : true
  }
  set paused(value: boolean) {
    const { mash } = this.selection
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
    return parseFloat(`0.${"0".repeat(this.precision - 1)}1`)
  }

  precision = Default.editor.precision

  preloader: BrowserLoaderClass

  readOnly = false

  private _rect: Rect
  get rect(): Rect { return this._rect }
  set rect(value: Rect) {
    assertSizeAboveZero(value)

    const { editedData, rect } = this
    // console.log(this.constructor.name, "rect", rect, "=>", value, !!editedData)
    if (rectsEqual(rect, value)) return

    this._rect = value
    const promise = editedData ? this.loadEditedData() : Promise.resolve()
    promise.then(() => {
      const { edited, rect, eventTarget } = this
      if (!isEdited(edited)) return
 
      edited.imageSize = sizeCopy(rect)
      eventTarget.emit(EventType.Resize, { rect: value })
      this.redraw()
    })
  }

  redo(): void { if (this.actions.canRedo) this.handleAction(this.actions.redo()) }

  redraw(): void {
    const { edited } = this
    if (!edited) return
    edited.mashes.forEach(mash => { mash.clearPreview() })
    this.eventTarget.dispatch(EventType.Draw)
  }

  removeClip(clip: Clip): void {
    const { mash } = this.selection
    if (!mash) throw new Error(Errors.selection)

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
    assertMash(mash)

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

  removeLayer(layer: Layer): void {
    const { cast } = this.selection
    assertCast(cast)
    const redoSelection: EditorSelectionObject = { cast, layer }
    this.actions.create({ type: ActionType.RemoveLayer, redoSelection })
  }

  removeTrack(track: Track): void {
    // TODO: create remove track action...
    console.debug(this.constructor.name, "removeTrack coming soon...")
  }

  saved(temporaryIdLookup?: StringObject): void {
    if (temporaryIdLookup) {
      const { edited } = this
      assertTrue(edited)

      Object.entries(temporaryIdLookup).forEach(([temporaryId, permanentId]) => {
        if (edited.id === temporaryId) {
          edited.id = permanentId
          return 
        } 
        if (Defined.installed(temporaryId)) {
          Defined.updateDefinitionId(temporaryId, permanentId)
          return
        }
        assertCast(edited)
        const mash = edited.mashes.find(mash => mash.id === temporaryId)
        assertMash(mash)
        mash.id = permanentId
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
  
  get svgElement() { return this.preloader.svgElement } 
  set svgElement(value: SVGSVGElement) { this.preloader.svgElement = value }

  previewItems(enabled?: boolean): Promise<PreviewItems> {
    const { edited, rect } = this
    const color = edited ? edited.color : undefined      
    const size = sizeCopy(rect)
    const colorElement = svgElement(size, svgPolygonElement(size, '', color))
    const promise = Promise.resolve([colorElement])
    if (!edited) return promise
    
    const editor = (enabled && this.paused) ? this : undefined
    return promise.then(elements => {
      return edited.previewItemsPromise(editor).then(items => {
        return [...elements, ...items]
      })
    })
  }

  get time(): Time { return this.selection.mash?.time || timeFromArgs(0, this.fps)}

  set time(value: Time) { this.goToTime(value) }

  get timeRange(): TimeRange {
    return this.selection.mash?.timeRange || timeRangeFromArgs(0, this.fps) 
  }

  undo(): void {
    const { canUndo } = this.actions
    if (canUndo) this.handleAction(this.actions.undo())
  }

  updateDefinition(definitionObject: DefinitionObject, definition?: Definition): Promise<void> {
    const {id: newId, type: newType } = definitionObject
    const id = definitionObject.id || definition!.id
    assertPopulatedString(id)

    const target = definition || Defined.fromId(newId!)
    const { id: oldId, type: oldType } = target
    const idChanged = oldId !== id
    const typeChanged = isDefinitionType(newType) && oldType !== newType
    // console.log(this.constructor.name, "updateDefinition", typeChanged, idChanged, definitionObject)
    if (typeChanged) {
      // support changing a video to a videosequence
      const newDefinition = Factory[newType].definition(definitionObject)
      Defined.updateDefinition(target, newDefinition)
    } else if (idChanged) {
      Defined.updateDefinitionId(target.id, id)
      Object.assign(target, definitionObject)
      if (isVideoDefinition(target)) delete target.loadedVideo 
      else if (isUpdatableDurationDefinition(target)) delete target.loadedAudio
      else if (isImageDefinition(target)) delete target.loadedImage
    } 
    const { edited } = this
    if (!(edited && (typeChanged || idChanged))) return Promise.resolve()
    
    const tracks = this.mashes.flatMap(mash => mash.tracks)
    const clips = tracks.flatMap(track => track.clips)
    clips.forEach(clip => {
      if (clip.containerId === oldId) clip.setValue(newId, 'containerId')
      if (clip.contentId === oldId) clip.setValue(newId, 'contentId')
    })
    return this.loadMashAndDraw()
  }

  private _volume = Default.editor.volume
  get volume(): number { return this._volume }
  set volume(value: number) {
    const number = Number(value)
    if (this._volume !== number) {
      if (!isPositive(number)) throw Errors.invalid.volume
      this._volume = number
      if (isAboveZero(number)) this.muted = false

      const { mash } = this.selection
      if (mash) mash.gain = this.gain
      this.eventTarget.emit(EventType.Volume)
    }
  }
}
