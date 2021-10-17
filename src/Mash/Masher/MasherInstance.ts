import {
  Any,
  ContextElement,
  LoadPromise,
  SelectionValue,
  ScalarValue,
  SelectionObject,
  UnknownObject
} from "../../declarations"
import {
  ActionType,
  ClipType,
  ClipTypes,
  DefinitionType,
  EventType,
  MoveType,
  TrackType,
  TransformType,
  TransformTypes
} from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Id } from "../../Utilities/Id"
import { Is } from "../../Utilities/Is"
import { byFrame } from "../../Utilities/Sort"
import { Time } from "../../Utilities/Time"
import { TimeRange } from "../../Utilities/TimeRange"
import { Action } from "../../Editing/Action/Action"
import { ActionFactory } from "../../Editing/Action/ActionFactory"
import { ChangeAction } from "../../Editing/Action/ChangeAction"
import { Actions } from "../../Editing/Actions/Actions"
import { MovieMasher } from "../../MovieMasher/MovieMasher"
import { AudibleContext } from "../../Playing/AudibleContext"
import { ContextFactory } from "../../Playing/ContextFactory"
import { Definition, DefinitionObject, DefinitionTimes } from "../Definition/Definition"
import { Definitions } from "../Definitions"
import { Effect } from "../Effect/Effect"
import { EffectClass } from "../Effect/EffectInstance"
import { InstanceClass } from "../Instance/Instance"
import { Mash, MashObject, MashOptions } from "../Mash/Mash"
import { Audible } from "../Mixin/Audible/Audible"
import { Clip } from "../Mixin/Clip/Clip"
import { Transformable } from "../Mixin/Transformable/Transformable"
import { Video } from "../Video/Video"
import { ClipOrEffect, Masher, MasherAddPromise, MasherObject } from "./Masher"
import { Default } from "../../Setup/Default";
import { VisibleContext } from "../../Playing";
import { TrackRange } from "../../Utilities"
import { Visible } from "../Mixin/Visible/Visible"

class MasherClass extends InstanceClass implements Masher {
  [index : string] : unknown
  constructor(...args : Any[]) {
    super(...args)
    this._id ||= Id()

    // console.log("Masher constructor", this.id)
    const [object] = args
    const {
      autoplay,
      precision,
      loop,
      fps,
      volume,
      buffer,
      audibleContext,
      mash,
      canvas,
    } = <MasherObject> object
    if (typeof autoplay !== "undefined") this.autoplay = autoplay
    if (typeof precision !== "undefined") this.precision = precision
    if (typeof loop !== "undefined") this._loop = loop

    if (typeof audibleContext !== "undefined") this._audibleContext = audibleContext

    if (canvas) this.visibleContext = ContextFactory.fromCanvas(canvas)
    else this.visibleContext = ContextFactory.visible()

    if (typeof fps !== "undefined") this._fps = fps
    if (typeof volume !== "undefined") this._volume = volume
    if (typeof buffer !== "undefined") this._buffer = buffer
    if (mash) this.mash = mash
  }

  private actionCreate(object : UnknownObject) : void {
    const mash = object.mash || this.mash
    const actions = object.actions || this.actions
    const undoSelectedClips = object.undoSelectedClips || this.selectedClips
    const undoSelectedEffects = object.undoSelectedEffects  || this.selectedEffects
    const redoSelectedClips = object.redoSelectedClips  || this.selectedClips
    const redoSelectedEffects = object.redoSelectedEffects  || this.selectedEffects

    const clone : UnknownObject = {
      ...object,
      actions,
      mash,
      undoSelectedClips,
      undoSelectedEffects,
      redoSelectedClips,
      redoSelectedEffects,
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
      const effectDefinition = MovieMasher.effect.definition(object)
      const effect = effectDefinition.instance
      return this.addEffect(effect, frameOrIndex).then(() => effect)
    }
    const clipType = <ClipType> type

    if (!ClipTypes.includes(clipType)) throw Errors.type + type

    const definitionType = <DefinitionType> type
    const definition = MovieMasher[definitionType].definition(object)

    const clip = <Clip> definition.instance

    return this.addClip(clip, frameOrIndex, trackIndex).then(() => clip)
  }

