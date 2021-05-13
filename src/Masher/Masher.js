import { Base } from "../Base"
import { Errors } from '../Errors'
import { Is } from '../Is'
import { ChangeAction } from "../Action"
import { Actions } from "../Actions"
import { Mash } from "../Mash"
import { ClipFactory } from "../Factory/ClipFactory"
import { MediaFactory } from "../Factory/MediaFactory"
import { TimeFactory } from "../Factory/TimeFactory"
import { TimeRangeFactory } from "../Factory/TimeRangeFactory"
import { Context } from "../Utilities"
import { Events } from "../Events"
import { ActionFactory } from "../Factory/ActionFactory"
import { Effect } from "../Transform"
import { deprecated } from "./with/deprecated"
import { contexts } from "../Base/with/contexts"
import { Default } from "../Default"
import { Composition } from "../Composition"

import { 
  DoType, 
  ActionType, 
  TrackType, 
  MediaType, 
  EventType, 
  TransformTypes, 
  MoveType, 
  TrackTypes 
} from "../Types"

const MasherProperty = {
  autoplay: "autoplay",
  precision: "precision",
  loop: "loop",
  fps: "fps",
  volume: "volume",
  buffer: "buffer",
}

const Mashers = new Set

const clipCanBeSplit = (clip, time, quantize) => {
  if (!Is.object(clip)) return 

  // true if now intersects clip time, but is not start or end frame
  let range = TimeRangeFactory.createFromTime(time)
  const clip_range = clip.timeRange(quantize) 

  // ranges must intersect
  if (!clip_range.intersects(range)) return

  const scaled = range.scale(clip_range.fps)
  if (scaled.frame === clip_range.frame) return
  if (scaled.end === clip_range.end) return

  return true
}

class Masher extends Base {
  static get instances() { return Mashers }

  static get properties() { return Object.values(MasherProperty) }

  constructor(object = {}) {
    super(object)
    Mashers.add(this)
   
    this.object.canvas ||= Context.createCanvas()
    
    this.events = new Events({ target: this.canvas })
    this.events.addListener(this.handleMasher.bind(this))

    // console.log("events:", this.events)
    this.__load_timer = false
    this.__moving = false
    this.__muted = false
    this.__paused = true
    this.__mashFrames = 0
    this.__time = TimeFactory.create(0, this.fps)
    this.__drawnTime = TimeFactory.create(0, this.fps)

    const mash = this.object.mash || {}
    this.object.mash = false
    this.mash = mash
  }

  get action_index() { return this.__actions.index }


  get autoplay() { 
    if (Is.undefined(this.__autoplay)) {
      this.__autoplay = this.initializeProperty(MasherProperty.autoplay)
    }
    return this.__autoplay
  }
  set autoplay(value) { this.__autoplay = value }

  get composition() {
    if (!this.__composition) {
      const options = {
        bufferSeconds: this.buffer,
        gain: this.gain,
        mash: this.mash,
        audioContext: this.audioContext,
        videoContext: this.videoContext,
      }
      this.__composition = new Composition(options)
      this.__composition.time = this.time
    }
    return this.__composition
  }

  get buffer() { 
    if (Is.undefined(this.__buffer)) {
      // deprecated buffer properties
      const properties = [MasherProperty.buffer, 'buffertime', 'minbuffertime']
      this.__buffer = this.initializeProperty(...properties)
    }
    return this.__buffer
  }
  set buffer(value) { 
    if (this.__buffer !== value) {
      this.__buffer = value
      this.composition.bufferSeconds = value
    } 
  }

  get bufferedTimeRange() { return this.composition.bufferedTimeRange }

  get canvas() { return this.videoContext.canvas }
  set canvas(value) {
    this.videoContext = Context.createVideo(value)
    this.events.target = value   
  }
  
  get configured() { 
    return this.mash && this.canvas
  }

  // time, but in seconds
  get currentTime() { return this.time.seconds }
  set currentTime(seconds) { this.time = TimeFactory.createFromSeconds(seconds, this.fps) }

  get duration() { return TimeFactory.create(this.__mashFrames, this.mash.quantize).seconds }

