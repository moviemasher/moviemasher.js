import {
  StringObject, Timeout} from "../declarations"
import { Size } from "../Utility/Size"
import { SelectedProperties } from "../Utility/SelectedProperty"
import { Definition, DefinitionObject, DefinitionObjects } from "../Definition/Definition"
import { Edited } from "../Edited/Edited"
import { assertMash, isMash, Mash, MashAndDefinitionsObject } from "../Edited/Mash/Mash"
import { Emitter } from "../Helpers/Emitter"
import { Time, TimeRange } from "../Helpers/Time/Time"
import {
  timeFromArgs, timeFromSeconds, timeRangeFromArgs} from "../Helpers/Time/TimeUtilities"
import { Effect, isEffect, isEffectDefinition } from "../Media/Effect/Effect"
import { isTrack, Track } from "../Edited/Mash/Track/Track"
import { BrowserLoaderClass } from "../Loader/BrowserLoaderClass"
import { Default } from "../Setup/Default"
import {
  ActionType, assertDefinitionType, DefinitionType, EditType, EventType,
  isEditType, LayerType, MasherAction, SelectType, SelectTypes, TrackType
} from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import {
  assertPopulatedString, assertTrue, isAboveZero, isBoolean, isNumber, isObject, isPopulatedObject,
  isPopulatedString, isPositive} from "../Utility/Is"
import {
  assertMashData, CastData, ClipOrEffect, EditedData, Editor, EditorArgs, isCastData,
  MashData, Selectable, EditorSelection,
} from "./Editor"
import { Action, ActionObject } from "./Actions/Action/Action"
import { ChangeAction } from "./Actions/Action/ChangeAction"
import { Actions } from "./Actions/Actions"

import { Factory } from "../Definitions/Factory"
import { assertCast, castInstance, isCast } from "../Edited/Cast/CastFactory"
import { mashInstance } from "../Edited/Mash/MashFactory"
import {
  assertLayer, assertLayerFolder, assertLayerMash, isLayer, isLayerMash
} from "../Edited/Cast/Layer/LayerFactory"

