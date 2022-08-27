import {
  StringObject, SvgItem, Timeout} from "../declarations"
import { sizeCopy, Size, sizeAboveZero } from "../Utility/Size"
import { Definition, DefinitionObject, DefinitionObjects } from "../Definition/Definition"
import { Edited } from "../Edited/Edited"
import { assertMash, isMash, Mash, MashAndDefinitionsObject } from "../Edited/Mash/Mash"
import { Emitter } from "../Helpers/Emitter"
import { Time, TimeRange } from "../Helpers/Time/Time"
import {
  timeFromArgs, timeFromSeconds, timeRangeFromArgs} from "../Helpers/Time/TimeUtilities"
import { Effect } from "../Media/Effect/Effect"
import { assertTrack, Track } from "../Edited/Mash/Track/Track"
import { BrowserLoaderClass } from "../Loader/BrowserLoaderClass"
import { Default } from "../Setup/Default"
import {
  ActionType, assertDefinitionType, assertLoadType, DefinitionType, EditType, EventType,
  isDefinitionType,
  isEditType, isLoadType, LayerType, LoadType, MasherAction} from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import {
  assertAboveZero,
  assertObject,
  assertPopulatedObject,
  assertPopulatedString, assertPositive, assertTrue, isAboveZero, isArray, isBoolean, isNumber, isObject, isPopulatedString, isPositive} from "../Utility/Is"
import {
  assertMashData, CastData, ClipOrEffect, EditedData, Editor, EditorArgs, EditorIndex, isCastData,
  MashData,
} from "./Editor"
import { editorSelectionInstance } from "./EditorSelection/EditorSelectionFactory"

import { EditorSelection, EditorSelectionObject } from "./EditorSelection/EditorSelection"
import { Action, ActionObject } from "./Actions/Action/Action"
import { ChangeAction } from "./Actions/Action/ChangeAction"
import { Actions } from "./Actions/Actions"

import { Factory } from "../Definitions/Factory"
import { assertCast, castInstance, isCast } from "../Edited/Cast/CastFactory"
import { mashInstance } from "../Edited/Mash/MashFactory"
import {
  assertLayer, assertLayerFolder, assertLayerMash} from "../Edited/Cast/Layer/LayerFactory"