  get endTime() { return this.mashEndTime.scale(this.fps, 'floor') }

  get fps() { 
    if (Is.undefined(this.__fps)) {
      this.__fps = this.initializeProperty(MasherProperty.fps)
    }
    return this.__fps
  }
  set fps(value = 0) {
    if (!Is.integer(value) || value < 1) throw(Errors.fps)

    if (this.__fps !== value) {
      this.__fps = value
      this.__time = this.__time.scale(value)
      this.__drawnTime = this.__drawnTime.scale(value)
    }
  }

  get frame() { return this.time.frame }
  set frame(value) {
    // called from ruler to change position
    //console.log('frame=', value, this.fps)

    this.time = TimeFactory.create(value, this.fps)
    //console.log("time", this.time)
  }
  // Math.round(Number(this.__mashFrames) / Number(this.mash.quantize) * Number(this.fps));}
  get frames() { return this.mashEndTime.scale(this.fps).frame }

  get gain() { return this.muted ? 0.0 : this.volume }

  get loop() { 
    if (Is.undefined(this.__loop)) {
      this.__loop = this.initializeProperty(MasherProperty.loop)
    }
    return this.__loop
  }
  set loop(value) { this.__loop = value }

  get mash() { return this.__mash ||= this.object.mash }
  set mash(object) {
    // console.log("set mash", object)
   
    if (this.__mash === object) return 

    this.paused = true
   
    this.__selectedEffects = []

   
    this.__mash = new Mash(object)
    this.__mash.events = this.events

    this.__actions = new Actions({ mash: this.__mash, masher: this })

    // console.log("set mash setting selectedClips")
    this.selectedClips = [] // so mash gets copied into __pristine

    this.handleChangeMashFrames()
    
    this.composition.mash = this.mash
    this.time = TimeFactory.createFromSeconds(0, this.fps)

    this.rebuffer()
    this.redraw()
    if (this.autoplay) this.paused = false
  }

  get mashEndTime() { return TimeFactory.create(this.__mashFrames, this.mash.quantize) }

  get muted() { return this.__muted }
  set muted(value = false) {
    this.__muted = value
    this.handleGainChange()
  }

  get paused() { return this.__paused }
  set paused(value) {
    if (!this.__mashFrames) value = true
    if (this.__paused !== value) {
      this.__paused = value
      this.composition.paused = value
      if (this.__paused) {
        this.__set_moving(false)
        if (this.__buffer_timer) {
          clearInterval(this.__buffer_timer)
          this.__buffer_timer = 0
        }
      } else {
        if (! this.__buffer_timer) {
          this.__buffer_timer = setInterval(this.rebuffer, 2000)
        }
        this.rebuffer()
        this.redraw()
      }
    }
  }

  get position() {
    let per = 0
    if (this.__time.frame) {
      per = this.__time.seconds / this.duration
      if (per !== 1) per = parseFloat(per.toFixed(this.precision))
    }
    return per
  }
  set position(value = 0) { this.time = TimeFactory.createFromSeconds(this.duration * value, this.fps) }

  get position_step() {
    const zeros = "0".repeat(this.precision - 1)
    return parseFloat(`0.${zeros}1`)
  }
  
  get precision() { 
    if (Is.undefined(this.__precision)) {
      this.__precision = this.initializeProperty(MasherProperty.precision)
    }
    return this.__precision
    
  }
  set precision(value) { this.__precision = value }

  get selectedClip() {
    if (this.__selectedClips.length === 1) return this.__selectedClips[0] 
  }
  set selectedClip(value) { this.selectedClips = value }

  get selectedClipOrMash() { return this.selectedClip || this.__mash }

  get selectedClips() { return this.__selectedClips }

  set selectedClips(value) {
    this.__selectedClips = this.mash.filterClipSelection(value)
    this.__pristine = this.selectedClipOrMash.propertyValues 
    this.selectedEffects = []
  }

  get selectedEffect() {
    if (this.__selectedEffects.length === 1) return this.__selectedEffects[0] 
  }
  set selectedEffect(value){
    this.selectedEffects = Is.object(value)  && !Is.empty(value) ? [value] : []
  }

