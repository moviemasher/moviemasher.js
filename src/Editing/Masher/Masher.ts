import {
  Any,
  Context2D,
  ContextElement,
  Timeout,
  UnknownObject,
  ScalarValue,
  SelectionObject,
  LoadPromise,
} from "../../Setup/declarations"
import {
  ActionType,
  ClipType,
  ClipTypes,
  DefinitionType,
  EventType,
  MoveType,
  TrackType,
  TransformType,
  TransformTypes,
} from "../../Setup/Enums"
import { Default } from "../../Setup/Default"
import { Is } from "../../Utilities/Is"
import { Time } from "../../Utilities/Time"
import { TimeRange } from "../../Utilities/TimeRange"
import { Errors } from "../../Setup/Errors"
import { ChangeAction } from "../Action"
import { Actions } from "../Actions"
import { Mash, MashObject, MashOptions } from "../../Mash/Mash/Mash"
import { Events, EventsType } from "../../Editing/Events"
import { ActionFactory } from "../../Editing/Action/ActionFactory"
import { EffectClass } from "../../Mash/Effect/EffectInstance"
import { Clip } from "../../Mash/Mixin/Clip/Clip"
import { AudibleContext, VisibleContext, ContextFactory } from "../../Playing"
import { Definition, DefinitionObject, DefinitionTimes } from "../../Mash/Definition/Definition"
import { Factory } from "../../Mash/Factory/Factory"
import { Transformable } from "../../Mash/Mixin/Transformable/Transformable"
import { Audible } from "../../Mash/Mixin/Audible/Audible"
import { Video } from "../../Mash/Video/Video"
import { Effect } from "../../Mash/Effect/Effect"
import { byFrame } from "../../Utilities/Sort"

const MasherProperty = {
  autoplay: "autoplay",
  precision: "precision",
  loop: "loop",
  fps: "fps",
  volume: "volume",
  buffer: "buffer",
}

type ClipOrEffect = Clip | Effect

interface MasherObject {
  autoplay?: boolean,
  precision?: number,
  loop?: boolean,
  fps?: number,
  volume?: number,
  buffer?: number,
  visibleContext? : VisibleContext
  audibleContext? : AudibleContext
  mash? : Mash
}

type AddPromise = Promise<ClipOrEffect>

class MasherClass {
  [index : string] : unknown

  constructor(object : MasherObject = {}) {
    const {
      autoplay,
      precision,
      loop,
      fps,
      volume,
      buffer,
      audibleContext,
      visibleContext,
      mash,
    } = object
    if (typeof autoplay !== "undefined") this.autoplay = autoplay
    if (typeof precision !== "undefined") this.precision = precision
    if (typeof loop !== "undefined") this._loop = loop

    if (typeof audibleContext !== "undefined") this._audibleContext = audibleContext
    if (typeof visibleContext !== "undefined") this._visibleContext = visibleContext


    this.events.addListener(this.handleMasher.bind(this))

    if (typeof fps !== "undefined") this._fps = fps
    if (typeof volume !== "undefined") this._volume = volume
    if (typeof buffer !== "undefined") this._buffer = buffer

    this._time = Time.fromArgs(0, this.fps)

    if (mash) this.mash = mash
  }

  actionCreate(object : UnknownObject) : void {
    const mash = object.mash || this.mash
    const undoSelectedClips = object.undoSelectedClips || this.selectedClips
    const undoSelectedEffects = object.undoSelectedEffects  || this.selectedEffects
    const redoSelectedClips = object.redoSelectedClips  || this.selectedClips
    const redoSelectedEffects = object.redoSelectedEffects  || this.selectedEffects

    const clone : UnknownObject = {
      ...object,
      mash,
      undoSelectedClips,
      undoSelectedEffects,
      redoSelectedClips,
      redoSelectedEffects,
    }

    const action = ActionFactory.createFromObject(clone)
    // console.log(this.constructor.name, "actionCreate", action)
    action.actions = this.actions
    // const removedActions =
    this.actions.do(action)

    // const type = removedActions.length ? EventType.Truncate : EventType.Add
    // const { currentAction } = this.actions

    // this.events.emit(type, { action: currentAction })
  }

  private _actions? : Actions

  get actions() : Actions {
    if (!this._actions) {
      this._actions = new Actions({ mash: this.mash })
    }
    return this._actions
  }


