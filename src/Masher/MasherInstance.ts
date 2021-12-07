import {
  Any,
  LoadPromise,
  SelectionValue,
  ScalarValue,
  UnknownObject,
  ContextData,
  Size,
} from "../declarations"
import {
  ActionType,
  ClipType,
  ClipTypes,
  DefinitionType,
  EventType,
  MasherAction,
  MoveType,
  TrackType,
  TransformType,
  TransformTypes,
} from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { Is, isPopulatedObject } from "../Utilities/Is"
import { sortByFrame } from "../Utilities/Sort"
import { Time } from "../Utilities/Time"
import { TimeRange } from "../Utilities/TimeRange"
import { Action } from "../Editing/Action/Action"
import { ActionFactory } from "../Editing/Action/ActionFactory"
import { ChangeAction } from "../Editing/Action/ChangeAction"
import { Actions } from "../Editing/Actions"
import { Factory } from "../Definitions/Factory/Factory"
import { DefinitionObject, DefinitionTimes } from "../Base/Definition"
import { Definitions } from "../Definitions"
import { Effect } from "../Mash/Effect/Effect"
import { EffectClass } from "../Mash/Effect/EffectInstance"
import { Mash } from "../Mash/Mash/Mash"
import { AudibleFile } from "../Mixin/AudibleFile/AudibleFile"
import { Clip } from "../Mixin/Clip/Clip"
import { Transformable } from "../Mixin/Transformable/Transformable"
import { Video } from "../Mash/Video/Video"
import { ClipOrEffect, Masher, MasherAddPromise, MasherObject, Selection } from "./Masher"
import { Default } from "../Setup/Default"
import { Cache } from "../Loading/Cache"
import { Emitter } from "../Utilities/Emitter"
import { MashFactory } from "../Mash/Mash/MashFactory"
import { Track } from "../Mash/Track/Track"


class MasherClass implements Masher {
  [index : string] : unknown
  constructor(...args: Any[]) {

    const [object] = args
    const {
      autoplay,
      precision,
      loop,
      fps,
      volume,
      buffer,
      mash,
    } = <MasherObject> object
    if (typeof autoplay !== "undefined") this.autoplay = autoplay
    if (typeof precision !== "undefined") this.precision = precision
    if (typeof loop !== "undefined") this._loop = loop
    if (typeof fps !== "undefined") this._fps = fps
    if (typeof volume !== "undefined") this._volume = volume
    if (typeof buffer !== "undefined") this._buffer = buffer
    if (mash) this.mash = mash


  }