  get selectedEffects() { return this.__selectedEffects }
  set selectedEffects(value) {
    const effects = this.selectedClipOrMash.effects
    if (!effects) { // mash or multiple clips selected, or no effects
      this.__selectedEffects = []
      this.__pristineEffect = {}
      return
    }

    const array = Is.array(value) ? value : []
    this.__selectedEffects = array.filter(effect => effects.includes(effect))
    this.__pristineEffect = (this.selectedEffect && this.selectedEffect.propertyValues) || {}
  }

  get silenced() { return this.__paused || this.muted || !this.gain }

  get stalling() { return !this.__moving && !this.paused }

  get time() { return this.__time }
  set time(value) {
    const limited_time = this.__limit_time(value)
    const equal = this.__time.equalsTime(limited_time)
    this.__time = limited_time
    this.composition.time = this.__time
      
    if (!equal) this.handleChangeMash()
  }

  get urlsInUse() { return this.composition.urlsInTimeRange.urls }

  get volume() {
    if (Is.undefined(this.__volume)) {
      this.__volume = this.initializeProperty(MasherProperty.volume)
    }
    return this.__volume
  }
  set volume(value) {
    if (! Is.number(value)) throw(Errors.argument)

    this.__volume = value
    this.handleGainChange()
  }

  /**
   * type - String audio|video|effect
   */
  add(object, addType, frameOrIndex, trackIndex) {
    // console.log("add", object, addType)
    if (!Is.object(object)) throw Errors.argument + object
    
    if (addType === MoveType.effect) return this.addEffect(object, frameOrIndex)
    
    return this.addClip(object, frameOrIndex, trackIndex)
  }

  addClip(object, frameOrIndex, trackIndex) {
    // console.log("addClip frameOrIndex", frameOrIndex)
    const media = MediaFactory.create(object)
    const { trackType } = media
    const clip = ClipFactory.createFromMedia(media, this.mash)
    const clips = [clip]
    const options = { 
      clip,
      type: ActionType.addClipsToTrack,
      redoSelectedClips: clips,
      trackType,
    }
    const track = this.mash.trackOfTypeAtIndex(trackType, trackIndex)
    const trackCount = this.mash[trackType].length
    if (trackIndex || media.trackType === TrackType.audio) {
      options.trackIndex = trackIndex
      clip.frame = track.frameForClipsNearFrame(clips, frameOrIndex)
      options.createTracks = Math.max(0, trackIndex + 1 - trackCount)
    } else {
      options.insertIndex = frameOrIndex
      options.createTracks = Math.min(1, Math.max(0, 1 - trackCount))
    }
    this.actionCreate(options)
    return this.loadVisual().then(() => Promise.resolve(clip)) 
  }

  addEffect(object, index) {
    // console.log(this.constructor.name, "addEffect", object, index)
    if (!Is.object(object)) throw Errors.argument + object

    const effects = this.selectedClip.effects
    if (!Is.array(effects)) throw Errors.selection

    const effect = new Effect(object)
    const insertIndex = Is.integer(index) && index > 0 ? index : 0
    const undoEffects = [...effects]
    const redoEffects = [...effects]
    redoEffects.splice(insertIndex, 0, effect)
    const options = { 
      effects, undoEffects, redoEffects, 
      type: ActionType.moveEffects 
    }
    this.actionCreate(options)
    return this.loadVisual().then(() => Promise.resolve(effect)) 
  }
  /**
   * 
   * @param {String} type audio or video
   */
  addTrack(trackType = TrackType.video) {
    if (!TrackTypes.includes(trackType)) throw Errors.type + trackType

    return this.actionCreate({ trackType, type: ActionType.addTrack })
  }
  