  add(object : DefinitionObject, frameOrIndex = 0, trackIndex = 0) : AddPromise {
    if (!Is.populatedObject(object)) throw Errors.argument + 'add'

    const { type } = object
    if (!type) throw Errors.type + 'Masher.add'

    if (type === DefinitionType.Effect) {
      const effectDefinition = Factory.effect.definition(object)
      const effect = effectDefinition.instance
      return this.addEffect(effect, frameOrIndex).then(() => effect)
    }
    const clipType = <ClipType> type

    if (!ClipTypes.includes(clipType)) throw Errors.type + type

    const definitionType = <DefinitionType> type
    const definition = Factory[definitionType].definition(object)

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

  autoplay = Default.autoplay

  private _buffer = Default.buffer

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
    // console.log(this.constructor.name, "set canvas")
    const context2d = value.getContext("2d")
    if (!context2d) throw Errors.internal + 'context2d'

    this.events.target = value
    this.context2d = context2d
  }

  change(property : string) : void {
    if (Is.populatedObject(this.selectedClip)) {
      if (Is.populatedObject(this.selectedEffect)) this.changeEffect(property)
      else this.changeClip(property)
    } else this.changeMash(property)
  }

  changeClip(property : string) : void {
    console.log(this.constructor.name, "changeClip", property)
    if (!Is.populatedString(property)) throw Errors.property + "changeClip " + property
    if (!this._pristine) throw Errors.internal + "changeClip _pristine"

    const target = this.selectedClipOrThrow
    const options : UnknownObject = { property, target }
    const [transform, transformProperty] = property.split(".")

    if (transformProperty) {
      const transformType = <TransformType> transform
      // make sure first component is merger or scaler
      if (!TransformTypes.includes(transformType)) throw Errors.property + "transform " + transform

      const transformable = <Transformable> target
      // we'll call merger/scaler set property, even if it's 'id'
      options.target = transformable[transformType]
      options.property = transformProperty
      options.redoValue = transformable[transformType].value(transformProperty)

      const pristineTarget = this._pristine[transformType]
      if (typeof pristineTarget !== "object") throw Errors.internal + JSON.stringify(this._pristine)

      const value = pristineTarget[transformProperty]
      if (typeof value === "undefined") throw Errors.property + 'pristine ' + property + JSON.stringify(pristineTarget)

      options.undoValue = value
    } else {
      options.undoValue = this._pristine[property]
      options.redoValue = target.value(property)
    }
    if (this.currentActionReusable(target, property)) {
      const changeAction = <ChangeAction> this.actions.currentAction
      changeAction.updateAction(<ScalarValue> options.redoValue)
      return
    }

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

  changeEffect(property : string) : void {
    console.log(this.constructor.name, "changeEffect", property)
    if (!Is.populatedString(property)) throw Errors.property

    const target = this.selectedEffect
    if (!target) throw Errors.selection
    if (!this._pristineEffect) throw Errors.selection

    const redoValue = <ScalarValue> target[property]

    if (this.currentActionReusable(target, property)) {
      const changeAction = <ChangeAction> this.actions.currentAction
      changeAction.updateAction(redoValue)
      return
    }

    const undoValue = this._pristineEffect[property]
    const options = {
      type: ActionType.Change, target, property, redoValue, undoValue
    }
    this.actionCreate(options)
  }

  changeMash(property : string) : void {
    if (!this.mash.propertyNames.includes(property)) throw Errors.unknownMash
    if (!this._pristine) throw Errors.selection

    const target = this.mash
    const redoValue = <ScalarValue> this.mash[property]
    if (this.currentActionReusable(target, property)) {
      const changeAction = <ChangeAction> this.actions.currentAction
      return changeAction.updateAction(redoValue)
    }

    const options = {
      target,
      property,
      redoValue,
      undoValue: this._pristine[property],
      type: ActionType.Change,
    }
    // console.log("changeMash", options)

    this.actionCreate(options)
  }

  clipCanBeSplit(clip : Clip, time : Time, quantize : number) : boolean {
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

  private _context2D? : Context2D

  get context2d() : Context2D {
    return this.visibleContext.context2d
  }

  set context2d(value : Context2D) {
    // console.log(this.constructor.name, "set context2d")
    if (this._context2D !== value) {
      this._context2D = value
      if (this._visibleContext) {
        this.visibleContext.context2d = value
        this.mash.compositeVisible()
      }
    }
  }

  get configured() : boolean {
    return true
    // return !!(this._mash && this._context2D)
  }

  currentActionReusable(target : unknown, property : string) : boolean {
    if (!this.actions.currentActionLast) return false

    const action = this.actions.currentAction
    if (!(action instanceof ChangeAction)) return false

    return action.target === target && action.property === property
  }

  // time, but in seconds
  get currentTime() : number { return this.time.seconds }

  set currentTime(seconds : number) { this.time = Time.fromSeconds(seconds, this.fps) }

  get definitions() : Definition[] { return this.mash.media }

  delayedDraw() : void {
    // console.log("MasherClass.delayedDraw")
    // called when assets are cached
    if (!this._delayedTimer) {
      this._delayedTimer = setTimeout(() => {
        // console.log(this.constructor.name, "delayedDraw timeout", )
        delete this._delayedTimer
        this.mash.compositeVisible()
      }, 50)
    }
  }

  private _delayedTimer? : Timeout

  // call when player removed from DOM
  destroy() : void {
    //Mashers.delete(this)
  }

  draw() : void { this.mash.compositeVisible() }

  get duration() : number { return this.mash.duration }

  get endTime() : Time { return this.mash.endTime.scale(this.fps, 'floor') }

  __events? : Events

  get events() : Events {
    if (!this.__events) {
      this.__events = new Events({ target: this.canvas })
    }
    return this.__events
  }

  filterClipSelection(value : Clip | Clip[]) : Clip[] {
    const clips : Clip[] = Array.isArray(value) ? value : [value]

    const [firstClip] = clips
    if (!firstClip) return []

    const { trackType, track } = firstClip

    // selected clips must all be on same track
    const trackClips = clips.filter(clip => (
      clip.track === track && clip.trackType === trackType
    )).sort(byFrame)

    if (track || trackType === TrackType.Audio) return trackClips

    // selected clips on main track must be abutting each other
    let abutting = true
    return trackClips.filter((clip : Clip, index : number) => {
      if (!abutting) return false

      if (index === trackClips.length - 1) return true

      abutting = clip.frame + clip.frames === trackClips[index + 1].frame
      return true
    })
  }

  private _fps = Default.fps

  get fps() : number { return this._fps }

  set fps(value : number) {
    if (!Is.aboveZero(value)) throw Errors.fps

    if (this._fps !== value) {
      this._fps = value
      this._time = this._time.scale(value)
    }
  }

  get frame() : number { return this.time.frame }

  set frame(value : number) {
    // called from ruler to change position
    // console.log('frame=', value, this.fps)

    this.time = Time.fromArgs(value, this.fps)
    // console.log("time", this.time)
    // console.log("position", this.position)
  }

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

  get gain() : number { return this.muted ? 0.0 : this.volume }

  handleGainChange() : void { this.mash.gain = this.gain }

  handleMasher(event : Event) : Any {
    // console.log("handleMasher", event.type)
    if (event.type !== Events.type) return

    const { detail } = <EventsType> event
    // console.log("handleMasher", detail.type)

    if (detail.type === EventType.Action) {
      const { action } = detail
      if (!action) throw Errors.internal + 'action'

      this.selectedClips = action.selectedClips
      this.selectedEffects = action.selectedEffects
    }
  }

  loadMash() : LoadPromise { return this.mash.load() }

  loadMashAndDraw() : LoadPromise { return this.loadMash().then(() => { this.draw() }) }

  get loadedDefinitions() : DefinitionTimes { return this.mash.loadedDefinitions }


  private _loop = Default.loop

  get loop() : boolean { return this._loop }

  set loop(value : boolean) {
    this._loop = value
    if (this._mash) this.mash.loop = value
  }

  private _mash? : Mash

  get mash() : Mash {
    if (!this._mash) this._mash = Factory.mash.instance(this.mashOptions({ id: 'mash-id' }))
    return this._mash
  }

  set mash(object : Mash) {
    if (this._mash === object) return

    this.paused = true
    if (this._mash) this._mash.destroy()

    this._selectedEffects = []
    this._mash = object
    this._mash.events = this.events
    this._mash.visibleContext = this.visibleContext
    this._mash.audibleContext = this.audibleContext
    this._mash.buffer = this.buffer
    this._mash.gain = this.gain
    if (this._actions) {
      this._actions.destroy()
      this._actions.mash = this._mash
    }

    this.selectedClips = [] // so mash gets copied into _pristine

    this.time = Time.fromSeconds(0, this.fps)
    if (this.autoplay) this.paused = false
  }

  mashOptions(mashObject : MashObject = {}) : MashOptions {
    return {
      ...mashObject,
      audibleContext: this.audibleContext,
      buffer: this.buffer,
      events: this.events,
      gain: this.gain,
      loop: this.loop,
      visibleContext: this.visibleContext,
    }
  }

  media(clip : Clip) : Definition { return clip.definition }

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
    if (!Is.populatedArray(clips)) throw Errors.argument + 'moviClips clips'

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
      this.handleGainChange()
    }
  }