  private actionCreate(object : UnknownObject) : void {
    const mash = object.mash || this.mash
    const actions = object.actions || this.actions
    const undoSelection = object.undoSelection || { ...this.selection }
    const redoSelection = object.redoSelection  || { ...this.selection }

    const clone : UnknownObject = {
      ...object,
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


  add(object : DefinitionObject, frameOrIndex = 0, trackIndex = 0) : MasherAddPromise {
    if (!Is.populatedObject(object)) throw Errors.argument + 'add'
    const { id } = object
    const definitionFromId = id && Definitions.installed(id) ? Definitions.fromId(id) : false
    const type = object.type || (definitionFromId && definitionFromId.type)
    if (!type) throw Errors.type + 'Masher.add ' + id + JSON.stringify(definitionFromId)

    if (type === DefinitionType.Effect) {
      const effectDefinition = Factory.effect.definition(object)
      const effect = effectDefinition.instance
      return this.addEffect(effect, frameOrIndex).then(() => effect)
    }
    const clipType = <ClipType> type

    if (!ClipTypes.includes(clipType)) throw Errors.type + type

    const definitionType = <DefinitionType> type
    const definition = Factory[definitionType].definition(object)

    const clip = <Clip> definition.instance //FromObject(object)

    return this.addClip(clip, frameOrIndex, trackIndex).then(() => clip)
  }

  addClip(clip : Clip, frameOrIndex = 0, trackIndex = 0) : LoadPromise {
    const { trackType } = clip

    const clips = [clip]
    const options : UnknownObject = {
      clip,
      type: ActionType.AddClipsToTrack,
      redoSelection: { clip: clip },
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
      clip.frame = track.frameForClipsNearFrame(clips, frameOrIndex)
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
    const redoSelectedEffects = [effect]
    redoEffects.splice(insertIndex, 0, effect)
    const options = {
      effects,
      undoEffects,
      redoEffects,
      redoSelectedEffects,
      type: ActionType.MoveEffects
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

  can(method : MasherAction) : boolean {
    // const z = this._selectedClips.length
    const { track, clip, effect } = this.selection
    switch (method) {
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
      default: throw Errors.argument
    }
  }

  change(property: string, value?: SelectionValue): void {
    if (this.selection.track) {
      if (this.selection.clip) {
        if (this.selection.effect) {
          this.changeEffect(property, value, this.selection.effect)
        } else this.changeClip(property, value, this.selection.clip)
      } else this.changeTrack(property, value, this.selection.track)
    } else throw Errors.selection
    //else this.changeMash(property, value)
  }

  changeClip(property : string, value? : SelectionValue, clip? : Clip) : void {
    // console.log(this.constructor.name, "changeClip", property)
    if (!Is.populatedString(property)) throw Errors.property + "changeClip " + property

    const [transform, transformProperty] = property.split(".")
    if (transformProperty) {
      this.changeTransformer(transform, transformProperty, value)
      return
    }
    const target = clip || this.selection.clip
    if (!target) throw Errors.selection

    const redoValue = typeof value === "undefined" ? target.value(property) : value

    if (this.currentActionReusable(target, property)) {
      const changeAction = <ChangeAction> this.actions.currentAction
      changeAction.updateAction(<ScalarValue> redoValue)
      this.handleAction(changeAction)
      return
    }
    const undoValue = target.value(property) //typeof value === "undefined" ? this.pristineOrThrow[property] : target.value(property)
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
        options.frames = target.frames + <number> options.undoValue
        break
      }
      default: options.type = ActionType.Change
    }
    this.actionCreate(options)
  }

  changeEffect(property : string, value? : SelectionValue, effect? : Effect) : void {
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

  changeTrack(property: string, value?: SelectionValue, track?: Track): void {
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

  changeTransformer(type : string, property : string, value?: SelectionValue) : void {
    // console.log(this.constructor.name, "changeTransformer", type, property)
    if (!Is.populatedString(type)) throw Errors.type + "changeTransformer " + type
    if (!Is.populatedString(property)) throw Errors.property + "changeTransformer " + property
    // if (!this._pristine) throw Errors.internal + "changeTransformer _pristine"

    const target = this.selection.clip
    if (!target) throw Errors.selection

    const transformType = <TransformType> type

    const transformable = <Transformable> target

    // make sure first component is merger or scaler
    if (!TransformTypes.includes(transformType)) throw Errors.property + "type " + type
    const transformTarget = transformable[transformType]
    const redoValue = typeof value === "undefined" ? transformTarget.value(property)  : value
    // const pristineTarget = this._pristine[transformType] ! replaced with transformTarget
    if (typeof transformTarget !== "object") throw Errors.internal + JSON.stringify(this._pristine)

    const undoValue = transformTarget[property]
    if (typeof undoValue === "undefined") throw Errors.property + 'pristine ' + property + JSON.stringify(transformTarget)

    const options : UnknownObject = { property, target: transformTarget, redoValue, undoValue, type: ActionType.Change }


    if (this.currentActionReusable(transformTarget, property)) {
      const changeAction = <ChangeAction> this.actions.currentAction
      changeAction.updateAction(redoValue)
      this.handleAction(changeAction)
      return
    }
    this.actionCreate(options)
  }

  private clipCanBeSplit(clip : Clip, time : Time, quantize : number) : boolean {
    if (!Is.object(clip)) return false

    // true if now intersects clip time, but is not start or end frame
    const range = TimeRange.fromTime(time)
    const clipRange = clip.timeRange(quantize)

    // ranges must intersect
    if (!clipRange.intersects(range)) return false

    const scaled = range.scale(clipRange.fps)
    if (scaled.frame === clipRange.frame) return false
    if (scaled.end === clipRange.end) return false

    return true
  }

  get clips(): Clip[] { return this.mash.clips }

  private currentActionReusable(target : unknown, property : string) : boolean {
    if (!this.actions.currentActionLast) return false

    const action = this.actions.currentAction
    if (!(action instanceof ChangeAction)) return false

    return action.target === target && action.property === property
  }

  get currentTime() : number { return this.mash.drawnTime ? this.mash.drawnTime.seconds : 0 }

  get duration() : number { return this.mash.duration }

  private get endTime() : Time { return this.mash.endTime.scale(this.fps, 'floor') }

  eventTarget  = new Emitter()

  private filterClipSelection(value : Clip | Clip[]) : Clip[] {
    const clips : Clip[] = Array.isArray(value) ? value : [value]

    const [firstClip] = clips
    if (!firstClip) return []

    const { trackType, track } = firstClip

    //  must all be on same track
    const trackClips = clips.filter(clip => (
      clip.track === track && clip.trackType === trackType
    )).sort(sortByFrame)

    if (track || trackType === TrackType.Audio) return trackClips

    // must be abutting each other on main track
    let abutting = true
    return trackClips.filter((clip : Clip, index : number) => {
      if (!abutting) return false

      if (index === trackClips.length - 1) return true

      abutting = clip.frame + clip.frames === trackClips[index + 1].frame
      return true
    })
  }

  private _fps = Default.masher.fps

  get fps() : number { return this._fps || this.mash.quantize }

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

  set frame(value : number) { this.goToTime(Time.fromArgs(Number(value), this.fps)) }

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
    const time = value ? value.scaleToFps(fps) : Time.fromArgs(0, fps)
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

  get imageData() : ContextData { return Cache.visibleContext.imageData }

  get imageSize() : Size { return Cache.visibleContext.size }

  set imageSize(value : Size) {
    const { width, height } = value
    if (!(Is.aboveZero(width) && Is.aboveZero(height))) throw Errors.invalid.size

    Cache.visibleContext.size = value
    this.loadMashAndDraw()
  }

  private loadMashAndDraw(): LoadPromise {
    const promise = this.mash.loadPromise
    if (promise) return promise.then(() => {
      this.mash.compositeVisible()
    })

    this.mash.compositeVisible()
    return Promise.resolve()
  }

  get loadedDefinitions() : DefinitionTimes { return this.mash.loadedDefinitions }

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

    const instance = MashFactory.instance()
    this.mash =instance
    return instance
  }

  set mash(object: Mash) {
    if (this._mash === object) return
    this.paused = true
    if (this._mash) this._mash.destroy()

    this._selectedEffects = []
    this._mash = object
    this._mash.buffer = this.buffer
    this._mash.gain = this.gain
    this._mash.loop = this.loop
    this._mash.emitter = this.eventTarget
    if (this._actions) {
      this._actions.destroy()
      this._actions.mash = this._mash
    }

    this.selectedClips = [] // so mash gets copied into _pristine

    this.eventTarget.emit(EventType.Mash)
    this.eventTarget.emit(EventType.Track)
    this.eventTarget.emit(EventType.Duration)
    this.eventTarget.emit(EventType.Action)

    this.goToTime()
    if (this.autoplay) this.paused = false
  }

  move(objectOrArray : ClipOrEffect | ClipOrEffect[], moveType : MoveType, frameOrIndex = 0, trackIndex = 0) : void {
    if (!Is.object(objectOrArray)) throw Errors.argument + 'move'

    if (moveType === MoveType.Effect) {
      this.moveEffects(<Effect | Effect[]> objectOrArray, frameOrIndex)
      return
    }

    this.moveClips(<Clip | Clip[]>objectOrArray, frameOrIndex, trackIndex)
  }

  moveClips(clipOrArray : Clip | Clip[], frameOrIndex = 0, trackIndex = 0) : void {
    // console.log("moveClips", "frameOrIndex", frameOrIndex, "trackIndex", trackIndex)
    if (!Is.positive(frameOrIndex)) throw Errors.argument + 'moveClips frameOrIndex'
    if (!Is.positive(trackIndex)) throw Errors.argument + 'moviClips trackIndex'

    const clips = this.filterClipSelection(clipOrArray)
    if (!Is.populatedArray(clips)) throw Errors.argument + 'moveClips clips'

    const [firstClip] = clips
    const { trackType, track: undoTrackIndex } = firstClip
    const options : Any = {
      clips,
      trackType,
      trackIndex,
      undoTrackIndex,
      type: ActionType.MoveClips
    }

    const redoTrack = this.mash.trackOfTypeAtIndex(trackType, trackIndex)
    const undoTrack = this.mash.trackOfTypeAtIndex(trackType, undoTrackIndex)
    const currentIndex = redoTrack.clips.indexOf(firstClip)

    if (redoTrack.dense) options.insertIndex = frameOrIndex
    if (undoTrack.dense) {
      options.undoInsertIndex = currentIndex
      if (frameOrIndex < currentIndex) options.undoInsertIndex += clips.length
    }

    if (!(redoTrack.dense && undoTrack.dense)) {
      const frames = clips.map(clip => clip.frame)
      const insertFrame = redoTrack.frameForClipsNearFrame(clips, frameOrIndex)
      const offset = insertFrame - firstClip.frame
      if (!offset) return // because there would be no change

      options.undoFrames = frames
      options.redoFrames = frames.map(frame => frame + offset)
    }
    this.actionCreate(options)
  }

  moveEffects(effectOrArray : Effect | Effect[], index = 0) : void {
    // console.log(this.constructor.name, "moveEffects", effectOrArray, index)
    if (!Is.positive(index)) throw Errors.argument

    const array = Array.isArray(effectOrArray) ? effectOrArray : [effectOrArray]
    const moveEffects = array.filter(effect => effect instanceof EffectClass)
    if (!Is.populatedArray(moveEffects)) throw Errors.argument

    const { clip } = this.selection
    if (!clip) throw Errors.selection


    const { effects } = <Transformable> clip
    const undoEffects = [...effects]

    const redoEffects : Effect[] = []
    undoEffects.forEach((effect, i) => {
      if (i === index) redoEffects.push(...moveEffects)
      if (moveEffects.includes(effect)) return

      redoEffects.push(effect)
    })

    const options = {
      effects, undoEffects, redoEffects, type: ActionType.MoveEffects
    }
    // console.log(this.constructor.name, "moveEffects", options)
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

  get paused() : boolean { return this.mash.paused }

  set paused(value : boolean) { if (this._mash) this.mash.paused = !!value }

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
    this.goToTime(Time.fromSeconds(this.duration * Number(value), this.fps))
  }

  get positionStep() : number {
    return parseFloat(`0.${"0".repeat(this.precision - 1)}1`)
  }

  precision = Default.masher.precision

  redo() : void { if (this.actions.canRedo) this.handleAction(this.actions.redo()) }

  remove(): void {
    if (this.selection.effect) this.removeEffects(this.selection.effect)
    else if (this.selection.clip) this.removeClips(this.selection.clip)
    else if (this.selection.track) this.mash.removeTrack(this.selection.track.trackType)
    else throw Errors.selection
  }

  removeClips(clipOrArray : Clip | Clip[]) : void {
    const clips = this.filterClipSelection(clipOrArray)
    if (!Is.populatedArray(clips)) throw Errors.argument

    const [firstClip] = clips
    const track = this.mash.clipTrack(firstClip)
    const options = {
      redoSelection: {},
      clips,
      track,
      index: track.clips.indexOf(firstClip),
      type: ActionType.RemoveClips
    }
    this.actionCreate(options)
  }

  removeEffects(effectOrArray : Effect | Effect[]) : void {
    const array = Array.isArray(effectOrArray) ? effectOrArray : [effectOrArray]
    const removeEffects = array.filter(effect => effect instanceof EffectClass)
    if (!Is.populatedArray(removeEffects)) throw Errors.argument

    const { clip } = this.selection
    if (!clip) throw Errors.selection

    const { effects } = <Transformable> clip
    const undoEffects = [...effects]
    const redoEffects = effects.filter(effect => !removeEffects.includes(effect))

    const options = {
      redoSelectedEffects: [],
      effects,
      undoEffects,
      redoEffects,
      type: ActionType.MoveEffects
    }
    this.actionCreate(options)
  }

  save() : void { this.actions.save() }

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

  private _selection: Selection = {}

  get selection(): Selection { return this._selection }

  set selection(value: Selection) {
    if (!value) {
      console.trace(this.constructor.name, "selection with no value")
      throw Errors.internal
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
    const insertClip = splitClip.copy
    insertClip.frames = undoFrames - redoFrames
    insertClip.frame = scaled.frame
    if (splitClip.propertyNames.includes("trim")) {
      (<AudibleFile> insertClip).trim += redoFrames
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

  get time() : Time { return this.mash.time }

  set time(value: Time) { this.goToTime(value) }

  get timeRange() : TimeRange { return this.mash.timeRange }

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

export { MasherClass }