  addClip(clip : Clip, frameOrIndex = 0, trackIndex = 0) : LoadPromise {
    const { trackType } = clip

    const clips = [clip]
    const options : UnknownObject = {
      clip,
      type: ActionType.AddClipsToTrack,
      redoSelectedClips: clips,
      trackType,
    }
    const track = this.mash.trackOfTypeAtIndex(trackType, trackIndex)
    const trackCount = this.mash[trackType].length
    if (track.isMainVideo) {
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
    const { effects } = <Transformable> this.selectedClipOrThrow
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

  private _audibleContext? : AudibleContext

  get audibleContext() : AudibleContext {
    if (!this._audibleContext) {
      this._audibleContext = ContextFactory.audible()
      if (this._mash) this.mash.audibleContext = this._audibleContext
    }
    return this._audibleContext
  }

  set audibleContext(value : AudibleContext) {
    if (this._audibleContext !== value) {
      this._audibleContext = value
      if (this._mash) this.mash.audibleContext = value
    }
  }

  autoplay = Default.masher.autoplay

  private _buffer = Default.masher.buffer

  get buffer() : number { return this._buffer }

  set buffer(value : number) {
    if (this._buffer !== value) {
      this._buffer = value
      this.mash.buffer = value
    }
  }

  can(method : string) : boolean {
    const z = this._selectedClips.length
    switch (method) {
      case 'save': return this.actions.canSave
      case 'undo': return this.actions.canUndo
      case 'redo': return this.actions.canRedo
      case 'copy': return z > 0
      case 'cut':
      case 'remove': return !!z // TODO: check removing won't create transition problem
      case 'split': return z === 1 && this.clipCanBeSplit(this.selectedClipOrThrow, this.time, this.mash.quantize)
      case 'freeze': return (
        z === 1
        && DefinitionType.Video === this.selectedClipOrThrow.type
        && this.clipCanBeSplit(this.selectedClipOrThrow, this.time, this.mash.quantize)
      )
      default: throw Errors.argument
    }
  }

  get canvas() : ContextElement { return this.visibleContext.canvas }

  set canvas(value : ContextElement) {
    if (!value) throw Errors.invalid.canvas

    // make sure canvas hasn't been stretched
    const style = window.getComputedStyle(value)
    const { width, height } = style
    if (!(width && height)) throw Errors.invalid.canvas

    const widthTrimmed = Number(width.slice(0, -2))
    const heightTrimmed = Number(height.slice(0, -2))
    if (Is.nan(widthTrimmed) || Is.nan(heightTrimmed)) throw Errors.invalid.canvas

    value.width = widthTrimmed
    value.height = heightTrimmed

    // console.log("set canvas", widthTrimmed, 'x', heightTrimmed, value)
    this.visibleContext.canvas = value
    this.mash.compositeVisible()
  }

  change(property : string, value? : SelectionValue) : void {
    if (Is.populatedObject(this.selectedClip)) {
      if (Is.populatedObject(this.selectedEffect)) {
        this.changeEffect(property, value, <Effect> this.selectedEffect)
      }
      else this.changeClip(property, value, this.selectedClipOrThrow)
    } else this.changeMash(property, value)
  }

  changeClip(property : string, value? : SelectionValue, clip? : Clip) : void {
    // console.log(this.constructor.name, "changeClip", property)
    if (!Is.populatedString(property)) throw Errors.property + "changeClip " + property

    const [transform, transformProperty] = property.split(".")
    if (transformProperty) {
      this.changeTransformer(transform, transformProperty, value)
      return
    }
    const target = clip || this.selectedClipOrThrow
    const redoValue = typeof value === "undefined" ? target.value(property) : value

    if (this.currentActionReusable(target, property)) {
      const changeAction = <ChangeAction> this.actions.currentAction
      changeAction.updateAction(<ScalarValue> redoValue)
      this.handleAction(changeAction)
      return
    }
    const undoValue = typeof value === "undefined" ? this.pristineOrThrow[property] : target.value(property)
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

    const target = effect || this.selectedEffectOrThrow

    const redoValue = typeof value === "undefined" ? target.value(property) : value

    if (this.currentActionReusable(target, property)) {
      const changeAction = <ChangeAction> this.actions.currentAction
      changeAction.updateAction(redoValue)
      this.handleAction(changeAction)
      return
    }
    const undoValue = typeof value === "undefined" ? this.pristineEffectOrThrow[property] : target.value(property)
    const options = {
      type: ActionType.Change, target, property, redoValue, undoValue
    }
    this.actionCreate(options)
  }

  changeMash(property : string, value?: SelectionValue) : void {
    if (!this.mash.propertyNames.includes(property)) throw Errors.unknownMash
    if (!this._pristine) throw Errors.internal

    const target = this.mash
    const redoValue = typeof value === "undefined" ? target.value(property) : value
    if (this.currentActionReusable(target, property)) {
      const changeAction = <ChangeAction> this.actions.currentAction
      changeAction.updateAction(redoValue)
      this.handleAction(changeAction)
      return
    }

    const undoValue = typeof value === "undefined" ? this._pristine[property] : target.value(property)
    const options = {
      target,
      property,
      redoValue,
      undoValue,
      type: ActionType.Change,
    }
    this.actionCreate(options)
  }

  changeTransformer(type : string, property : string, value?: SelectionValue) : void {
    // console.log(this.constructor.name, "changeTransformer", type, property)
    if (!Is.populatedString(type)) throw Errors.type + "changeTransformer " + type
    if (!Is.populatedString(property)) throw Errors.property + "changeTransformer " + property
    if (!this._pristine) throw Errors.internal + "changeTransformer _pristine"

    const target = this.selectedClipOrThrow

    const transformType = <TransformType> type

    const transformable = <Transformable> target

    // make sure first component is merger or scaler
    if (!TransformTypes.includes(transformType)) throw Errors.property + "type " + type
    const transformTarget = transformable[transformType]
    const redoValue = typeof value === "undefined" ? transformTarget.value(property)  : value
    const pristineTarget = this._pristine[transformType]
    if (typeof pristineTarget !== "object") throw Errors.internal + JSON.stringify(this._pristine)

    const undoValue = pristineTarget[property]
    if (typeof undoValue === "undefined") throw Errors.property + 'pristine ' + property + JSON.stringify(pristineTarget)

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

  get definitions() : Definition[] { return this.mash.media }

  // call when player removed from DOM
  destroy() : void { MovieMasher.masher.destroy(this) }

  draw() : void { this.mash.compositeVisible() }

  get duration() : number { return this.mash.duration }

  private get endTime() : Time { return this.mash.endTime.scale(this.fps, 'floor') }

  private filterClipSelection(value : Clip | Clip[]) : Clip[] {
    const clips : Clip[] = Array.isArray(value) ? value : [value]

    const [firstClip] = clips
    if (!firstClip) return []

    const { trackType, track } = firstClip

    //  must all be on same track
    const trackClips = clips.filter(clip => (
      clip.track === track && clip.trackType === trackType
    )).sort(byFrame)

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

  get fps() : number { return this._fps }

  set fps(value : number) {
    if (!Is.aboveZero(value)) throw Errors.fps

    if (this._fps !== value) {
      this._fps = value
      this.visibleContext.emit(EventType.Fps)
      this.time = this.time.scale(value)
    }
  }
  get frame() : number { return this.time.frame }

  set frame(value : number) { this.goToTime(Time.fromArgs(value, this.fps)) }

  get frames() : number { return this.endTime.frame }

  freeze() : void {
    const clip = this.selectedClipOrThrow
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
      redoSelectedClips: [frozenClip],
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

  goToTime(value: Time): LoadPromise {
    return this.mash.seekToTime(value.scaleToFps(this.fps))
  }

  isSelected(object : ClipOrEffect) : boolean {
    if (object instanceof EffectClass) return this.selectedEffects.includes(object)

    return this.selectedClips.includes(<Clip> object)
  }

  private handleAction(action : Action) : void {
    this.mash.handleAction(action)
    this.selectedClips = action.selectedClips
    this.selectedEffects = action.selectedEffects
  }

  private loadMash() : LoadPromise { return this.mash.load() }

  private loadMashAndDraw() : LoadPromise { return this.loadMash().then(() => { this.draw() }) }

  get loadedDefinitions() : DefinitionTimes { return this.mash.loadedDefinitions }

  private _loop = Default.masher.loop

  get loop() : boolean { return this._loop }

  set loop(value : boolean) {
    this._loop = value
    if (this._mash) this.mash.loop = value
  }

  private _mash? : Mash

  get mash() : Mash {
    if (!this._mash) {
      // console.trace("get mash")
      this._mash = MovieMasher.mash.instance(this.mashOptions())
    }
    return this._mash
  }

  set mash(object : Mash) {
    if (this._mash === object) return

    this.paused = true
    if (this._mash) this._mash.destroy()

    this._selectedEffects = []
    this._mash = object
    // console.log("set mash getting visibleContext...")
    this._mash.visibleContext = this.visibleContext
    // console.log("creating composition", this._mash.composition)
    // console.log("set mash got visibleContext!", this._visibleContext)

    this._mash.audibleContext = this.audibleContext
    this._mash.buffer = this.buffer
    this._mash.gain = this.gain
    this._mash.loop = this.loop
    if (this._actions) {
      this._actions.destroy()
      this._actions.mash = this._mash
    }

    this.selectedClips = [] // so mash gets copied into _pristine

    this.goToTime(Time.fromArgs(0, this.fps))
    if (this.autoplay) this.paused = false
  }

  private mashOptions(mashObject : MashObject = {}) : MashOptions {
    // console.log("mashOptions")
    return {
      ...mashObject,
      audibleContext: this.audibleContext,
      buffer: this.buffer,
      gain: this.gain,
      loop: this.loop,
      visibleContext: this.visibleContext,
    }
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

    if (redoTrack.isMainVideo) options.insertIndex = frameOrIndex
    if (undoTrack.isMainVideo) {
      options.undoInsertIndex = currentIndex
      if (frameOrIndex < currentIndex) options.undoInsertIndex += clips.length
    }

    if (!(redoTrack.isMainVideo && undoTrack.isMainVideo)) {
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

    const { effects } = <Transformable> this.selectedClipOrThrow
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

  set muted(value : boolean) {
    if (this._muted !== value) {
      this._muted = value
      this.mash.gain = this.gain
    }
  }

  pause() : void { this.paused = true }

  private _paused = true

  get paused() : boolean { return this.mash.paused }

  set paused(value : boolean) { if (this._mash) this.mash.paused = value }

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
    this.goToTime(Time.fromSeconds(this.duration * value, this.fps))
  }

  get positionStep() : number {
    return parseFloat(`0.${"0".repeat(this.precision - 1)}1`)
  }

  precision = Default.masher.precision

  private _pristine? : SelectionObject

  private get pristineOrThrow() {
    if (!this._pristine) throw Errors.internal
    return this._pristine
  }

  private _pristineEffect? : SelectionObject

  private get pristineEffectOrThrow() {
    if (!this._pristineEffect) throw Errors.internal
    return this._pristineEffect
  }

  redo() : void { if (this.actions.canRedo) this.handleAction(this.actions.redo()) }

  remove(objectOrArray : ClipOrEffect | ClipOrEffect[], moveType : MoveType) : void {
    if (!Is.object(objectOrArray)) throw Errors.argument

    if (moveType === MoveType.Effect) {
      this.removeEffects(<Effect[]> objectOrArray)
      return
    }

    this.removeClips(<Clip[]> objectOrArray)
  }

  removeClips(clipOrArray : Clip | Clip[]) : void {
    const clips = this.filterClipSelection(clipOrArray)
    if (!Is.populatedArray(clips)) throw Errors.argument

    const [firstClip] = clips
    const track = this.mash.clipTrack(firstClip)
    const options = {
      redoSelectedClips: [],
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

    const { effects } = <Transformable> this.selectedClipOrThrow
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

  select(object : ClipOrEffect | undefined, toggleSelected? : boolean) : void {
    if (!object) {
      this.selectedClips = []
      return
    }

    if (object instanceof EffectClass) {
      this.selectEffect(object, toggleSelected)
      return
    }

    const { type } = object

    if (type === DefinitionType.Mash) {
      this.selectMash()
      return
    }

    this.selectClip(<Clip> object, toggleSelected)
  }

  get selectedClipsOrEffects() : Clip[] | Effect[] {
    return this.selectedEffects.length ? this.selectedEffects : this.selectedClips
  }

  selectClip(clip : Clip | undefined, toggleSelected? : boolean) : void {
    const array : Clip[] = []
    if (clip) {
      if (toggleSelected) {
        array.push(...this.selectedClips)
        const index = this.selectedClips.indexOf(clip)
        if (index > -1) array.splice(index, 1)
        else array.push(clip)
      } else if (this.selectedClips.includes(clip)) array.push(...this.selectedClips)
      else array.push(clip)
    }
    this.selectedClips = array
  }

  selectEffect(effect : Effect | undefined, toggleSelected? : boolean) : void {
    const array : Effect[] = []
    if (effect) {
      if (toggleSelected) {
        array.push(...this.selectedEffects)
        const index = this.selectedEffects.indexOf(effect)
        if (index > -1) array.splice(index, 1)
        else array.push(effect)
      } else array.push(effect)
    }
    this.selectedEffects = array
  }

  selectMash() : void {
    this.selectedClips = []
  }


  get selectedClip() : Clip | UnknownObject {
    if (this._selectedClips.length === 1) return this.selectedClipOrThrow

    return this.selectedClipObject
  }

  set selectedClip(value : Clip | UnknownObject) {
    if (value && Is.populatedObject(value)) {
      const clip = <Clip> value
      const { type } = clip
      const clipType = <ClipType> String(type)

      if (!ClipTypes.includes(clipType)) {
        // console.warn(this.constructor.name, "set selectedClip invalid type", value)
        return
      }
      this.selectedClips = [clip]
    } else this.selectedClips = []
  }

  private selectedClipObject = {}

  get selectedClipOrMash() : Clip | Mash {
    const value = this.selectedClip
    if (Is.populatedObject(value)) return this.selectedClipOrThrow

    return this.mash
  }

  private get selectedClipOrThrow() : Clip {
    const clip = this._selectedClips[0]
    if (!clip) throw Errors.selection

    return clip
  }

  private _selectedClips : Clip[] = []

  get selectedClips() : Clip[] { return this._selectedClips }

  set selectedClips(value: Clip[]) {
    const newSelectedClips = this.filterClipSelection(value)
    const newPristine = this.selectedClipOrMash.propertyValues

    const changed = this._selectedClips !== newSelectedClips
    if (changed) {
      this._selectedClips = newSelectedClips
      this._pristine = newPristine
      if (this.selectedEffects.length) {
        this.selectedEffects = []
      } else {
        this.visibleContext.emit(EventType.Selection)
      }
    }
  }

  get selectedEffect() : Effect | UnknownObject {
    if (this._selectedEffects.length !== 1) return {}

    return this._selectedEffects[0]
  }

  set selectedEffect(value: Effect | UnknownObject) {
    if (value && Is.populatedObject(value)) {
      const effect = <Effect>value
      const { type } = effect
      if (type !== DefinitionType.Effect) return

      this.selectedEffects = [effect]
    }
    else this.selectedEffects = []
  }

  get selectedEffectOrThrow() : Effect {
    const effect = this.selectedEffect
    if (!Is.populatedObject(effect)) throw Errors.selection
    return <Effect> effect
  }

  private _selectedEffects : Effect[] = []

  get selectedEffects() : Effect[] { return this._selectedEffects }

  set selectedEffects(value : Effect[]) {
    const newSelectedEffects = []
    const newPristineEffect = {}
    if (value.length) {
      const { effects } = this.selectedClipOrMash
      if (effects) {
        const array = <Effect[]>effects
        // make sure all selected effects are in the effects of the clip or mash
        newSelectedEffects.push(...value.filter(effect => array.includes(effect)))
        if (newSelectedEffects.length === 1) {
          Object.assign(newPristineEffect, newSelectedEffects[0].propertyValues)
        }
      }
    }
    const changed = this._selectedEffects !== newSelectedEffects
    if (changed) {
      this._selectedEffects = newSelectedEffects
      this._pristineEffect = newPristineEffect
      this.visibleContext.emit(EventType.Selection)
    }
  }

  get selectionObjects() : SelectionObject[] {
    const selectedObjects = this.selectedClipsOrEffects
    const object = selectedObjects.map((object : ClipOrEffect) => object.propertyValues)
    return object
  }

  private get silenced() : boolean { return this._paused || this.muted || !this.gain }

  split() : void {
    const splitClip = this.selectedClipOrThrow

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
      (<Audible> insertClip).trim += redoFrames
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
      redoSelectedClips: [insertClip],
      undoSelectedClips: [splitClip],
    }
    this.actionCreate(options)
  }

  get time() : Time { return this.mash.time }

  set time(value: Time) {
    if (value.equalsTime(this.time)) return

    this.goToTime(value)
  }

  get timeRange() : TimeRange { return this.mash.timeRange }

  undo() : void { if (this.actions.canUndo) this.handleAction(this.actions.undo()) }

  visibleContext : VisibleContext

  private _volume = Default.masher.volume

  get volume() : number { return this._volume }

  set volume(value : number) {
    if (this._volume !== value) {
      if (!Is.positive(value)) throw Errors.invalid.volume
      this._volume = value
      if (Is.aboveZero(value)) this.muted = false

      this.mash.gain = this.gain
    }
  }
}
export { MasherClass }