  pause() : void { this.paused = true }

  private _paused = true

  get paused() : boolean { return this.mash.paused }

  set paused(value : boolean) { this.mash.paused = value }

  play() : void { this.paused = false }

  get position() : number {
    let per = 0
    if (this._time.frame) {
      per = this._time.seconds / this.duration
      if (per !== 1) per = parseFloat(per.toFixed(this.precision))
    }
    return per
  }

  set position(value : number) {
    this.time = Time.fromSeconds(this.duration * value, this.fps)
  }

  get positionStep() : number {
    return parseFloat(`0.${"0".repeat(this.precision - 1)}1`)
  }

  precision = Default.precision

  private _pristine? : SelectionObject

  private _pristineEffect? : SelectionObject

  get properties() : string[] { return Object.values(MasherProperty) }

  redo() : void { if (this.actions.canRedo) this.actions.redo() }

  remove(objectOrArray : ClipOrEffect | ClipOrEffect[], moveType : MoveType) : void {
    if (!Is.object(objectOrArray)) throw Errors.argument

    if (moveType === MoveType.Effect) return this.removeEffects(<Effect[]> objectOrArray)

    return this.removeClips(<Clip[]> objectOrArray)
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

  select(object : ClipOrEffect | undefined, toggleSelected = false) : void {
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

  selectClip(clip : Clip | undefined, toggleSelected : boolean) : void {
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

  selectEffect(effect : Effect | undefined, toggleSelected : boolean) : void {
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

  selected(object : ClipOrEffect) : boolean {
    if (object instanceof EffectClass) return this.selectedEffects.includes(object)

    return this.selectedClips.includes(<Clip> object)
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
        console.warn(this.constructor.name, "set selectedClip invalid type", value)
        return
      }
      this.selectedClips = [clip]
    } else this.selectedClips = []
  }

  selectedClipObject = {}

  get selectedClipOrMash() : Clip | Mash {
    const value = this.selectedClip
    if (Is.populatedObject(value)) return this.selectedClipOrThrow

    return this.mash
  }

  get selectedClipOrThrow() : Clip {
    if (this._selectedClips.length !== 1) throw Errors.selection

    return this._selectedClips[0]
  }

  private _selectedClips : Clip[] = []

  get selectedClips() : Clip[] { return this._selectedClips }

  set selectedClips(value : Clip[]) {
    this._selectedClips = this.filterClipSelection(value)
    this._pristine = this.selectedClipOrMash.propertyValues
    this.selectedEffects = []
  }

  get selectedEffect() : Effect | undefined {
    if (this._selectedEffects.length !== 1) return

    return this._selectedEffects[0]
  }

  set selectedEffect(value : Effect | undefined) {
    if (value) this.selectedEffects = [value]
    else this.selectedEffects = []
  }

  private _selectedEffects : Effect[] = []

  get selectedEffects() : Effect[] { return this._selectedEffects }

  set selectedEffects(value : Effect[]) {
    const { effects } = this.selectedClipOrMash
    if (!effects) { // mash or multiple clips selected, or no effects
      this._selectedEffects = []
      this._pristineEffect = {}
      return
    }
    const array = <Effect[]> effects
    this._selectedEffects = value.filter(effect => array.includes(effect))
    this._pristineEffect = (this.selectedEffect && this.selectedEffect.propertyValues) || {}
  }

  get silenced() : boolean { return this._paused || this.muted || !this.gain }

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

  get stalling() : boolean { return !this.__moving && !this.paused }

  private _time : Time

  get time() : Time { return this.mash.time }

  set time(value: Time) { this.mash.seekToTime(value) }

  type = "masher"

  undo() : void { if (this.actions.canUndo) this.actions.undo() }

  private _visibleContext? : VisibleContext

  get visibleContext() : VisibleContext {
    if (!this._visibleContext) {
      if (typeof this._context2D === "undefined") {
        this._visibleContext = ContextFactory.visible()
      } else this._visibleContext = ContextFactory.fromContext2D(this._context2D)

      if (this._mash) this.mash.visibleContext = this._visibleContext
    }
    return this._visibleContext
  }

  set visibleContext(value : VisibleContext) {
    if (this._visibleContext !== value) {
      this._visibleContext = value
      if (this._mash) this.mash.visibleContext = value
    }
  }

  private _volume = Default.volume

  get volume() : number { return this._volume }

  set volume(value : number) {
    if (this._volume !== value) {
      if (!Is.positive(value)) throw Errors.invalid.volume
      this._volume = value
      if (Is.aboveZero(value)) this.muted = false

      this.handleGainChange()
    }
  }
}

interface Masher extends MasherClass {}

export { Masher, MasherClass }