import { Layer, LayerAndPosition, LayerObject } from "../Edited/Cast/Layer/Layer"
import { Defined } from "../Base/Defined"
import { assertClip, isClip, ClipObject, Clip, Clips } from "../Edited/Mash/Track/Clip/Clip"
import { clipDefault } from "../Edited/Mash/Track/Clip/ClipFactory"
import { isContentDefinition } from "../Content/Content"
import { DataPutRequest } from "../Api/Data"
import { PreviewOptions, Svgs } from "./Preview/Preview"
import { svgElement } from "../Utility/Svg"
import { idGenerate, idTemporary } from "../Utility/Id"
import { assertContainer } from "../Container/Container"
import { Cast } from "../Edited/Cast/Cast"
import { GraphFileOptions } from "../MoveMe"
import { arrayUnique } from "../Utility/Array"
import { isUpdatableDurationDefinition, UpdatableDurationDefinition } from "../Mixin/UpdatableDuration"
import { ActivityType } from "../Utility/Activity"
import { isVideoDefinition } from "../Media/Video/Video"
import { isAudioDefinition } from "../Media/Audio/Audio"
import { isImageDefinition } from "../Media/Image/Image"
import { LoadedInfo } from "../Loader/Loader"
import { PointZero } from "../Utility/Point"
import { Rect } from "../Utility/Rect"

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

  add(object: DefinitionObject | DefinitionObjects, editorIndex?: EditorIndex): Promise<Definition[]> {
    const objects = isArray(object) ? object : [object]
    if (!objects.length) return Promise.resolve([])
    
    const definitions = objects.map(definitionObject => {
      assertPopulatedObject(definitionObject)
    
      return Defined.fromObject(definitionObject)
    })
    if (!editorIndex) return Promise.resolve(definitions)

    const loadDefinitions = definitions.filter(definition => {
      if (!isUpdatableDurationDefinition(definition)) return false

      return !isAboveZero(definition.duration)
    }) as UpdatableDurationDefinition[]
    const files = loadDefinitions.map(definition => definition.graphFile(true))
    const { preloader } = this
    const promise = preloader.loadFilesPromise(files)
    
    return promise.then(() => {
      const clips = definitions.map(definition => {
        const { id } = definition
        const clipObject: ClipObject = {}
        if (isContentDefinition(definition)) clipObject.contentId = id
        else clipObject.containerId = id
        return clipDefault.instanceFromObject(clipObject)
      })
      return this.addClip(clips, editorIndex).then(() => definitions)
    })
  }

  addClip(clip: Clip | Clips, editorIndex: EditorIndex): Promise<void> {
    // if track index defined - drop on timeline
    // if layer index defined - drop on composer
    // otherwise - drop on player

    console.log(this.constructor.name, "addClip", editorIndex)

    const { clip: frameOrIndex = 0, track: trackIndex = 0 } = editorIndex
    const clips = isArray(clip) ? clip : [clip]
    const [firstClip] = clips
    if (!firstClip) return Promise.resolve()

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
    const options: ActionObject = {
      clips, type: ActionType.AddClipToTrack, trackIndex,
      redoSelection, createTracks
    }
    
    if (dense) {
      const insertIndex = isPositive(frameOrIndex) ? frameOrIndex : trackClips.length
      options.insertIndex = insertIndex
    } else {
      if (createTracks) options.redoFrame = 0
      else {
        assertTrack(track)
        const frame = isPositive(frameOrIndex) ? frameOrIndex : track.frames
        options.redoFrame = track.frameForClipNearFrame(firstClip, frame)
      }
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
    const redoSelection: EditorSelectionObject = { ...this.selection.object }
    const options = {
      effects,
      undoEffects,
      redoEffects,
      redoSelection,
      type: ActionType.MoveEffect
    }
    this.actions.create(options)
    return this.loadMashAndDraw()
  }

  addFiles(files: File[], editorIndex?: EditorIndex): Promise<Definition[]> {
    let promise: Promise<void> = Promise.resolve()
    const definitions: DefinitionObjects = []
    const { preloader, eventTarget } = this
    files.forEach(file => {
      const { name, type } = file
      const coreType = type.split('/').shift()
      if (!isLoadType(coreType)) return 
      
      const url = URL.createObjectURL(file)
      const definitionObject: DefinitionObject = {
        type: coreType, label: name, url, source: url, id: idGenerate()
      }
      const info = { 
        id: idGenerate('activity'), type: ActivityType.Analyze, label: name 
      }
      switch(coreType){
        case LoadType.Audio: {
          const audioPromise = promise.then(() => {
            eventTarget.emit(EventType.Activity, { ...info, steps: 1 })
            return preloader.audioPromise(url)
          })
          promise = audioPromise.then(audio => {
            const { duration } = audio
            if (isAboveZero(duration)) {
              const object = { 
                ...definitionObject, loadedAudio: audio, duration: audio.duration 
              }
              definitions.push(object)
              eventTarget.emit(EventType.Activity, { 
                ...info, step: 1, steps: 1, type: ActivityType.Complete
              })
            } else {
              eventTarget.emit(EventType.Activity, { 
                ...info, type: ActivityType.Error, error: 'import.duration', 
                value: duration,
              }) 
            }
          })
          break
        }
        case LoadType.Image: {
          const imagePromise = promise.then(() => {
            eventTarget.emit(EventType.Activity, { ...info, steps: 1 })
            return preloader.imagePromise(url)
          })
          promise = imagePromise.then(image => {
            const previewSize = sizeCopy(image)
            if (sizeAboveZero(previewSize)) {
              const object = { 
                ...definitionObject, icon: url, loadedImage: image, 
                previewSize,
              }
              definitions.push(object)
              eventTarget.emit(EventType.Activity, { 
                ...info, step: 1, steps: 1, type: ActivityType.Complete
              })

            } else {
              const { width, height } = previewSize
              eventTarget.emit(EventType.Activity, { 
                ...info, type: ActivityType.Error, error: 'import.size', 
                value: `${width}x${height}`,
              })  
            }
          })
          break
        }
        case LoadType.Video: {
          const videoPromise = promise.then(() => {
            eventTarget.emit(EventType.Activity, { ...info, steps: 1 })
            return preloader.videoPromise(url)
          })
          promise = videoPromise.then(loadedVideo => {
            const { 
              duration, videoWidth, clientWidth, videoHeight, clientHeight 
            } = loadedVideo
            const width = videoWidth || clientWidth
            const height = videoHeight || clientHeight
            const previewSize = { width, height }
            const sizeOkay = sizeAboveZero(previewSize)
            const durationOkay = isAboveZero(duration)
            if (sizeOkay && durationOkay) {
              const loadedInfo: LoadedInfo = {
                ...previewSize, duration
              }
              preloader.loadDefinitionObject(definitionObject, loadedVideo, loadedInfo)

              const canvas = document.createElement('canvas')
              canvas.height = previewSize.height
              canvas.width = previewSize.width
              const ctx = canvas.getContext('2d')
              assertTrue(ctx)
              ctx.drawImage(loadedVideo, 0, 0, previewSize.width, previewSize.height)
              const icon = canvas.toDataURL()
              // console.log("icon", icon)
              const object = { 
                ...definitionObject, previewSize, loadedVideo, duration, icon
              }
              definitions.push(object)
              eventTarget.emit(EventType.Activity, { 
                ...info, step: 1, steps: 1, type: ActivityType.Complete 
              }) 
            } else { 
              eventTarget.emit(EventType.Activity, { 
                ...info, type: ActivityType.Error, 
                error: sizeOkay ? 'import.duration' : 'import.size', 
                value: sizeOkay ? duration : `${width}x${height}`,
              })  
            }
          })
          break
        }
      }
    })
    
    const definitionsPromise = promise.then(() => 
      this.add(definitions, editorIndex)
    )

    return definitionsPromise.then(definitions => {
      const { length } = definitions
      if (length) {
        const types = definitions.map(object => object.type)
        const definitionTypes = arrayUnique(types)
        this.eventTarget.emit(EventType.Added, { definitionTypes })
      }
      return definitions
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
    this.actions.create({ redoSelection, type: ActionType.AddTrack })
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

  private configureCast(cast: Cast): Promise<void> {
    this.configureEdited(cast)
    return cast.loadPromise({ editing: true, visible: true }).then(() => {
      this.selection.set(cast)
    }).then(() => { 
      // console.log(this.constructor.name, "configureCast loadPromise handleDraw")
      this.handleDraw() 
    })
  }

  private configureEdited(edited: Edited): void {
    edited.editor = this
    edited.imageSize = sizeCopy(this._rect)
    edited.emitter = this.eventTarget
  }

  private configureMash(mash: Mash): Promise<void> {
    mash.buffer = this.buffer
    mash.gain = this.gain
    mash.loop = this.loop
    this.configureEdited(mash)

    return mash.loadPromise({ editing: true, visible: true }).then(() => {
      this.selection.set(mash)
      // console.log(this.constructor.name, "configureMash loadPromise handleDraw", !!this.selection.mash)

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

    return edited.putPromise().then(() => {
      const { label } = edited 
      if (!isPopulatedString(label)) {
        edited.setValue('label', Default[editType].label)
      }
    
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

      return idTemporary(id)
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
          // case "frames":
          // case "startTrim":
          // case "endTrim":
          // case "speed":
          // case "frame": {
          //   mash.resetFrames()
          //   break
          // }
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
    const promise = edited.reload() || Promise.resolve()
    
    promise.then(() => {
      if (!mash) this.handleDraw()
      // console.log(this.constructor.name, "handleAction", type)
      this.eventTarget.emit(EventType.Action, { action })
    })
  }

  private handleDraw(event?: Event): void {
    // console.log(this.constructor.name, "handleDraw")
    if (!this.drawTimeout) {
      const { edited } = this
      if (!edited || edited.loading) {
        // console.log(this.constructor.name, "handleDraw", edited?.loading)
        return
      }
      this.drawTimeout = setTimeout(() => {

        // console.log(this.constructor.name, "handleDraw drawTimeout")
        this.eventTarget.dispatch(EventType.Draw)
        delete this.drawTimeout
      }, 10)
    }
  }

  private _rect: Rect = { ...PointZero, width: 300, height: 150 }
  get rect(): Rect { return this._rect }
  set rect(value: Rect) {
    this._rect = value
    const { edited } = this
    if (edited) edited.imageSize = sizeCopy(this._rect)
  }

  load(data: EditedData): Promise<void> {
    this.destroy()
    this.paused = true
    this.clearActions()
    this.selection.clear()
    if (isCastData(data)) return this.loadCastData(data)

    assertMashData(data)
    return this.loadMashData(data)
  }


  private loadCastData(data: CastData = {}): Promise<void> {
    const { cast: castObject = {}, definitions: definitionObjects = [] } = data
    Defined.undefineAll()
    Defined.define(...definitionObjects)

    this.eventTarget.trap(EventType.Draw, this.handleDraw.bind(this))

    const cast = castInstance(castObject, this.preloader)
    const promise = this.configureCast(cast)
    return promise
  }

  private loadMashAndDraw(): Promise<void> {
    const { mash } = this.selection
    if (!mash) throw new Error(Errors.selection)
    const args: GraphFileOptions = { editing: true, visible: true }
    if (!this.paused) args.audible = true
    return mash.loadPromise(args).then(() => { mash.draw() })
  }

  private loadMashData(data: MashData = {}): Promise<void> {
    // console.log(this.constructor.name, "loadMashData", data)
    const { mash: mashObject = {}, definitions: definitionObjects = [] } = data
    Defined.undefineAll()
    Defined.define(...definitionObjects)
    const mash = mashInstance({ ...mashObject, preloader: this.preloader })
    this.mashDestroy()
    const promise = this.configureMash(mash)

    return promise.then(() => {
      return this.goToTime().then(() => {
        if (this.autoplay) this.paused = false
      })
    })
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
    const { clip: frameOrIndex = 0, track: trackIndex = 0} = editorIndex
    if (!isObject(object)) throw Errors.argument + 'move'
    const { type } = object
    if (type === DefinitionType.Effect) {
      this.moveEffect(<Effect>object, frameOrIndex)
      return
    }

    this.moveClip(<Clip>object, editorIndex)
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
    const redoSelection: EditorSelectionObject = { 
      ...this.selection, clip: undefined 
    }
    const options = {
      redoSelection,
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
    const redoSelection: EditorSelectionObject = { 
      ...this.selection.object 
    }
    const options = {
      redoSelection,
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
  
  svgItems(disabled?: boolean): Promise<SvgItem[]> {
    const { edited } = this
    // return an empty element if we haven't loaded anything yet
    if (!edited) return Promise.resolve([svgElement(this.rect)])

    const options: PreviewOptions = {}
    if (!disabled) options.editor = this
    return edited.svgItems(options)
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
    if (typeChanged) {
      // support changing a video to a videosequence
      const newDefinition = Factory[newType].definition(definitionObject)
      Defined.updateDefinition(target, newDefinition)
    } else if (idChanged) {
      Defined.updateDefinitionId(target.id, id)
      Object.assign(target, definitionObject)
      if (isVideoDefinition(target)) delete target.loadedVideo 
      else if (isAudioDefinition(target)) delete target.loadedAudio
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