  can(method){
    var should_be_enabled = false;
    var z = this.__selectedClips.length;
    switch(method){
      case 'undo':{
        should_be_enabled = this.__actions.canUndo
        break;
      }
      case 'redo':{
        should_be_enabled = this.__actions.canRedo
        break;
      }
      case 'adjust':{
        should_be_enabled = (z > 0);
        if (should_be_enabled) should_be_enabled = (this.__selectedClips[0].track > 0);
        break;
      }
      case 'copy':{
        should_be_enabled = (z > 0);
        break;
      }
      case 'cut':
      case 'remove':{
        should_be_enabled = (this.__selectedClips.length);
        if (should_be_enabled) {
          // TODO: test that removing won't create transition problem
        }
        break;
      }
      case 'split':{
        should_be_enabled = clipCanBeSplit(this.selectedClip, this.time, this.mash.quantize)
        break
      }
      case 'freeze':{
        should_be_enabled = (z === 1)
        should_be_enabled &&= MediaType.video === this.selectedClip.type
        should_be_enabled &&= clipCanBeSplit(this.selectedClip, this.time, this.mash.quantize)
        break;
      }
    }
    return should_be_enabled;
  }

  currentActionReusable(target, property) {
    if (!this.__actions.currentActionLast) return 

    const action = this.__actions.currentAction
    if (!Is.instance(action, ChangeAction)) return

    if (!(action.target === target && action.property === property)) return

    return action
  }

  change(property) {
    if (!this.selectedClip) return this.changeMash(property)
    
    return this.changeClip(property)
  }

  changeClip(property) {
    if (!Is.string(property) || Is.empty(property)) throw Errors.property + property

    const options = { property, target: this.selectedClip }
    const [transform, transformProperty] = property.split(".")
    
    if (transformProperty) { 
      // make sure first component is merger or scaler
      if (!TransformTypes.includes(transform)) throw Errors.property + transform

      if (transformProperty === 'id') {
        options.property = transform
        options.redoValue = options.target[options.property].id
      }
      else {
        // we'll call merger/scaler set property
        options.target = options.target[transform]
        options.property = transformProperty
        options.redoValue = options.target[options.property]
      }
      console.log(this.constructor.name, "changeClip", transform, transformProperty, this.__pristine)
      
      options.undoValue = this.__pristine[transform][transformProperty]
    } else {
      options.undoValue = this.__pristine[property] 
      options.redoValue = options.target[options.property]
    }
   
    const action = this.currentActionReusable(options.target, options.property)
    if (action) return action.updateAction(options.redoValue)
    
    switch(options.property) {
      case 'frames': {
        options.type = ActionType.changeFrames
        break
      }
      case 'trim': {
        options.type = ActionType.changeTrim
        break
      }
      default: options.type = ActionType.change
    }
    return this.actionCreate(options)
  }

  changeEffect(property) { 
    if (!Is.string(property) || Is.empty(property)) throw Errors.property

    const target = this.selectedEffect
    if (Is.undefined(target)) throw Errors.selection

    const redoValue = target[property]
    const action = this.currentActionReusable(target, property)
    if (action) return action.updateAction(redoValue)
  
    const undoValue = this.__pristineEffect[property]
    const options = { 
      type: ActionType.change, 
      target, property, redoValue, undoValue 
    }
    return this.actionCreate(options)
  }

  changeMash(property) {
    if (!Mash.properties.includes(property)) throw Errors.unknownMash + property

    const target = this.mash
    const redoValue = this.mash[property]
    const action = this.currentActionReusable(target, property)
    if (action) return action.updateAction(redoValue)
  
    const options = {
      target,
      property,
      redoValue,
      undoValue: this.__pristine[property],
      type: ActionType.change,
    }
    // console.log("changeMash", options)

    return this.actionCreate(options)
  }

  delayedDraw() {
    // console.log("Masher.delayedDraw")
    // called when assets are cached
    if (! this.delayed_timer) {
      this.delayed_timer = setTimeout(() => {
        // console.log("Masher.delayedDraw.timeout")
        this.delayed_timer = null
        this.redraw()
      }, 50)
    }
  }

  destroy() {
    Mashers.delete(this)
    this.mash = null;
    this.canvas_context = null
  } // call when player removed from DOM


  handleAction(type, action) {
    this.events.emit(type, { action: action })
  }

  handleGainChange() { this.composition.gain = this.gain }

  handleChangeMash(){
    this.paused = true // make sure we are not playing
    this.rebuffer()
    this.redraw()
  }

