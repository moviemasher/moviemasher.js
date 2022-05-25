import { Any, LoadPromise, Scalar, SelectedProperties, Size, StringObject, Timeout, UnknownObject, VisibleContextData, VisibleSources } from "../declarations"
import { DefinitionObject, DefinitionObjects } from "../Base/Definition"
import { Edited } from "../Edited/Edited"
import { Mash, MashAndDefinitionsObject } from "../Edited/Mash/Mash"
import { Emitter } from "../Helpers/Emitter"
import { Time, TimeRange } from "../Helpers/Time/Time"
import { timeFromArgs, timeFromSeconds, timeRangeFromArgs, timeRangeFromTime } from "../Helpers/Time/TimeUtilities"
import { Effect } from "../Media/Effect/Effect"
import { isTrack, Track } from "../Media/Track/Track"
import { Clip, Clips, isClip } from "../Mixin/Clip/Clip"
import { isTransformable, Transformable } from "../Mixin/Transformable/Transformable"
import { BrowserPreloaderClass } from "../Preloader/BrowserPreloaderClass"
import { Default } from "../Setup/Default"
import { ActionType, assertDefinitionType, ClipType, ClipTypes, DefinitionType, EditType, EventType, isEditType, LayerType, MasherAction, SelectionType, SelectType, SelectTypes, TrackType, TransformType, TransformTypes } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { assertPopulatedString, isAboveZero, isBoolean, isNumber, isObject, isPopulatedObject, isPopulatedString, isPositive, isUndefined } from "../Utility/Is"
import { assertMashData, CastData, ClipOrEffect, EditedData, Editor, EditorArgs, isCastData, MashData, Selectable, Selection } from "./Editor"
import { EditorDefinitionsClass } from "./EditorDefinitions/EditorDefinitionsClass"
import { Action, ActionObject, ActionOptions } from "./Actions/Action/Action"
import { ChangeAction, isChangeAction } from "./Actions/Action/ChangeAction"
import { Actions } from "./Actions/Actions"
import { Video } from "../Media/Video/Video"
import { AudibleFile } from "../Mixin/AudibleFile/AudibleFile"
import { ContextFactory } from "../Context/ContextFactory"

