import {
  Scalar, StringObject, Timeout, UnknownObject} from "../declarations"
import { Dimensions } from "../Setup/Dimensions"
import { SelectedProperties } from "../MoveMe"
import { Definition, DefinitionObject, DefinitionObjects } from "../Definition/Definition"
import { Edited } from "../Edited/Edited"
import { assertMash, Mash, MashAndDefinitionsObject } from "../Edited/Mash/Mash"
import { Emitter } from "../Helpers/Emitter"
import { Time, TimeRange } from "../Helpers/Time/Time"
import {
  timeFromArgs, timeFromSeconds, timeRangeFromArgs} from "../Helpers/Time/TimeUtilities"
import { Effect, isEffect, isEffectDefinition } from "../Media/Effect/Effect"
import { isTrack, Track } from "../Edited/Mash/Track/Track"
import { Clip, Clips, isClip } from "../Mixin/Clip/Clip"
import { BrowserLoaderClass } from "../Loader/BrowserLoaderClass"
import { Default } from "../Setup/Default"
import {
  ActionType, assertDefinitionType, DefinitionType, EditType, EventType,
  isClipSelectType,
  isEditType, LayerType, MasherAction, SelectType, SelectTypes, TrackType
} from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import {
  assertPopulatedString, assertTrue, isAboveZero, isBoolean, isDefined, isNumber, isObject, isPopulatedObject,
  isPopulatedString, isPositive, isUndefined
} from "../Utility/Is"
import {
  assertMashData, CastData, ClipOrEffect, EditedData, Editor, EditorArgs, isCastData,
  MashData, Selectable, EditorSelection
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
import { NamespaceSvg } from "../Setup/Constants"
import { Defined } from "../Base/Defined"
import { isContainerDefinition } from "../Container/Container"
import { assertVisibleClip, isVisibleClip, VisibleClipObject } from "../Media/VisibleClip/VisibleClip"
import { visibleClipDefault } from "../Media/VisibleClip/VisibleClipFactory"
import { isVisible } from "../Mixin/Visible/Visible"

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
    } = args
    if (isEditType(editType)) this._editType = editType
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

    const visibleClipObject: VisibleClipObject = { label }
    if (isContainerDefinition(definition)) visibleClipObject.containerId = id
    else visibleClipObject.contentId = id

    const clip = visibleClipDefault.instanceFromObject(visibleClipObject)


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
    if (!isVisible(clip)) {
      console.error(this.constructor.name, "addEffect expected effectable selection")
      throw Errors.selection + 'effectable'
    }

    const { effects } = clip

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

  private changeCast(property: string, value: Scalar): void {
    const { cast: target } = this.selection
    if (!target) throw new Error(Errors.selection)
    assertPopulatedString(property, 'changeCast property')

    const redoValue = isUndefined(value) ? target.value(property) : value
    const undoValue = target.value(property)
    const options: UnknownObject = {
      property, target: target, redoValue, undoValue, type: ActionType.Change
    }
    this.actions.create(options)
  }

  private changeEffect(property: string, value: Scalar, effect?: Effect): void {
    if (!isPopulatedString(property)) throw Errors.property

    const target = effect || this.selection.effect
    if (!target) throw Errors.selection

    const redoValue = isUndefined(value) ? target.value(property) : value
    const undoValue = target.value(property)
    const options = {
      type: ActionType.Change, target, property, redoValue, undoValue
    }
    this.actions.create(options)
  }

  private changeLayer(property: string, value: Scalar): void {
    const { layer: target } = this.selection
    if (!target) throw new Error(Errors.selection)
    assertPopulatedString(property, 'changeLayer property')

    const redoValue = isUndefined(value) ? target.value(property) : value
    const undoValue = target.value(property)
    const options: UnknownObject = {
      property, target: target, redoValue, undoValue, type: ActionType.Change
    }
    this.actions.create(options)
  }

  private changeMash(property: string, value: Scalar): void {
    const { mash: target } = this.selection
    if (!target) throw new Error(Errors.selection)
    assertPopulatedString(property, 'changeMash property')

    const redoValue = isUndefined(value) ? target.value(property) : value
    const undoValue = target.value(property)
    const options: UnknownObject = {
      property, target: target, redoValue, undoValue, type: ActionType.Change
    }
    this.actions.create(options)
  }

  private changeTrack(property: string, value: Scalar): void {
    if (!isPopulatedString(property)) throw Errors.property

    const { track: target } = this.selection
    if (!target) throw Errors.selection

    const redoValue = isUndefined(value) ? target.value(property) : value
    const undoValue = target.value(property)
    const options = {
      type: ActionType.Change, target, property, redoValue, undoValue
    }
    this.actions.create(options)
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
    if (!this._editType) this._editType = this.selection.cast ? EditType.Cast : EditType.Mash
    return this._editType!
  }

  get edited(): Edited | undefined { return this.selection.cast || this.selection.mash }

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
    const { selection } = action
    const { mash } = selection
    const mashChanged = mash !== this.selection.mash
    this.selection = selection
    const { edited } = this
    assertTrue(edited)
    const { quantize } = edited
    if (mash && action instanceof ChangeAction) {
      const { property, target } = action
      if (property === "gain" && isVisibleClip(target)) {
        mash.composition.adjustClipGain(target, quantize)
        return
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
    if (!this.drawTimeout) {
      const { edited } = this
      if (!edited) throw Errors.internal + 'handleDraw with no edited'
      if (edited.loading) {
        return
      }
      this.drawTimeout = setTimeout(() => {
        this.eventTarget.dispatch(EventType.Draw)
        delete this.drawTimeout
      }, 10)
    }
  }



  _imageSize: Dimensions = { width: 300, height: 150 }
  get imageSize(): Dimensions { return this._imageSize }
  set imageSize(value: Dimensions) {
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

    const { trackType, track: undoTrackIndex } = clip
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
    assertVisibleClip(clip)
    const effectable = clip
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

    assertVisibleClip(clip)
    const { effects } = clip
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

  save(temporaryIdLookup?: StringObject): void {
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
        this.selection.track = this.selection.mash!.clipTrack(selectable)
      } else {
        delete this.selection.clip
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

  selectedProperties(selectTypes: SelectType[] = SelectTypes): SelectedProperties {

    const filteredTypes = selectTypes.filter(type => {
      const selectType = isClipSelectType(type) ? SelectType.Clip : type
      return isDefined(this.selection[selectType])
    })
    // TODO: support filtering based on selectTypes
    const properties: SelectedProperties = []
    const { mash, clip, effect, track, cast, layer } = this.selection
    if (mash) {
      if (track) {
        if (clip) {
          if (effect && filteredTypes.includes(SelectType.Effect)) {
            properties.push(...effect.properties().map(property => ({
              selectType: SelectType.Effect, property, changeHandler: this.changeEffect.bind(this),
              value: effect.value(property.name)
            })))
          }
          if (filteredTypes.includes(SelectType.Clip)) {
            assertVisibleClip(clip)
            properties.push(...clip.selectedProperties(this.actions, filteredTypes))
          }
        }
        if (filteredTypes.includes(SelectType.Track)) {
          properties.push(...track.properties().map(property => ({
            selectType: SelectType.Track, property, changeHandler: this.changeTrack.bind(this),
            value: track.value(property.name)
          })))
        }
      }
      if (filteredTypes.includes(SelectType.Mash)) {
        properties.push(...mash.properties().map(property => ({
          selectType: SelectType.Mash, property, changeHandler: this.changeMash.bind(this),
          value: mash.value(property.name)
        })))
      }
    }
    if (cast && filteredTypes.includes(SelectType.Cast)) {
      properties.push(...cast.properties().map(property => ({
        selectType: SelectType.Cast, property, changeHandler: this.changeCast.bind(this),
        value: cast.value(property.name)
      })))
      if (layer) {
        properties.push(...layer.properties().map(property => ({
          selectType: SelectType.Layer, property, changeHandler: this.changeLayer.bind(this),
          value: layer.value(property.name)
        })))
      }
    }
    const names: string[] = []
    const duplicates: string[] = []
    const filtered = properties.filter(selectedProperty => {
      const { property, selectType } = selectedProperty
      const { name } = property
      const qualifiedName = `${selectType}.${name}`
      if (!names.includes(qualifiedName)) {
        names.push(qualifiedName)
        return true
      }
      duplicates.push(qualifiedName)
      return false
    })
    if (duplicates.length) console.warn(this.constructor.name, "selectedProperties found duplicates:", duplicates.join(", "))
    return filtered
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

  get svg(): SVGSVGElement {
    const { edited } = this
    if (edited) return edited.svgElement({ editor: this })

    return globalThis.document.createElementNS(NamespaceSvg, 'svg')
  }
}