  handleChangeMashFrames(){
    // console.log("handleChangeMashFrames")
    const mash_frames = this.mash.frames
    if (this.__mashFrames !== mash_frames) {
      this.__mashFrames = mash_frames
      // move back if we were positioned at a time later than new duration
      const max_frame = Math.max(0, this.endTime.frame - 1)
      if (max_frame < this.time.frame) this.frame = max_frame
      else this.delayedDraw()
    } 
  }

  handleMasher(event) {
    if (event.type !== Events.type) return console.warn("handleMasher", event)
    // console.log("handleMasher", event.detail)

    switch(event.detail.type) {
      case EventType.duration: {
        this.handleChangeMashFrames()
        break
      }
      case EventType.action: {
        const action = event.detail.action
        
        this.selectedClips = action.selectedClips
        this.selectedEffects = action.selectedEffects
        switch (action.type) {
          case ActionType.changeAction: {
            if (action.property === "gain"){
              if (this.__moving && !this.silenced) {
                this.composition.adjustSourceGain(action.target)
              } 
            }
            break
          }
          default: this.delayedDraw()
        }
        break
      }
      default: {
        this.delayedDraw()
      }
    }
  }
    
  handleRemoveActions(removedActions = []) {
    const type = removedActions.length ? EventType.truncate : EventType.add
    this.handleAction(type, this.__actions.currentAction)
    this.handleChangeMash()
    // TODO: deprecated - stop calling and remove did method
    if (removedActions.length) this.did(removedActions.length)
  }

  initializeProperty(...properties) { 
    for (let property of properties) {
      if (Is.defined(this.object[property])) return this.object[property] 
    }
    return Default[properties[0]] 
  }

  loadVisual() {
    return this.composition.loadTime()
  }
  media(clip) { return clip.media }

  move(objectOrArray, moveType, frameOrIndex, trackIndex) {
    if (!Is.object(objectOrArray)) throw Errors.argument + objectOrArray
 
    if (moveType === MoveType.effect) {
      return this.moveEffects(objectOrArray, frameOrIndex)
    }
    
    return this.moveClips(objectOrArray, frameOrIndex, trackIndex)
  }
  
  moveEffects(effectOrArray, index = 0) {
    // console.log(this.constructor.name, "moveEffects", effectOrArray, index)
    if (!Is.positive(index)) throw Errors.argument + index
  
    // Coerce.instanceArray? 

    const array = Is.array(effectOrArray) ? effectOrArray : [effectOrArray]
    const moveEffects = array.filter(effect => Is.instance(effect, Effect))
    if (Is.emptyarray(moveEffects)) throw Errors.argument + effectOrArray

    const effects = this.selectedClip.effects
    const undoEffects = [...effects]
   
    const redoEffects = []
    undoEffects.forEach((effect, i) => {
      if (i === index) redoEffects.push(...moveEffects) 
      if (moveEffects.includes(effect)) return

      redoEffects.push(effect)
    })
    
    const options = { 
      effects, undoEffects, redoEffects, 
      type: ActionType.moveEffects 
    }
    // console.log(this.constructor.name, "moveEffects", options)
    return this.actionCreate(options)
  }

  moveClips(clipOrArray, frameOrIndex = 0, trackIndex = 0) {
    // console.log("moveClips", "frameOrIndex", frameOrIndex, "trackIndex", trackIndex)
    if (!Is.positive(frameOrIndex)) throw Errors.argument + frameOrIndex
    if (!Is.positive(trackIndex)) throw Errors.argument + trackIndex
  
    const clips = this.mash.filterClipSelection(clipOrArray)
    if (Is.emptyarray(clips)) throw Errors.argument + clipOrArray

    const [firstClip] = clips
    const { trackType, track: undoTrackIndex } = firstClip
    const options = {
      clips, trackType, trackIndex, undoTrackIndex, 
      type: ActionType.moveClips
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
      const insertFrame =  redoTrack.frameForClipsNearFrame(clips, frameOrIndex)
      const offset = insertFrame - firstClip.frame
      if (!offset) return // because there would be no change

      options.undoFrames = frames
      options.redoFrames = frames.map(frame => frame + offset)
    }
    return this.actionCreate(options)
  }