import { Factory } from "../Definitions/Factory"
import { assertCast, castInstance } from "../Edited/Cast/CastFactory"
import { assertMash, mashInstance } from "../Edited/Mash/MashFactory"
import { actionInstance } from "./Actions/Action/ActionFactory"
import { assertLayer, assertLayerFolder, assertLayerMash, isLayer, isLayerMash } from "../Edited/Cast/Layer/LayerFactory"
import { isEffect } from "../Media/Effect/EffectFactory"
import { VisibleContext } from "../Context/VisibleContext"
import { Layer, LayerAndPosition, LayerObject } from "../Edited/Cast/Layer/Layer"

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

    this.preloader = preloader || new BrowserPreloaderClass(endpoint)
  }

  private actionCreate(object: ActionObject): void {
    const undoSelection = object.undoSelection || { ...this.selection }
    const redoSelection = object.redoSelection || { ...this.selection }

    const type = object.type || ActionType.Change
    const clone: ActionOptions = {
      ...object,
      type,
      undoSelection,
      redoSelection,
    }
    const action = actionInstance(clone)
    this.actions.add(action)
    this.handleAction(this.actions.redo())
  }

  actions = new Actions()

  add(object: DefinitionObject, frameOrIndex = 0, trackIndex = 0): Promise<ClipOrEffect> {
    if (!isPopulatedObject(object)) throw Errors.argument + 'add'

    const { id } = object
    const definitionFromId = id && this.definitions.installed(id) ? this.definitions.fromId(id) : false
    const type = object.type || (definitionFromId && definitionFromId.type)
    if (!type) throw Errors.type + 'Editor.add ' + id + JSON.stringify(definitionFromId)

    if (type === DefinitionType.Effect) {
      const effect = Factory.effect.definition(object).instance
      return this.addEffect(effect, frameOrIndex).then(() => effect)
    }
    const clipType = type as ClipType

    if (!ClipTypes.includes(clipType)) throw Errors.type + type

    const definitionType = <DefinitionType>type
    const definition = Factory[definitionType].definition(object)
    const clip = definition.instance as Clip

    return this.addClip(clip, frameOrIndex, trackIndex).then(() => clip)
  }

  addClip(clip: Clip, frameOrIndex = 0, trackIndex = 0): LoadPromise {
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
    this.actionCreate(options)
    return this.loadMashAndDraw()
  }

  addEffect(effect: Effect, insertIndex = 0): LoadPromise {
    // console.log(this.constructor.name, "addEffect", object, index)
    const { clip } = this.selection
    if (!clip) throw Errors.selection

    const { effects } = clip as Transformable
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
    this.actionCreate(options)
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
    this.actionCreate(options)
  }

  addMash(mashAndDefinitions?: MashAndDefinitionsObject, layerAndPosition?: LayerAndPosition): void {
    const { cast } = this.selection
    assertCast(cast)

    const mashObject = mashAndDefinitions?.mashObject || {}
    const definitionObjects = mashAndDefinitions?.definitionObjects || []

    this.definitions.define(definitionObjects)
    const layerObject: LayerObject = { type: LayerType.Mash, mash: mashObject }
    const layer = cast.createLayer(layerObject)
    assertLayerMash(layer)

    const { mash } = layer
    this.configureMash(mash)
    const redoSelection = { cast, layer, mash }
    const options = { type: ActionType.AddLayer, redoSelection, layerAndPosition }
    this.actionCreate(options)
  }

  addTrack(trackType = TrackType.Video): void {
    const { mash, cast } = this.selection
    this.actionCreate({ redoSelection: { mash, cast }, trackType, type: ActionType.AddTrack })
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

      case MasherAction.Split: return !!(
        clip && this.clipCanBeSplit(clip, this.time, mash!.quantize)
      )
      case MasherAction.Freeze: return !!(
        clip
        && DefinitionType.Video === clip.type
        && this.clipCanBeSplit(clip, this.time, mash!.quantize)
      )
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
    const { cast } = this.selection
    if (!cast) throw new Error(Errors.selection)
    assertPopulatedString(property)

    const redoValue = isUndefined(value) ? cast.value(property) : value
    const changeAction = this.reusableChangeAction(cast, property)
    if (changeAction) {
      changeAction.updateAction(redoValue)
      this.handleAction(changeAction)
      return
    }
    const undoValue = cast.value(property)
    const options: UnknownObject = {
      property, target: cast, redoValue, undoValue, type: ActionType.Change
    }
    this.actionCreate(options)
  }

  private changeClip(property: string, value: Scalar): void {
    const { clip } = this.selection
    if (!clip) throw new Error(Errors.selection)
    assertPopulatedString(property)

    const redoValue = isUndefined(value) ? clip.value(property) : value
    const changeAction = this.reusableChangeAction(clip, property)
    if (changeAction) {
      changeAction.updateAction(redoValue)
      this.handleAction(changeAction)
      return
    }
    const undoValue = clip.value(property)
    const options: UnknownObject = { property, target: clip, redoValue, undoValue }

    switch (options.property) {
      case 'frames': {
        options.type = ActionType.ChangeFrames
        break
      }
      case 'trim': {
        options.type = ActionType.ChangeTrim
        // TODO: make sure there's a test for this
        // not sure where this was derived from - using original clip??
        options.frames = clip.frames + Number(options.undoValue)
        break
      }
      default: options.type = ActionType.Change
    }
    this.actionCreate(options)
  }

  private changeEffect(property: string, value: Scalar, effect?: Effect): void {
    if (!isPopulatedString(property)) throw Errors.property

    const target = effect || this.selection.effect
    if (!target) throw Errors.selection

    const redoValue = typeof value === "undefined" ? target.value(property) : value
    const changeAction = this.reusableChangeAction(target, property)
    if (changeAction) {
      changeAction.updateAction(redoValue)
      this.handleAction(changeAction)
      return
    }
    const undoValue = target.value(property) // typeof value === "undefined" ? this.pristineEffectOrThrow[property] : target.value(property)
    const options = {
      type: ActionType.Change, target, property, redoValue, undoValue
    }
    this.actionCreate(options)
  }

  private changeLayer(property: string, value: Scalar): void {
    const { layer } = this.selection
    if (!layer) throw new Error(Errors.selection)
    assertPopulatedString(property)

    const redoValue = isUndefined(value) ? layer.value(property) : value
    const changeAction = this.reusableChangeAction(layer, property)
    if (changeAction) {
      changeAction.updateAction(redoValue)
      this.handleAction(changeAction)
      return
    }
    const undoValue = layer.value(property)
    const options: UnknownObject = {
      property, target: layer, redoValue, undoValue, type: ActionType.Change
    }
    this.actionCreate(options)
  }

  private changeMash(property: string, value: Scalar): void {
    const { mash } = this.selection
    if (!mash) throw new Error(Errors.selection)
    assertPopulatedString(property)

    const redoValue = isUndefined(value) ? mash.value(property) : value
    const changeAction = this.reusableChangeAction(mash, property)
    if (changeAction) {
      changeAction.updateAction(redoValue)
      this.handleAction(changeAction)
      return
    }
    const undoValue = mash.value(property)
    const options: UnknownObject = {
      property, target: mash, redoValue, undoValue, type: ActionType.Change
    }
    this.actionCreate(options)
  }

  private changeMerger(property: string, value: Scalar): void {
    this.changeTransformer(TransformType.Merger, property, value)
  }

  private changeScaler(property: string, value: Scalar): void {
    this.changeTransformer(TransformType.Scaler, property, value)
  }

  private changeTrack(property: string, value: Scalar, track?: Track): void {
    if (!isPopulatedString(property)) throw Errors.property

    const target = track || this.selection.track
    if (!target) throw Errors.selection

    const redoValue = typeof value === "undefined" ? target.value(property) : value
    const changeAction = this.reusableChangeAction(target, property)
    if (changeAction) {
      changeAction.updateAction(redoValue)
      this.handleAction(changeAction)
      return
    }
    const undoValue = target.value(property) // typeof value === "undefined" ? this.pristineEffectOrThrow[property] : target.value(property)
    const options = {
      type: ActionType.Change, target, property, redoValue, undoValue
    }
    this.actionCreate(options)
  }

  private changeTransformer(type: string, property: string, value: Scalar): void {
    // console.log(this.constructor.name, "changeTransformer", type, property)
    if (!isPopulatedString(type)) throw Errors.type + "changeTransformer " + type
    if (!isPopulatedString(property)) throw Errors.property + "changeTransformer " + property

    const target = this.selection.clip
    if (!target) throw Errors.selection

    const transformType = type as TransformType
    const transformable = target as Transformable

    // make sure first component is merger or scaler
    if (!TransformTypes.includes(transformType)) throw Errors.property + "type " + type
    const transformTarget = transformable[transformType]
    const redoValue = typeof value === "undefined" ? transformTarget.value(property) : value
    if (typeof transformTarget !== "object") throw Errors.internal + 'transformTarget'

    const undoValue = transformTarget[property]
    if (typeof undoValue === "undefined") throw Errors.property + property + JSON.stringify(transformTarget)

    const options: UnknownObject = { property, target: transformTarget, redoValue, undoValue, type: ActionType.Change }

    const changeAction = this.reusableChangeAction(target, property)
    if (changeAction) {
      changeAction.updateAction(redoValue)
      this.handleAction(changeAction)
      return
    }
    this.actionCreate(options)
  }

  private clearActions(): void {
    if (!this.actions.instances.length) return

    this.actions = new Actions()
    this.eventTarget.dispatch(EventType.Action)
  }

  private clipCanBeSplit(clip: Clip, time: Time, quantize: number): boolean {
    if (!isObject(clip)) return false

    // true if now intersects clip time, but is not start or end frame
    const range = timeRangeFromTime(time)
    const clipRange = clip.timeRange(quantize)

    // ranges must intersect
    if (!clipRange.intersects(range)) return false

    const scaled = range.scale(clipRange.fps)
    if (scaled.frame === clipRange.frame) return false
    if (scaled.end === clipRange.end) return false

    return true
  }

  get clips(): Clips { return this.selection.mash!.clips }

  private configureCast(): void {
    const { cast } = this.selection
    if (!cast) throw new Error(Errors.selection)

    this.configureEdited(cast)

    cast.loadPromise().then(() => { this.handleDraw() })

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

    mash.loadPromise().then(() => { this.handleDraw() })
  }


  create(): void {
    switch (this.editType) {
      case EditType.Cast: return this.load({ cast: {} })
      case EditType.Mash: return this.load({ mash: {} })
    }
  }

  private reusableChangeAction(target: unknown, property: string): ChangeAction | undefined {
    if (!this.actions.currentActionLast) return

    const action = this.actions.currentAction
    if (isChangeAction(action) && action.target === target && action.property === property) {
      return action
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
      assertPopulatedString(id)

      // if (!id) throw Errors.invalid.definition.id

      if (this.definitions.fromId(id)) {
        // redefining...
        return
      }
      assertDefinitionType(type)

      const definition = Factory[type].definition(object)
      this.definitions.install(definition)
    })
  }

  definitions = new EditorDefinitionsClass()

  deselect(selectionType: SelectionType): void {
    if (!this.selection[selectionType]) return

    delete this.selection.effect
    if (selectionType !== SelectionType.Effect) {
      delete this.selection.clip
      if (selectionType !== SelectionType.Clip) {
        delete this.selection.track
        if (selectionType !== SelectionType.Track) {
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

  freeze(): void {
    const { mash, clip } = this.selection
    if (!(clip && mash)) throw new Error(Errors.selection)

    if (!this.clipCanBeSplit(clip, this.time, mash.quantize)) {
      throw Errors.invalid.action
    }
    if (DefinitionType.Video !== clip.type) {
      throw Errors.invalid.action
    }
    const freezeClip = clip as Video
    const scaled = this.time.scale(mash.quantize)
    const trackClips = mash.clipTrack(freezeClip).clips
    const insertClip = freezeClip.copy
    const frozenClip = freezeClip.copy

    const options = {
      frames: freezeClip.frames - (scaled.frame - freezeClip.frame),
      freezeClip,
      frozenClip,
      insertClip,
      trackClips,
      redoSelection: { ...this.selection, effect: undefined, clip: frozenClip },
      index: 1 + trackClips.indexOf(freezeClip),
      type: ActionType.Freeze,
    }

    frozenClip.frame = scaled.frame
    frozenClip.frames = 1
    frozenClip.trim = freezeClip.trim + (scaled.frame - freezeClip.frame)
    insertClip.frame = scaled.frame + 1
    insertClip.frames = options.frames - 1
    insertClip.trim = frozenClip.trim + 1

    this.actionCreate(options)
  }

  private get gain(): number { return this.muted ? 0.0 : this.volume }

  goToTime(value?: Time): LoadPromise {
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
    // console.log(this.constructor.name, "handleAction", action.constructor.name, !!mash)
    this.selection = selection
    if (mash) mash.handleAction(action)
    else this.handleDraw()
    this.eventTarget.emit(EventType.Selection)
    if (mashChanged) this.eventTarget.emit(EventType.Mash)
    this.eventTarget.dispatch(EventType.Action, { action })
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
        edited.drawBackground()
        this.eventTarget.dispatch(EventType.Draw)
        delete this.drawTimeout
      }, 10)
    }
  }

  get imageData(): VisibleContextData {
    return this.edited?.visibleContext.imageData || this.visibleContext.imageData
  }

  _imageSize: Size = { width: 300, height: 150 }
  get imageSize(): Size { return this._imageSize }
  set imageSize(value: Size) {
    const { width, height } = value
    const size = { width, height }
    Object.assign(this._imageSize, size)
    const { edited } = this
    if (edited) edited.imageSize = size
    if (this._visibleContext) this._visibleContext.size = size
  }

  load(data: EditedData): void {
    this.destroy()
    this.paused = true
    if (isCastData(data)) this.loadCastData(data)
    else {
      assertMashData(data)
      this.loadMashData(data)
    }
    this.clearActions()
    this.eventTarget.emit(EventType.Selection)
  }


  private loadCastData(data: CastData = {}): void {
    const { cast: castObject = {}, definitions: definitionObjects = [] } = data
    const definitions = new EditorDefinitionsClass(definitionObjects)
    const cast = castInstance(castObject, definitions, this.preloader)
    this.definitions = definitions
    this.selection = { cast }
    this.configureCast()
    this.eventTarget.emit(EventType.Cast)
    this.eventTarget.trap(EventType.Draw, this.handleDraw.bind(this))
    this.eventTarget.trap(EventType.Action)
    this.emitMash()
  }

  private loadMashAndDraw(): LoadPromise {
    const { mash } = this.selection
    if (!mash) throw new Error(Errors.selection)

    return mash.loadPromise().then(() => { mash.draw() })
  }

  private loadMashData(data: MashData = {}): void {
    const { mash: mashObject = {}, definitions: definitionObjects = []} = data
    const definitions = new EditorDefinitionsClass(definitionObjects)
    const mash = mashInstance({ ...mashObject, definitions, preloader: this.preloader })

    this.definitions = definitions
    this.mashDestroy()
    this.selection = { mash }
    this.configureMash(mash)
    this.emitMash()
    this.goToTime()
    if (this.autoplay) this.paused = false
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
    const options: Any = {
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
    this.actionCreate(options)
  }

  moveEffect(effect: Effect, index = 0): void {
    // console.log(this.constructor.name, "moveEffects", effectOrArray, index)
    if (!isPositive(index)) throw Errors.argument + 'index'

    const { clip } = this.selection
    if (!clip) throw Errors.selection

    const transformable = clip as Transformable
    const { effects } = transformable
    const undoEffects = [...effects]
    const redoEffects = undoEffects.filter(e => e !== effect)
    const currentIndex = undoEffects.indexOf(effect)
    const insertIndex = currentIndex < index ? index - 1 : index
    redoEffects.splice(insertIndex, 0, effect)

    const options = {
      effects, undoEffects, redoEffects, type: ActionType.MoveEffect, transformable
    }
    this.actionCreate(options)
  }


  moveLayer(layer: Layer, layerAndPosition?: LayerAndPosition): void {
    const { cast } = this.selection
    assertCast(cast)
    assertLayer(layer)

    const redoSelection = { cast, layer }
    const options = { type: ActionType.MoveLayer, redoSelection, layerAndPosition }
    this.actionCreate(options)
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

  preloader: BrowserPreloaderClass

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
    this.actionCreate(options)
  }

  removeEffect(effect: Effect): void {
    const { clip } = this.selection
    if (!clip) throw Errors.selection

    const { effects } = <Transformable>clip
    const undoEffects = [...effects]
    const redoEffects = effects.filter(other => other !== effect)

    const options = {
      redoSelection: { ...this.selection, effect: undefined },
      effects,
      undoEffects,
      redoEffects,
      type: ActionType.MoveEffect
    }
    this.actionCreate(options)
  }

  removeLayer(layer: Layer): void {
    const { cast } = this.selection
    assertCast(cast)

    this.actionCreate({ type: ActionType.RemoveLayer, redoSelection: { cast, layer } })
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
        if (this.definitions.installed(temporaryId)) {
          const definition = this.definitions.fromId(temporaryId)
          return definition.id = permanentId
        }
        assertCast(edited)
        const mash = edited.mashes.find(mash => mash.id === temporaryId)
        assertMash(mash)
        mash.id = permanentId
      })
    }
    this.actions.save()
    this.eventTarget.dispatch(EventType.Action)
  }

  select(selectable: Selectable | SelectionType): void {
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

  selection: Selection = {}

  selectedProperties(selectTypes: SelectTypes = []): SelectedProperties {
    // TODO: support filtering based on selectTypes
    const properties: SelectedProperties = []
    const { mash, clip, effect, track, cast, layer } = this.selection
    if (mash) {
      if (track) {
        if (clip) {
          if (isTransformable(clip)) {
            properties.push(...clip.merger.properties.map(property => ({
              selectType: SelectType.Merger, property, changeHandler: this.changeMerger.bind(this),
              value: clip.merger.value(property.name)

            })))
            properties.push(...clip.scaler.properties.map(property => ({
              selectType: SelectType.Scaler, property, changeHandler: this.changeScaler.bind(this),
              value: clip.scaler.value(property.name)
            })))
            if (effect) properties.push(...effect.properties.map(property => ({
              selectType: SelectType.Effect, property, changeHandler: this.changeEffect.bind(this),
              value: effect.value(property.name)
            })))
          }
          clip.properties.forEach(property => {
            if (property.name === 'frame' && track.dense) return // set by track

            properties.push({
              selectType: SelectType.Clip, property,
              changeHandler: this.changeClip.bind(this),
              value: clip.value(property.name)
            })
          })
        }
        properties.push(...track.properties.map(property => ({
          selectType: SelectType.Track, property, changeHandler: this.changeTrack.bind(this),
          value: track.value(property.name)
        })))
      }
      properties.push(...mash.properties.map(property => ({
        selectType: SelectType.Mash, property, changeHandler: this.changeMash.bind(this),
        value: mash.value(property.name)
      })))
    }
    if (cast) {
      properties.push(...cast.properties.map(property => ({
        selectType: SelectType.Cast, property, changeHandler: this.changeCast.bind(this),
        value: cast.value(property.name)
      })))
      if (layer) {
        properties.push(...layer.properties.map(property => ({
          selectType: SelectType.Layer, property, changeHandler: this.changeLayer.bind(this),
          value: layer.value(property.name)
        })))
      }
    }
    return properties
  }

  split(): void {
    const { mash, clip } = this.selection
    if (!(mash && clip)) throw new Error(Errors.selection)


    if (!this.clipCanBeSplit(clip, this.time, mash.quantize)) {
      throw Errors.invalid.action
    }

    const scaled = this.time.scale(mash.quantize)
    const undoFrames = clip.frames
    const redoFrames = scaled.frame - clip.frame
    const insertClip = clip.copy as Clip
    insertClip.frames = undoFrames - redoFrames
    insertClip.frame = scaled.frame
    if (clip.propertyNames.includes("trim")) {
      (insertClip as AudibleFile).trim += redoFrames
    }
    const trackClips = mash.clipTrack(clip).clips
    const options = {
      type: ActionType.Split,
      splitClip: clip,
      insertClip,
      trackClips,
      redoFrames,
      undoFrames,
      index: 1 + trackClips.indexOf(clip),
      redoSelection: { ...this.selection, clip: insertClip, effect: undefined },
    }
    this.actionCreate(options)
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
    }
  }

  undo(): void {
    const { canUndo } = this.actions
    if (canUndo) this.handleAction(this.actions.undo())
  }

  private _visibleContext?: VisibleContext
  private get visibleContext(): VisibleContext {
    return this._visibleContext ||= ContextFactory.visible({ size: this.imageSize })
  }

  get visibleSources(): VisibleSources { return this.edited?.visibleSources || [] }

}
