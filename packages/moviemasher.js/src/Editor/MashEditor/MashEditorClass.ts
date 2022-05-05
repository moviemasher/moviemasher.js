import {
  Any,
  LoadPromise,
  UnknownObject,
  VisibleContextData,
  Size,
  SelectedProperties,
  Scalar,
} from "../../declarations"
import {
  ActionType,
  ClipType,
  ClipTypes,
  DefinitionType,
  EditType,
  EventType,
  MasherAction,
  SelectType,
  TrackType,
  TransformType,
  TransformTypes,
} from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Is } from "../../Utility/Is"
import { Time } from "../../Helpers/Time/Time"
import { TimeRange } from "../../Helpers/Time/Time"
import { Action, ActionObject, ActionOptions } from "./Actions/Action/Action"
import { ActionFactory } from "./Actions/Action/ActionFactory"
import { ChangeAction } from "./Actions/Action/ChangeAction"
import { Actions } from "./Actions/Actions"
import { Factory } from "../../Definitions/Factory/Factory"
import { DefinitionObject } from "../../Base/Definition"
import { Effect } from "../../Media/Effect/Effect"
import { AudibleFile } from "../../Mixin/AudibleFile/AudibleFile"
import { Clip, Clips } from "../../Mixin/Clip/Clip"
import { Transformable } from "../../Mixin/Transformable/Transformable"
import { Video } from "../../Media/Video/Video"
import { ClipOrEffect, MashEditor, MashEditorObject, MashEditorSelection } from "./MashEditor"
import { Default } from "../../Setup/Default"
import { Emitter } from "../../Helpers/Emitter"
import { Track } from "../../Media/Track/Track"
import { EditorClass } from "../EditorClass"
import { Mash } from "../../Edited/Mash/Mash"
import { mashInstance } from "../../Edited/Mash/MashFactory"
import { timeFromArgs, timeFromSeconds, timeRangeFromTime } from "../../Helpers/Time/TimeUtilities"
import { DataMashGetResponse } from "../../Api/Data"
import { EditorDefinitionsClass } from "../EditorDefinitions/EditorDefinitionsClass"

export class MashEditorClass extends EditorClass implements MashEditor {
  constructor(...args: Any[]) {
    super(...args)
    const [object] = args
    const {
      autoplay,
      precision,
      loop,
      fps,
      volume,
      buffer,
      mash,
    } = <MashEditorObject> object
    if (typeof autoplay !== "undefined") this.autoplay = autoplay
    if (typeof precision !== "undefined") this.precision = precision
    if (typeof loop !== "undefined") this._loop = loop
    if (typeof fps !== "undefined") this._fps = fps
    if (typeof volume !== "undefined") this._volume = volume
    if (typeof buffer !== "undefined") this._buffer = buffer
    if (mash) this.mash = mash
  }

  private actionCreate(object : ActionObject): void {
    const mash = object.mash || this.mash
    const actions = object.actions || this.actions
    const undoSelection = object.undoSelection || { ...this.selection }
    const redoSelection = object.redoSelection  || { ...this.selection }

    const type = object.type || ActionType.Change
    const clone : ActionOptions = {
      ...object,
      type,
      actions,
      mash,
      undoSelection,
      redoSelection,
    }
    const action = ActionFactory.createFromObject(clone)
    this.actions.add(action)
    this.handleAction(this.actions.redo())
  }

  private _actions? : Actions

  private get actions() : Actions {
    if (!this._actions) {
      this._actions = new Actions({ mash: this.mash })
    }
    return this._actions
  }