  pause() {
    this.paused = true;
  }

  play() {
    this.paused = false;
  }

  rebuffer() {
    if (this.paused) return this.composition.loadTime()

    return this.composition.loadTimeRange()
  }

  redo(){
    if (this.__actions.canRedo) {
      const action = this.__actions.redo()
      this.handleAction(DoType.redo, action)
      this.handleChangeMash()
    }
  }

  redraw() {
    if (! this.configured) return 

    const video_buffered = this.composition.drawFrame()
    const no_audio = !this.__moving || this.silenced 
    const audio_buffered = no_audio || this.composition.bufferedTime
    // console.log(this.constructor.name, "redraw audio_buffered:", audio_buffered)
    const all_buffered = video_buffered && audio_buffered
    
    if (this.__moving !== all_buffered) {
      if (this.__moving) this.__set_moving(false)
      else if (!this.__paused && this.bufferedTimeRange) this.__set_moving(true)
    }
  }

  draw() { return this.composition.draw() }

  remove(objectOrArray, moveType) {
    if (!Is.object(objectOrArray)) throw Errors.argument + objectOrArray

    if (moveType === MoveType.effect) return this.removeEffects(objectOrArray)

    return this.removeClips(objectOrArray)
  }

  removeClips(clipOrArray) {
    const clips = this.mash.filterClipSelection(clipOrArray)
    if (Is.emptyarray(clips)) throw Errors.argument + clipOrArray

    const [firstClip] = clips
    const track = this.mash.clipTrack(firstClip)
    const options = {
      clips, track, index: track.clips.indexOf(firstClip),
      type: ActionType.removeClips
    }
    return this.actionCreate(options)
  }

  removeEffects(effectOrArray) {
    const array = Is.array(effectOrArray) ? effectOrArray : [effectOrArray]
    const removeEffects = array.filter(effect => Is.instance(effect, Effect))
    if (Is.emptyarray(removeEffects)) throw Errors.argument + effectOrArray

    const effects = this.selectedClip.effects
    const undoEffects = [...effects]
    const redoEffects = effects.filter(effect => !removeEffects.includes(effect))

    const options = { 
      redoSelectedEffects: [],
      effects, undoEffects, redoEffects, 
      type: ActionType.moveEffects 
    }
    return this.actionCreate(options)
  }
 
  select(object, toggle_selected) {
    if (!object) {
      // console.log("Masher.select FALSE", object, toggle_selected)
      this.selectedClip = false
      return 
    }
    // console.log('Masher.select TRUE', object, toggle_selected);
    var media, i, array = [], key_array = '__selectedClips', key_prop = 'selectedClips';
    media = this.mash.findMedia(object.id)
    if (media){
      if (MediaType.effect === media.type){
        key_array = '__selectedEffects';
        key_prop = 'selectedEffects';
      }
      if (toggle_selected) {
        i = this[key_array].indexOf(object);
        switch(this[key_array].length){
          case 0: {
            array.push(object);
            break;
          }
          case 1: {
            if (i > -1) break;
          } // potential intentional fall through to default
          default: {
            if (i < 0) {
              array.push(object);
              array = array.concat(this[key_array]);
            } else {
              if (i) array = array.concat(this[key_array].slice(0, i));
              if (i < (this[key_array].length - 1)) array = array.concat(this[key_array].slice(i + 1));
            }
          }

        }
      }
      else {
        if (-1 < this[key_array].indexOf(object)) return;
        array.push(object);
      }
    }
    // console.log('select', key_prop, array);
    this[key_prop] = array;
  }

  selected(object) {
    if (Is.instance(object, Effect)) return this.selectedEffects.includes(object)
    
    return this.selectedClips.includes(object)
  }

  selectEffect(effect, toggle_selected){
    if (Is.object(effect)) return this.select(effect, toggle_selected);
    else if (! toggle_selected) this.selectedEffect = effect;
  }