import { Layer, LayerAndPosition, LayerObject } from "../Edited/Cast/Layer/Layer"
import { Defined } from "../Base/Defined"
import { assertClip, isClip, ClipObject, Clip, Clips } from "../Media/Clip/Clip"
import { clipDefault } from "../Media/Clip/ClipFactory"
import { isContentDefinition } from "../Content/Content"
import { DataPutRequest } from "../Api/Data"
import { PreviewOptions, Svgs } from "./Preview/Preview"
import { svgElement } from "../Utility/Svg"
import { idGenerate } from "../Utility"
import { assertContainer } from "../Container/Container"

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
    } = args
    
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
  }

  actions: Actions

  add(object: DefinitionObject, frameOrIndex = 0, trackIndex = 0): Promise<ClipOrEffect> {
    if (!isPopulatedObject(object)) throw Errors.argument + 'add'

    // console.log(this.constructor.name, "add", object)
    const definition = Defined.fromObject(object)
    const { id, label } = definition

    if (isEffectDefinition(definition)) {
      const effect = definition.instanceFromObject()
      return this.addEffect(effect, frameOrIndex).then(() => effect)
    }

    // TODO: audio...

    const clipObject: ClipObject = { label }
    if (isContentDefinition(definition)) clipObject.contentId = id
    else clipObject.containerId = id

    const clip = clipDefault.instanceFromObject(clipObject)


    // const definition = Factory[type].definition(object)
    // const clip = definition.instanceFromObject() as Clip
    // console.log(this.constructor.name, "add", clip)
    return this.addClip(clip, frameOrIndex, trackIndex).then(() => clip)
  }

  addClip(clip: Clip, frameOrIndex = 0, trackIndex = 0): Promise<void> {
    const { mash } = this.selection
    if (!mash) throw new Error(Errors.selection)

    const { trackType } = clip

    const tracksOfType = mash.tracks.filter(track => track.trackType === trackType)
    const track = tracksOfType[trackIndex]
    const trackCount = tracksOfType.length

    const options: ActionObject = {
      clip, trackType, type: ActionType.AddClipToTrack,
      redoSelection: { ...this.selection, track, clip, effect: undefined },
    }
    if (track.dense) {
      options.insertIndex = frameOrIndex
      options.createTracks = Math.min(1, Math.max(0, 1 - trackCount))
    } else {
      options.trackIndex = trackIndex
      clip.frame = track.frameForClipNearFrame(clip, frameOrIndex)
      options.createTracks = Math.max(0, trackIndex + 1 - trackCount)
    }
    this.actions.create(options)
    return this.loadMashAndDraw()
  }

  addEffect(effect: Effect, insertIndex = 0): Promise<void> {
    // console.log(this.constructor.name, "addEffect", object, index)
    const { clip } = this.selection
    if (!isClip(clip)) {
      console.error(this.constructor.name, "addEffect expected effectable selection")
      throw Errors.selection + 'effectable'
    }
    const { container } = clip
    assertContainer(container)
    const { effects } = container

    if (!effects) throw Errors.selection

    const undoEffects = [...effects]
    const redoEffects = [...effects]
    redoEffects.splice(insertIndex, 0, effect)
    const options = {
      effects,
      undoEffects,
      redoEffects,
      redoSelection: { ...this.selection, effect },
      type: ActionType.MoveEffect
    }
    this.actions.create(options)
    return this.loadMashAndDraw()
  }

  addFolder(label?: string, layerAndPosition?: LayerAndPosition): void {
    const { cast } = this.selection
    assertCast(cast)

    const layer = cast.createLayer({ type: LayerType.Folder, label })
    assertLayerFolder(layer)

    const redoSelection = { cast, layer }
    const options = { type: ActionType.AddLayer, redoSelection, layerAndPosition }
    // console.log("addFolder", Object.keys(redoSelection))
    this.actions.create(options)
  }

  addMash(mashAndDefinitions?: MashAndDefinitionsObject, layerAndPosition?: LayerAndPosition): void {
    const { cast } = this.selection
    assertCast(cast)

    const mashObject = mashAndDefinitions?.mashObject || {}
    const definitionObjects = mashAndDefinitions?.definitionObjects || []

    Defined.define(...definitionObjects)
    const layerObject: LayerObject = { type: LayerType.Mash, mash: mashObject }
    const layer = cast.createLayer(layerObject)
    assertLayerMash(layer)

    const { mash } = layer
    this.configureMash(mash)
    const redoSelection = { cast, layer, mash }
    const options = { type: ActionType.AddLayer, redoSelection, layerAndPosition }
    this.actions.create(options)
  }

  addTrack(trackType = TrackType.Video): void {
    const { mash, cast } = this.selection
    this.actions.create({ redoSelection: { mash, cast }, trackType, type: ActionType.AddTrack })
  }

  autoplay = Default.masher.autoplay

  private _buffer = Default.masher.buffer
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
    // console.log(this.constructor.name, "can", masherAction)
    // const z = this._selectedClips.length
    const { selection } = this
    const { track, clip, effect, mash } = selection
    switch (masherAction) {
      case MasherAction.Save: return this.actions.canSave
      case MasherAction.Undo: return this.actions.canUndo
      case MasherAction.Redo: return this.actions.canRedo
      case MasherAction.Remove: return !!(
        effect
        || clip
        || (track && mash?.trackCount(track.trackType) === track.layer + 1)
      )
      case MasherAction.Render: return !!mash?.id

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

  private configureCast(): void {
    const { cast } = this.selection
    if (!cast) throw new Error(Errors.selection)

    this.configureEdited(cast)

    cast.loadPromise({ editing: true }).then(() => { this.handleDraw() })

  }

  private configureEdited(edited: Edited): void {
    edited.editor = this
    edited.imageSize = this._imageSize
    edited.emitter = this.eventTarget
  }

  private configureMash(mash: Mash) {
    mash.buffer = this.buffer
    mash.gain = this.gain
    mash.loop = this.loop
    this.configureEdited(mash)

    mash.loadPromise({ editing: true}).then(() => { this.handleDraw() })
  }

  create(): void {
    switch (this.editType) {
      case EditType.Cast:
        this.load({ cast: {} })
        return
      case EditType.Mash:
        this.load({ mash: {} })
        return
    }
  }

  get currentTime(): number {
    const { mash } = this.selection
    if (mash && mash.drawnTime) return mash.drawnTime.seconds
    return 0
  }

  dataPutRequest(): Promise<DataPutRequest> {
    const { edited } = this
    assertTrue(edited, 'edited')
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
    const { edited } = this
    if (!edited) return []

    const mashes = isCast(edited) ? edited.mashes : [edited as Mash]
    const ids = [...new Set(mashes.flatMap(mash => mash.definitionIds))]
    const definitions = ids.map(id => Defined.fromId(id))
    return definitions
  }

  deselect(selectionType: SelectType): void {
    if (!this.selection[selectionType]) return

    delete this.selection.effect
    if (selectionType !== SelectType.Effect) {
      delete this.selection.clip
      if (selectionType !== SelectType.Clip) {
        delete this.selection.track
        if (selectionType !== SelectType.Track) {
          delete this.selection.layer
          if (this.selection.mash) {
            delete this.selection.mash
            this.eventTarget.emit(EventType.Mash)
          }
        }
      }
    }
    this.eventTarget.emit(EventType.Selection)
  }

  private destroy() { if (!this.castDestroy()) this.mashDestroy() }

  get duration(): number { return this.selection.mash?.duration || 0 }

  _editType?: EditType
  get editType(): EditType {
    if (!this._editType) this._editType = this.editingCast ? EditType.Cast : EditType.Mash
    return this._editType!
  }

  get edited(): Edited | undefined { return this.selection.cast || this.selection.mash }

  editing: boolean 

  get editingCast(): boolean { return !!this.selection.cast }

  private emitMash(): void {
    this.eventTarget.emit(EventType.Mash)
    this.eventTarget.emit(EventType.Track)
    this.eventTarget.emit(EventType.Duration)
  }

  private get endTime(): Time {
    const { mash } = this.selection
    return mash ? mash.endTime.scale(this.fps, 'floor') : timeFromArgs()
  }

  eventTarget = new Emitter()

  private _fps = Default.masher.fps
  get fps(): number {
    return this._fps || this.selection.mash?.quantize || Default.masher.fps
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
    const { fps } = this
    const time = value ? value.scaleToFps(fps) : timeFromArgs(0, fps)
    const min = time.min(this.endTime)
    if (value && min.equalsTime(this.time)) return Promise.resolve()

    const promise = this.selection.mash?.seekToTime(min)
    if (promise) return promise

    return Promise.resolve()
  }

  handleAction(action: Action): void {

    // console.log(this.constructor.name, "handleAction")
    const { selection } = action
    const { mash } = selection
    const mashChanged = mash !== this.selection.mash
    this.selection = selection
    const { edited } = this
    assertTrue(edited)
    const { quantize } = edited
    if (mash) {
      mash.clearPreview()
      if (action instanceof ChangeAction)  {
        const { property, target } = action
        if (property === "gain" && isClip(target)) {
          mash.composition.adjustClipGain(target, quantize)
          return
        }
      }
    } 
    const promise = edited.reload() || Promise.resolve()
    promise.then(() => {
      if (!mash) this.handleDraw()
      this.eventTarget.emit(EventType.Selection)
      if (mashChanged) this.eventTarget.emit(EventType.Mash)
      this.eventTarget.emit(EventType.Action, { action })
    })
  }

  drawTimeout?: Timeout

  handleDraw(event?: Event): void {
    // console.log(this.constructor.name, "handleDraw")
    if (!this.drawTimeout) {
      const { edited } = this
      if (!edited) throw Errors.internal + 'handleDraw with no edited'
      if (edited.loading) {
        return
      }
      this.drawTimeout = setTimeout(() => {

        // console.log(this.constructor.name, "handleDraw drawTimeout")
        this.eventTarget.dispatch(EventType.Draw)
        delete this.drawTimeout
      }, 10)
    }
  }



  _imageSize: Size = { width: 300, height: 150 }
  get imageSize(): Size { return this._imageSize }
  set imageSize(value: Size) {
    const { width, height } = value
    const size = { width, height }
    Object.assign(this._imageSize, size)
    const { edited } = this
    if (edited) edited.imageSize = size
  }

  load(data: EditedData): Promise<void> {
    this.destroy()
    this.paused = true

    this.clearActions()
    this.selection = {}
    this.eventTarget.emit(EventType.Selection)
    if (isCastData(data)) return this.loadCastData(data)

    assertMashData(data)
    return this.loadMashData(data)
  }


  private loadCastData(data: CastData = {}): Promise<void> {
    const { cast: castObject = {}, definitions: definitionObjects = [] } = data
    Defined.undefineAll()
    Defined.define(...definitionObjects)

    const cast = castInstance(castObject, this.preloader)
    this.selection = { cast }
    this.configureCast()
    this.eventTarget.emit(EventType.Cast)
    this.eventTarget.trap(EventType.Draw, this.handleDraw.bind(this))
    this.emitMash()
    this.eventTarget.emit(EventType.Selection)
    // TODO return proper promise of load
    return Promise.resolve()
  }

  private loadMashAndDraw(): Promise<void> {
    const { mash } = this.selection
    if (!mash) throw new Error(Errors.selection)

    return mash.loadPromise({ editing: true }).then(() => { mash.draw() })
  }

  private loadMashData(data: MashData = {}): Promise<void> {
    const { mash: mashObject = {}, definitions: definitionObjects = [] } = data
    Defined.undefineAll()
    Defined.define(...definitionObjects)
    const mash = mashInstance({ ...mashObject, preloader: this.preloader })
    this.mashDestroy()
    this.selection.mash = mash
    this.configureMash(mash)
    this.emitMash()
    return this.goToTime().then(() => {
      if (this.autoplay) this.paused = false
    })
  }

  private _loop = Default.masher.loop
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

  move(object: ClipOrEffect, frameOrIndex = 0, trackIndex = 0): void {
    if (!isObject(object)) throw Errors.argument + 'move'
    const { type } = object
    if (type === DefinitionType.Effect) {
      this.moveEffect(<Effect>object, frameOrIndex)
      return
    }

    this.moveClip(<Clip>object, frameOrIndex, trackIndex)
  }

  moveClip(clip: Clip, frameOrIndex = 0, trackIndex = 0): void {
    const { mash } = this.selection
    if (!mash) throw new Error(Errors.selection)

    // console.log("moveClip", "frameOrIndex", frameOrIndex, "trackIndex", trackIndex)
    if (!isPositive(frameOrIndex)) throw Errors.argument + 'moveClip frameOrIndex'
    if (!isPositive(trackIndex)) throw Errors.argument + 'moveClip trackIndex'

    const { trackType, trackNumber: undoTrackIndex } = clip
    const options: any = {
      clip,
      trackType,
      trackIndex,
      undoTrackIndex,
      type: ActionType.MoveClip
    }

    const redoTrack = mash.trackOfTypeAtIndex(trackType, trackIndex)
    const undoTrack = mash.trackOfTypeAtIndex(trackType, undoTrackIndex)
    const currentIndex = redoTrack.clips.indexOf(clip)

    if (redoTrack.dense) options.insertIndex = frameOrIndex
    if (undoTrack.dense) {
      options.undoInsertIndex = currentIndex
      if (frameOrIndex < currentIndex) options.undoInsertIndex += 1
    }

    if (!(redoTrack.dense && undoTrack.dense)) {
      const { frame } = clip
      const insertFrame = redoTrack.frameForClipNearFrame(clip, frameOrIndex)
      const offset = insertFrame - frame
      if (!offset && trackIndex === undoTrackIndex) return // no change

      options.undoFrame = frame
      options.redoFrame = frame + offset
    }
    this.actions.create(options)
  }

  moveEffect(effect: Effect, index = 0): void {
    // console.log(this.constructor.name, "moveEffects", effectOrArray, index)
    if (!isPositive(index)) throw Errors.argument + 'index'

    const { clip } = this.selection
    if (!clip) throw Errors.selection
    assertClip(clip)
    const effectable = clip.container
    assertContainer(effectable)
    const { effects } = effectable
    const undoEffects = [...effects]
    const redoEffects = undoEffects.filter(e => e !== effect)
    const currentIndex = undoEffects.indexOf(effect)
    const insertIndex = currentIndex < index ? index - 1 : index
    redoEffects.splice(insertIndex, 0, effect)

    const options = {
      effects, undoEffects, redoEffects, type: ActionType.MoveEffect, effectable
    }
    this.actions.create(options)
  }


  moveLayer(layer: Layer, layerAndPosition?: LayerAndPosition): void {
    const { cast } = this.selection
    assertCast(cast)
    assertLayer(layer)

    const redoSelection = { cast, layer }
    const options = { type: ActionType.MoveLayer, redoSelection, layerAndPosition }
    this.actions.create(options)
  }


  moveTrack(track: Track): void {
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

  precision = Default.masher.precision

  preloader: BrowserLoaderClass

  readOnly = false

  redo(): void { if (this.actions.canRedo) this.handleAction(this.actions.redo()) }

  remove(): void {
    if (this.selection.effect) this.removeEffect(this.selection.effect)
    else if (this.selection.clip) this.removeClip(this.selection.clip)
    else if (this.selection.track) this.removeTrack(this.selection.track)
    else throw Errors.selection
  }

  removeClip(clip: Clip): void {
    const { mash } = this.selection
    if (!mash) throw new Error(Errors.selection)

    const track = mash.clipTrack(clip)
    const options = {
      redoSelection: { ...this.selection, effect: undefined, clip: undefined },
      clip,
      track,
      index: track.clips.indexOf(clip),
      type: ActionType.RemoveClip
    }
    this.actions.create(options)
  }

  removeEffect(effect: Effect): void {
    const { clip } = this.selection
    if (!clip) throw Errors.selection

    assertClip(clip)
    const { container } = clip
    assertContainer(container)
    const { effects } = container
    const undoEffects = [...effects]
    const redoEffects = effects.filter(other => other !== effect)

    const options = {
      redoSelection: { ...this.selection, effect: undefined },
      effects,
      undoEffects,
      redoEffects,
      type: ActionType.MoveEffect
    }
    this.actions.create(options)
  }

  removeLayer(layer: Layer): void {
    const { cast } = this.selection
    assertCast(cast)

    this.actions.create({ type: ActionType.RemoveLayer, redoSelection: { cast, layer } })
  }

  removeTrack(track: Track): void {
    // TODO: create remove track action...
    console.debug(this.constructor.name, "removeTrack coming soon...")
  }

  saved(temporaryIdLookup?: StringObject): void {
    if (temporaryIdLookup) {
      const { edited } = this
      if (!edited) throw new Error(Errors.internal)

      Object.entries(temporaryIdLookup).forEach(([temporaryId, permanentId]) => {
        if (edited.id === temporaryId) return edited.id = permanentId
        if (Defined.installed(temporaryId)) {
          const definition = Defined.fromId(temporaryId)
          return definition.id = permanentId
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

  select(selectable: Selectable | SelectType): void {
    if (isEffect(selectable)) this.selection.effect = selectable
    else {
      delete this.selection.effect
      if (isClip(selectable)) {
        this.selection.clip = selectable
        this.selection.track = selectable.track
        this.selection.content = selectable.content
        this.selection.container = selectable.container
        if (this.editingCast) {
          const { mash } = selectable.track
          if (mash !== this.selection.mash) {
            this.selection.mash = mash
            this.selection.layer = mash.layer
            this.emitMash()
          } 
        } 
      } else {
        delete this.selection.clip
        delete this.selection.content
        delete this.selection.container 

        if (isTrack(selectable)) {
          this.selection.track = selectable
        } else {
          delete this.selection.track
          if (isLayer(selectable)) {
            this.selection.layer = selectable
            const mash = isLayerMash(selectable) ? selectable.mash : undefined
            this.selection.mash = mash
            this.emitMash()
          } else throw new Error(Errors.selection)
        }
      }
    }
    this.eventTarget.emit(EventType.Selection)
  }

  selection: EditorSelection = {}

  get selectTypes(): SelectType[] {
    const selectTypes: SelectType[] = []
    const { mash, clip, effect, track, cast, layer } = this.selection
    if (cast) {
      selectTypes.push(SelectType.Cast)
      if (layer) selectTypes.push(SelectType.Layer)
    }

    if (!mash) return selectTypes

    selectTypes.push(SelectType.Mash)
    if (!track) return selectTypes

    selectTypes.push(SelectType.Track)
    if (!clip) return selectTypes

    selectTypes.push(SelectType.Clip)
    
    selectTypes.push(SelectType.Content)

    if (isPopulatedString(clip.containerId)) {
      selectTypes.push(SelectType.Container)
      if (effect) selectTypes.push(SelectType.Effect)
    }
    return selectTypes
  }

  selectedProperties(types: SelectType[] = SelectTypes): SelectedProperties {
    const { selectTypes } = this
    const filteredTypes = selectTypes.filter(type => types.includes(type))
    
    return filteredTypes.flatMap(selectType => {
      const target = this.selection[selectType]
      assertTrue(target, selectType)
      return target.selectedProperties(this.actions)
    })
  }

  get time(): Time { return this.selection.mash?.time || timeFromArgs(0, this.fps)}

  set time(value: Time) { this.goToTime(value) }

  get timeRange(): TimeRange { return this.selection.mash?.timeRange || timeRangeFromArgs(0, this.fps) }

  private _volume = Default.masher.volume
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

  undo(): void {
    const { canUndo } = this.actions
    if (canUndo) this.handleAction(this.actions.undo())
  }

  get svgs(): Svgs {
    const { edited, selection, editing } = this
    if (!edited) {
      return [{ id: idGenerate('svg'), element: svgElement(this.imageSize) }]
    }
  
    const svgs: Svgs = []
    const options: PreviewOptions = { editor: this }
    // const { cast, mash } = selection
    // if (cast && mash) svgs.push(...mash.svgs(options))
    // else 
    svgs.push(...edited.svgs(options))
    return svgs
  }
}