  add(object : DefinitionObject, frameOrIndex = 0, trackIndex = 0) : Promise<ClipOrEffect> {
    if (!Is.populatedObject(object)) throw Errors.argument + 'add'
    const { id } = object
    const definitionFromId = id && this.definitions.installed(id) ? this.definitions.fromId(id) : false
    const type = object.type || (definitionFromId && definitionFromId.type)
    if (!type) throw Errors.type + 'MashEditor.add ' + id + JSON.stringify(definitionFromId)

    if (type === DefinitionType.Effect) {
      const effect = Factory.effect.definition(object).instance
      return this.addEffect(effect, frameOrIndex).then(() => effect)
    }
    const clipType = type as ClipType

    if (!ClipTypes.includes(clipType)) throw Errors.type + type

    const definitionType = <DefinitionType> type
    const definition = Factory[definitionType].definition(object)
    const clip = definition.instance as Clip

    return this.addClip(clip, frameOrIndex, trackIndex).then(() => clip)
  }

  addClip(clip : Clip, frameOrIndex = 0, trackIndex = 0) : LoadPromise {
    const { trackType } = clip

    const options : ActionObject = {
      clip,
      type: ActionType.AddClipToTrack,
      redoSelection: { clip },
      trackType,
    }
    const tracksOfType = this.mash.tracks.filter(track => track.trackType === trackType)
    const track = tracksOfType[trackIndex]
    const trackCount = tracksOfType.length
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

  addEffect(effect : Effect, insertIndex = 0) : LoadPromise {
    // console.log(this.constructor.name, "addEffect", object, index)
    const { clip } = this.selection
    if (!clip) throw Errors.selection

    const { effects } = <Transformable> clip
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

  addTrack(trackType = TrackType.Video) : void {
    this.actionCreate({ trackType, type: ActionType.AddTrack })
  }

  autoplay = Default.masher.autoplay

  private _buffer = Default.masher.buffer

  get buffer() : number { return this._buffer }

  set buffer(value: number) {
    const number = Number(value)
    if (this._buffer !== number) {
      this._buffer = number
      this.mash.buffer = number
    }
  }

  can(masherAction: MasherAction): boolean {
    // console.log(this.constructor.name, "can", masherAction)
    // const z = this._selectedClips.length
    const { track, clip, effect } = this.selection
    switch (masherAction) {
      case MasherAction.Save: return this.actions.canSave
      case MasherAction.Undo: return this.actions.canUndo
      case MasherAction.Redo: return this.actions.canRedo
      case MasherAction.Remove: return !!(
        effect
        || clip
        || (track && this.mash.trackCount(track.trackType) === track.layer + 1)
      )
      case MasherAction.Split: return !!clip && this.clipCanBeSplit(clip, this.time, this.mash.quantize)
      case MasherAction.Freeze: return (
        !!clip
        && DefinitionType.Video === clip.type
        && this.clipCanBeSplit(clip, this.time, this.mash.quantize)
      )
      default: throw Errors.argument + 'can'
    }
  }

  // change(property: string, value?: Scalar): void {
  //   if (this.selection.track) {
  //     if (this.selection.clip) {
  //       // if (this.selection.effect) {
  //       //   this.changeEffect(property, value, this.selection.effect)
  //       // } else
  //       this.changeClip(property, value, this.selection.clip)
  //     } else this.changeTrack(property, value, this.selection.track)
  //   } else throw Errors.selection
  //   //else this.changeMash(property, value)
  // }

  private changeClip(property : string, value : Scalar) : void {
    // console.log(this.constructor.name, "changeClip", property)
    if (!Is.populatedString(property)) throw Errors.property + "changeClip " + property

    const target = this.selection.clip
    if (!target) throw Errors.selection

    const redoValue = typeof value === "undefined" ? target.value(property) : value

    if (this.currentActionReusable(target, property)) {
      const changeAction = this.actions.currentAction as ChangeAction
      changeAction.updateAction(redoValue)
      this.handleAction(changeAction)
      return
    }
    const undoValue = target.value(property)
    const options : UnknownObject = { property, target, redoValue, undoValue }

    switch (options.property) {
      case 'frames': {
        options.type = ActionType.ChangeFrames
        break
      }
      case 'trim': {
        options.type = ActionType.ChangeTrim
        // TODO: make sure there's a test for this
        // not sure where this was derived from - using original clip??
        options.frames = target.frames + Number(options.undoValue)
        break
      }
      default: options.type = ActionType.Change
    }
    this.actionCreate(options)
  }

  private changeEffect(property : string, value : Scalar, effect? : Effect) : void {
    // console.log(this.constructor.name, "changeEffect", property)
    if (!Is.populatedString(property)) throw Errors.property

    const target = effect || this.selection.effect
    if (!target) throw Errors.selection

    const redoValue = typeof value === "undefined" ? target.value(property) : value

    if (this.currentActionReusable(target, property)) {
      const changeAction = <ChangeAction> this.actions.currentAction
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

  private changeMash(property: string, value: Scalar): void {
    // console.log(this.constructor.name, "changeClip", property)
    if (!Is.populatedString(property)) throw Errors.property + "changeClip " + property

    const target = this.mash

    const redoValue = typeof value === "undefined" ? target.value(property) : value

    if (this.currentActionReusable(target, property)) {
      const changeAction = this.actions.currentAction as ChangeAction
      changeAction.updateAction(redoValue)
      this.handleAction(changeAction)
      return
    }
    const undoValue = target.value(property)
    const options: UnknownObject = {
      property, target, redoValue, undoValue, type: ActionType.Change
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
    if (!Is.populatedString(property)) throw Errors.property

    const target = track || this.selection.track
    if (!target) throw Errors.selection

    const redoValue = typeof value === "undefined" ? target.value(property) : value
    if (this.currentActionReusable(target, property)) {
      const changeAction = <ChangeAction> this.actions.currentAction
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


  private changeTransformer(type : string, property : string, value: Scalar) : void {
    // console.log(this.constructor.name, "changeTransformer", type, property)
    if (!Is.populatedString(type)) throw Errors.type + "changeTransformer " + type
    if (!Is.populatedString(property)) throw Errors.property + "changeTransformer " + property

    const target = this.selection.clip
    if (!target) throw Errors.selection

    const transformType = type as TransformType
    const transformable = target as Transformable

    // make sure first component is merger or scaler
    if (!TransformTypes.includes(transformType)) throw Errors.property + "type " + type
    const transformTarget = transformable[transformType]
    const redoValue = typeof value === "undefined" ? transformTarget.value(property)  : value
    if (typeof transformTarget !== "object") throw Errors.internal + 'transformTarget'

    const undoValue = transformTarget[property]
    if (typeof undoValue === "undefined") throw Errors.property + property + JSON.stringify(transformTarget)

    const options : UnknownObject = { property, target: transformTarget, redoValue, undoValue, type: ActionType.Change }

    if (this.currentActionReusable(transformTarget, property)) {
      const changeAction = <ChangeAction> this.actions.currentAction
      changeAction.updateAction(redoValue)
      this.handleAction(changeAction)
      return
    }
    this.actionCreate(options)
  }

  clear(): void {
    this.mash = mashInstance()
  }

  private clipCanBeSplit(clip : Clip, time : Time, quantize : number) : boolean {
    if (!Is.object(clip)) return false

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

  get clips(): Clips { return this.mash.clips }

  private currentActionReusable(target : unknown, property : string) : boolean {
    if (!this.actions.currentActionLast) return false

    const action = this.actions.currentAction
    if (!(action instanceof ChangeAction)) return false

    return action.target === target && action.property === property
  }

  get currentTime(): number { return this.mash.drawnTime ? this.mash.drawnTime.seconds : 0 }

  get duration(): number { return this.mash.duration }

  editType = EditType.Mash

  get edited(): Mash { return this.mash }
  set edited(value: Mash) { this.mash = value }

  private get endTime(): Time { return this.mash.endTime.scale(this.fps, 'floor') }

  eventTarget  = new Emitter()

  private _fps = Default.masher.fps

  get fps(): number { return this._fps || this.mash.quantize }

  set fps(value: number) {
    const number = Number(value)
    // setting to zero means fallback to mash rate
    if (this._fps !== number) {
      this._fps = number
      this.eventTarget.emit(EventType.Fps)
      this.time = this.time.scale(this.fps)
    }
  }

  get frame() : number { return this.time.frame }

  set frame(value : number) { this.goToTime(timeFromArgs(Number(value), this.fps)) }

  get frames() : number { return this.endTime.frame }

  freeze() : void {
    const { clip } = this.selection
    if (!clip) throw Errors.selection

    if (!this.clipCanBeSplit(clip, this.time, this.mash.quantize)) {
      throw Errors.invalid.action
    }
    if (DefinitionType.Video !== clip.type) {
      throw Errors.invalid.action
    }
    const freezeClip = <Video> clip
    const scaled = this.time.scale(this.mash.quantize)
    const trackClips = this.mash.clipTrack(freezeClip).clips
    const insertClip = freezeClip.copy
    const frozenClip = freezeClip.copy

    const options = {
      frames: freezeClip.frames - (scaled.frame - freezeClip.frame),
      freezeClip,
      frozenClip,
      insertClip,
      trackClips,
      redoSelection: { clip: frozenClip },
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

  private get gain() : number { return this.muted ? 0.0 : this.volume }

  goToTime(value?: Time): LoadPromise {
    const { fps } = this
    const time = value ? value.scaleToFps(fps) : timeFromArgs(0, fps)
    const min = time.min(this.endTime)
    if (value && min.equalsTime(this.time)) return Promise.resolve()

    const promise = this.mash.seekToTime(min)
    if (promise) return promise

    return Promise.resolve()
  }

  private handleAction(action: Action): void {
    this.selection = action.selection
    this.mash.handleAction(action)
  }

  get imageData(): VisibleContextData { return this.mash.imageData }

  _imageSize: Size = { width: 300, height: 150 }

  get imageSize() : Size { return this._imageSize }
  set imageSize(value: Size) {
    const { width, height } = value
    const size = { width, height }
    Object.assign(this._imageSize, size)
    this.mash.imageSize = size
    // console.log(this.constructor.name, "imageSize", size)
  }

  private loadMashAndDraw(): LoadPromise {
    return this.mash.loadPromise().then(() => { this.mash.draw() })
  }

  loadData(data: DataMashGetResponse): void {
    const { mash: mashObject, definitions: definitionObjects } = data
    const definitions = new EditorDefinitionsClass(definitionObjects)
    const mash = mashInstance(mashObject, definitions)
    this.definitions = definitions
    this.edited = mash
  }


  private _loop = Default.masher.loop

  get loop() : boolean { return this._loop }

  set loop(value: boolean) {
    const boolean = !!value
    this._loop = boolean
    if (this._mash) this.mash.loop = boolean
  }

  private _mash? : Mash
  get mash() : Mash {
    if (this._mash) return this._mash

    const instance = mashInstance()
    this.mash = instance
    return instance
  }

  set mash(object: Mash) {
    if (this._mash === object) return

    this.paused = true
    if (this._mash) {
      this.preloader.flushFilesExcept()
      this._mash.destroy()
    }

    this._mash = object
    this._mash.buffer = this.buffer
    this._mash.gain = this.gain
    this._mash.loop = this.loop
    this._mash.emitter = this.eventTarget
    this._mash.preloader = this.preloader
    this._mash.imageSize = this._imageSize
    if (this._actions) {
      this._actions.destroy()
      this._actions.mash = this._mash
    }

    this.eventTarget.emit(EventType.Mash)
    this.eventTarget.emit(EventType.Track)
    this.eventTarget.emit(EventType.Duration)
    this.eventTarget.emit(EventType.Action)

    this.selection = {}
    this.goToTime()
    if (this.autoplay) this.paused = false
  }

  move(object: ClipOrEffect, frameOrIndex = 0, trackIndex = 0) : void {
    if (!Is.object(object)) throw Errors.argument + 'move'
    const { type } = object
    if (type === DefinitionType.Effect) {
      this.moveEffect(<Effect> object, frameOrIndex)
      return
    }

    this.moveClip(<Clip>object, frameOrIndex, trackIndex)
  }

  moveClip(clip: Clip, frameOrIndex = 0, trackIndex = 0) : void {
    // console.log("moveClip", "frameOrIndex", frameOrIndex, "trackIndex", trackIndex)
    if (!Is.positive(frameOrIndex)) throw Errors.argument + 'moveClip frameOrIndex'
    if (!Is.positive(trackIndex)) throw Errors.argument + 'moveClip trackIndex'

    const { trackType, track: undoTrackIndex } = clip
    const options : Any = {
      clip,
      trackType,
      trackIndex,
      undoTrackIndex,
      type: ActionType.MoveClip
    }

    const redoTrack = this.mash.trackOfTypeAtIndex(trackType, trackIndex)
    const undoTrack = this.mash.trackOfTypeAtIndex(trackType, undoTrackIndex)
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

  moveEffect(effect: Effect, index = 0) : void {
    // console.log(this.constructor.name, "moveEffects", effectOrArray, index)
    if (!Is.positive(index)) throw Errors.argument + 'index'

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

  private _muted = false
  get muted() : boolean { return this._muted }
  set muted(value: boolean) {
    const boolean = !!value
    if (this._muted !== boolean) {
      this._muted = boolean
      this.mash.gain = this.gain
    }
  }

  pause() : void { this.paused = true }

  get paused(): boolean { return this.mash.paused }
  set paused(value: boolean) { if (this._mash) this.mash.paused = !!value }

  play() : void { this.paused = false }

  get position() : number {
    let per = 0
    if (this.time.frame) {
      per = this.time.seconds / this.duration
      if (per !== 1) per = parseFloat(per.toFixed(this.precision))
    }
    return per
  }
  set position(value : number) {
    this.goToTime(timeFromSeconds(this.duration * Number(value), this.fps))
  }

  get positionStep() : number {
    return parseFloat(`0.${"0".repeat(this.precision - 1)}1`)
  }

  precision = Default.masher.precision

  redo() : void { if (this.actions.canRedo) this.handleAction(this.actions.redo()) }

  remove(): void {
    if (this.selection.effect) this.removeEffect(this.selection.effect)
    else if (this.selection.clip) this.removeClip(this.selection.clip)
    else if (this.selection.track) this.removeTrack(this.selection.track)
    else throw Errors.selection
  }

  removeClip(clip : Clip) : void {
    const track = this.mash.clipTrack(clip)
    const options = {
      redoSelection: {},
      clip,
      track,
      index: track.clips.indexOf(clip),
      type: ActionType.RemoveClip
    }
    this.actionCreate(options)
  }

  removeEffect(effect: Effect) : void {
    const { clip } = this.selection
    if (!clip) throw Errors.selection

    const { effects } = <Transformable> clip
    const undoEffects = [...effects]
    const redoEffects = effects.filter(other => other !== effect)

    const options = {
      redoSelection: { clip: this.selection.clip },
      effects,
      undoEffects,
      redoEffects,
      type: ActionType.MoveEffect
    }
    this.actionCreate(options)
  }

  removeTrack(track: Track): void {
    // TODO: create remove track action...
    console.debug(this.constructor.name, "removeTrack coming soon...")
  }

  save(id?: string): void {
    if (id) this.mash.id = id
    this.actions.save()
    this.eventTarget.emit(EventType.Action)
  }

  selectClip(clip: Clip | undefined): void {
    const track = clip ? this.mash.clipTrack(clip) : this.selection.track
    this.selection = { track, clip }
  }

  selectEffect(effect: Effect | undefined): void {
    this.selection = { ...this.selection, effect }
  }

  selectTrack(track: Track | undefined): void {
    this.selection = { track }
  }

  get selectedProperties(): SelectedProperties {
    const properties: SelectedProperties = []
    properties.push(...this.mash.properties.map(property => ({
      selectType: SelectType.Mash, property, changeHandler: this.changeMash.bind(this),
      value: this.mash.value(property.name)
    })))
    const { clip, effect, track } = this.selection
    if (track) {
      properties.push(...track.properties.map(property => ({
        selectType: SelectType.Track, property, changeHandler: this.changeTrack.bind(this),
        value: track.value(property.name)
      })))
      if (clip) {
        clip.properties.forEach(property => {
          if (property.name === 'frame' && track.dense) return // set by track

          properties.push({
            selectType: SelectType.Clip, property,
            changeHandler: this.changeClip.bind(this),
            value: clip.value(property.name)
          })
        })
        if (clip.transformable) {
          const transformable = clip as Transformable
          properties.push(...transformable.merger.properties.map(property => ({
            selectType: SelectType.Merger, property, changeHandler: this.changeMerger.bind(this),
            value: transformable.merger.value(property.name)

          })))
          properties.push(...transformable.scaler.properties.map(property => ({
            selectType: SelectType.Scaler, property, changeHandler: this.changeScaler.bind(this),
            value: transformable.scaler.value(property.name)
          })))
          if (effect) properties.push(...effect.properties.map(property => ({
            selectType: SelectType.Effect, property, changeHandler: this.changeEffect.bind(this),
            value: effect.value(property.name)
          })))
        }
      }
    }
    return properties
  }

  private _selection: MashEditorSelection = {}

  get selection(): MashEditorSelection { return this._selection }

  set selection(value: MashEditorSelection) {
    if (!value) {
      console.trace(this.constructor.name, "selection with no value")
      throw Errors.internal + 'set selection'
    }
    const { clip, track, effect } = value

    this.selection.effect = effect
    this.selection.clip = clip
    this.selection.track = track || (clip ? this.mash.clipTrack(clip) : undefined)
    this.eventTarget.emit(EventType.Selection)
  }

  split() : void {
    const splitClip = this.selection.clip
    if (!splitClip) throw Errors.selection

    if (!this.clipCanBeSplit(splitClip, this.time, this.mash.quantize)) {
      throw Errors.invalid.action
    }

    const scaled = this.time.scale(this.mash.quantize)
    const undoFrames = splitClip.frames
    const redoFrames = scaled.frame - splitClip.frame
    const insertClip = splitClip.copy as Clip
    insertClip.frames = undoFrames - redoFrames
    insertClip.frame = scaled.frame
    if (splitClip.propertyNames.includes("trim")) {
      (insertClip as AudibleFile).trim += redoFrames
    }
    const trackClips = this.mash.clipTrack(splitClip).clips
    const options = {
      type: ActionType.Split,
      splitClip,
      insertClip,
      trackClips,
      redoFrames,
      undoFrames,
      index: 1 + trackClips.indexOf(splitClip),
      redoSelection: { clip: insertClip },
      undoSelection: { clip: splitClip },
    }
    this.actionCreate(options)
  }

  get time(): Time { return this.mash.time }

  set time(value: Time) { this.goToTime(value) }

  get timeRange(): TimeRange { return this.mash.timeRange }

  undo() : void { if (this.actions.canUndo) this.handleAction(this.actions.undo()) }

  private _volume = Default.masher.volume

  get volume() : number { return this._volume }

  set volume(value: number) {
    const number = Number(value)
    if (this._volume !== number) {
      if (!Is.positive(number)) throw Errors.invalid.volume
      this._volume = number
      if (Is.aboveZero(number)) this.muted = false

      this.mash.gain = this.gain
    }
  }
}