  split() {
    const splitClip = this.selectedClip
    if (!clipCanBeSplit(splitClip, this.time, this.mash.quantize)) return

    const scaled = this.time.scale(this.mash.quantize)
    const undoFrames = splitClip.frames
    const redoFrames = scaled.frame - splitClip.frame
    const insertClip = splitClip.copy
    insertClip.frames = undoFrames - redoFrames
    insertClip.frame = scaled.frame
    if (splitClip.properties.includes("trim")) insertClip.trim += redoFrames
    
    const trackClips = this.mash.clipTrack(splitClip).clips
    const options = { 
      type: ActionType.split, 
      splitClip, 
      insertClip,
      trackClips,
      redoFrames,
      undoFrames, 
      index: 1 + trackClips.indexOf(splitClip),
      redoSelectedClips: [insertClip],
      undoSelectedClips: [splitClip],
    }
    return this.actionCreate(options)
  }

  freeze() {
    const freezeClip = this.selectedClip
    if (!clipCanBeSplit(freezeClip, this.time, this.mash.quantize)) return
    if (MediaType.video !== freezeClip.type) return

    const scaled = this.time.scale(this.mash.quantize)
    const trackClips = this.mash.clipTrack(freezeClip).clips
    const insertClip = freezeClip.copy
    const frozenClip = freezeClip.copy
    
    const options = {
      frames: freezeClip.frames - (scaled.frame - freezeClip.frame),
      freezeClip, frozenClip, insertClip, trackClips, 
      redoSelectedClips: [frozenClip],
      index: 1 + trackClips.indexOf(freezeClip),
      type: ActionType.freeze,
    }

    frozenClip.frame = scaled.frame 
    frozenClip.frames = 1
    frozenClip.trim = freezeClip.trim + (scaled.frame - freezeClip.frame)
    insertClip.frame = scaled.frame + 1
    insertClip.frames = options.frames - 1
    insertClip.trim = frozenClip.trim + 1
    
    return this.actionCreate(options)
  }

  undo() {
    if (this.__actions.canUndo) {
      const action = this.__actions.undo()
      this.handleAction(DoType.undo, action)
      this.handleChangeMash()
    }
  }

  
  __limit_time(time) {
    const scaled = time.scale(this.fps)
    const end_time = this.mashEndTime.scale(this.fps)
    if (scaled.frame > end_time.frame) return end_time

    return scaled
    // console.log("__limit_time", time)
    // var start_time = time.copy;
    // var limit_time = this.mashEndTime
    // limit_time.frame = Math.max(0, limit_time.frame - 1);
    // start_time = start_time.min(limit_time);
    // start_time = start_time.scale(this.fps, 'floor');
    // return start_time;
  }

  __load_timed(){
    // console.log(this.constructor.name, "__load_timed moving: ", this.__moving)
    if (this.__moving){
      // hopefully runs twice a frame
      var now = TimeFactory.createFromSeconds(this.composition.seconds, this.fps, 'ceil');
      if (now.frame !== this.__limit_time(now).frame) {
        // loop back to start or pause
        if (! this.loop) {
          this.paused = true;
        } else {
          this.frame = 0;
          this.paused = false;
        }
      } else {
        if (! now.equalsTime(this.__drawnTime)) {
          this.__time = now.scale(this.fps)
          this.redraw();
        }
      }
    }
  }

  __set_moving(tf) {
    // console.log("__set_moving", tf)
    if (this.__moving !== tf) {
      this.__moving = tf;
      if (this.__moving) {
        var $this = this;
        this.__load_timer = setInterval(() => {$this.__load_timed();}, 500 / this.fps);
        // start up the sound buffer with our current time, rather than displayed
        this.composition.startPlaying() 
        this.rebuffer() // get sounds buffering now, rather than next timer execution
      } else {
        this.composition.stopPlaying()
        clearInterval(this.__load_timer)
        this.__load_timer = false
      }
    }
  }

  actionCreate(object) {
    const action = ActionFactory.create(object, this) 
    const removed = this.__actions.do(action)
    this.handleRemoveActions(removed)
  }
}

Object.defineProperties(Masher.prototype, {
  ...contexts,
  ...deprecated,
})

export { Masher }
