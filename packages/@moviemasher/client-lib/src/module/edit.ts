import type { ChangeEdit, ChangeEditObject, ChangePropertiesEditObject, ChangePropertyEdit, ChangePropertyEditObject, ClientClip, ClientMashAsset, ClientTrack, Clip, Clips, Edit, EditObject, Edits, Propertied, PropertyId, PropertyIds, Scalar, ScalarsById } from '@moviemasher/shared-lib/types.js'
import type { AddClipsEditObject, AddTrackEditObject, ChangePropertiesEdit, MoveClipEditObject, RemoveClipEditObject } from '../types.js'

import { $CHANGE, $CHANGES, $CLIP, $EDIT, $FRAME, DOT, ERROR, MOVIE_MASHER, arrayOfNumbers, errorThrow, isAsset } from '@moviemasher/shared-lib/runtime.js'
import { isDefined, isObject, isPositive } from '@moviemasher/shared-lib/utility/guard.js'
import { assertDefined, isChangeEdit, isChangeEditObject, isChangePropertyEdit, isChangePropertyEditObject, isClip, isInstance, isPropertyId } from '@moviemasher/shared-lib/utility/guards.js'
import { isClientClip } from '../guards/ClientMashGuards.js'
import { assertClientInstance } from '@moviemasher/shared-lib/utility/client-guards.js'
import { EventChangeClipId, EventChangedClientAction } from '../module/event.js'
import { $INSERT, ADD_TRACK, MOVE_CLIP, REDO, REMOVE_CLIP, UNDO } from '../utility/constants.js'
import { EventChangeAssetId, EventChangedScalars } from './event.js'


const isChangePropertiesEdit = (value: any): value is ChangePropertiesEdit => (
  isChangeEdit(value) 
  && 'redoValues' in value && isObject(value.redoValues)
  && 'undoValues' in value && isObject(value.undoValues)
)

const isChangePropertiesEditObject = (value: any): value is ChangePropertiesEditObject => (
  isChangeEditObject(value) 
  && 'redoValues' in value && isObject(value.redoValues)
  && 'undoValues' in value && isObject(value.undoValues)
)

class EditClass implements Edit {
  constructor(object: EditObject) {
    this.type = object.type
  }

  get affects(): PropertyIds { return [] }

  done = false

  redo(): void {
    this.redoEdit()
    this.done = true
  }

  protected redoEdit(): void { errorThrow(ERROR.Unimplemented) }

  type: string

  undo(): void {
    this.undoEdit()
    this.done = false
  }

  protected undoEdit(): void { errorThrow(ERROR.Unimplemented) }

  updateSelection(): void {}
}

class AddTrackEditClass extends EditClass {
  constructor(object: AddTrackEditObject) {
    super(object)
    const { createTracks, mashAsset } = object
    this.createTracks = createTracks
    this.mashAsset = mashAsset
  }

  createTracks: number

  mashAsset: ClientMashAsset

  override redoEdit(): void {
    arrayOfNumbers(this.createTracks).forEach(() => this.mashAsset.addTrack())
  }

  override undoEdit(): void {
    arrayOfNumbers(this.createTracks).forEach(() => this.mashAsset.removeTrack())
  }
}

class AddClipsEditClass extends AddTrackEditClass {
  constructor(object: AddClipsEditObject) {
    super(object)
    const { clips, insertIndex, trackIndex, redoFrame } = object
    this.clips = clips
    this.insertIndex = insertIndex
    this.trackIndex = trackIndex
    this.redoFrame = redoFrame
  }

  clips: Clips

  insertIndex?: number

  override redoEdit(): void {
    super.redoEdit()
    const { mashAsset, redoFrame, trackIndex, insertIndex, clips } = this
    mashAsset.addClipToTrack(clips, trackIndex, insertIndex, redoFrame)
  }

  redoFrame?: number

  get track(): ClientTrack { return this.mashAsset.tracks[this.trackIndex] }

  trackIndex: number

  override undoEdit(): void {
    const { mashAsset, clips } = this
    mashAsset.removeClipFromTrack(clips)
    super.undoEdit()
  }

  override updateSelection(): void {
    const { done, clips } = this
    MOVIE_MASHER.dispatch(EventChangeClipId.Type, done ? clips[0].id : undefined)
  }
}

class ChangeEditClass extends EditClass implements ChangeEdit {
  constructor(object: ChangeEditObject) {
    const { target } = object
    super(object)
    this.target = target
  }

  target: Propertied

  updateEdit(_: ChangeEditObject): void { errorThrow(ERROR.Unimplemented) }

  override updateSelection(): void {
    const { target } = this
    if (isClip(target)) {
      MOVIE_MASHER.dispatch(EventChangeClipId.Type, target.id)
    } else if (isInstance(target)) {
      MOVIE_MASHER.dispatch(EventChangeClipId.Type, target.clip.id)
    } else if (isAsset(target)) {
      MOVIE_MASHER.dispatchCustom(new EventChangeAssetId(target.id))
    }
    MOVIE_MASHER.dispatchCustom(new EventChangedScalars(this.affects))
  }
}

class ChangePropertyEditClass extends ChangeEditClass implements ChangePropertyEdit {
  constructor(object: ChangePropertyEditObject) {
    super(object)
    const { property, redoValue, undoValue } = object
    this.redoValue = redoValue
    this.undoValue = undoValue
    this.property = property
  }

  override get affects(): PropertyIds { return [this.property] }

  property: PropertyId

  override redoEdit(): void {
    const { target, redoValue, property } = this
    target.setValue(property, redoValue)
  }

  redoValue?: Scalar

  protected get redoValueNumber(): number { return Number(this.redoValue) }

  override undoEdit(): void {
    const { target, undoValue, property } = this
    target.setValue(property, undoValue)
  }

  undoValue?: Scalar

  protected get undoValueNumber(): number { return Number(this.undoValue) }

  override updateEdit(object: ChangePropertyEditObject): void {
    const { redoValue } = object
    this.redoValue = redoValue
    this.redo()
  }

  get value(): Scalar | undefined { return this.done ? this.redoValue : this.undoValue }

  get valueNumber(): number | undefined {
    const { value } = this
    return isDefined(value) ? Number(value) : undefined
  }
}

class ChangePropertiesEditClass extends ChangeEditClass implements ChangePropertiesEdit {
  constructor(object: ChangePropertiesEditObject) {
    const { redoValues, undoValues } = object
    super(object)
    this.undoValues = undoValues
    this.redoValues = redoValues
  }

  override get affects(): PropertyIds {
    const names = Object.keys(this.done ? this.redoValues : this.undoValues)
    return names.filter(isPropertyId)
  }

  override redoEdit(): void {
    const { target, redoValues } = this
    Object.entries(redoValues).forEach(([property, value]) => {
      target.setValue(property, value)
    })
  }

  redoValues: ScalarsById

  override undoEdit(): void {
    const { target, undoValues } = this
    Object.entries(undoValues).forEach(([property, value]) => {
      target.setValue(property, value)
    })
  }

  undoValues: ScalarsById

  override updateEdit(object: ChangePropertiesEditObject): void {
    const { redoValues } = object
    this.redoValues = redoValues
    this.redo()
  }
}

class ChangeFramesEditClass extends ChangePropertyEditClass {
  private get clip(): ClientClip {
    const { target } = this
    if (isClientClip(target)) return target

    assertClientInstance(target)
    return target.clip
  }

  private get mash(): ClientMashAsset { return this.clip.track!.mash }

  override redoEdit(): void {
    this.mash.changeTiming(this.target, this.property, this.redoValueNumber)
  }

  override undoEdit(): void {
    this.mash.changeTiming(this.target, this.property, this.undoValueNumber)
  }
}

class MoveClipEditClass extends AddTrackEditClass {
  constructor(object: MoveClipEditObject) {
    super(object)
    const {
      clip, insertIndex, redoFrame, trackIndex, undoFrame, 
      undoInsertIndex, undoTrackIndex
    } = object
    this.clip = clip
    this.insertIndex = insertIndex
    this.redoFrame = redoFrame
    this.trackIndex = trackIndex
    this.undoFrame = undoFrame
    this.undoInsertIndex = undoInsertIndex
    this.undoTrackIndex = undoTrackIndex
  }

  override get affects(): PropertyIds { return [`${$CLIP}${DOT}frame`] }

  clip: Clip

  insertIndex?: number

  trackIndex: number

  undoTrackIndex: number

  undoInsertIndex?: number

  undoFrame?: number

  redoFrame?: number

  addClip(trackIndex: number, insertIndex?: number, frame?: number): void {
    this.mashAsset.addClipToTrack(this.clip, trackIndex, insertIndex, frame)
  }

  override redoEdit(): void {
    super.redoEdit()
    this.addClip(this.trackIndex, this.insertIndex, this.redoFrame)
  }

  override undoEdit(): void {
    this.addClip(this.undoTrackIndex, this.undoInsertIndex, this.undoFrame)
    super.undoEdit()
  }

  override updateSelection(): void {
    MOVIE_MASHER.dispatch(EventChangeClipId.Type, this.clip.id)
    MOVIE_MASHER.dispatchCustom(new EventChangedScalars(this.affects))
  }
}

class RemoveClipEditClass extends EditClass {
  constructor(object: RemoveClipEditObject) {
    super(object)
    const { clip, index, track } = object
    this.clip = clip
    this.index = index
    this.track = track
  }

  clip: Clip

  index: number

  private get mash(): ClientMashAsset { return this.track.mash }

  get trackIndex(): number { return this.track.index }

  override redoEdit(): void {
    this.mash.removeClipFromTrack(this.clip)
  }

  track: ClientTrack

  override undoEdit(): void {
    this.mash.addClipToTrack(this.clip, this.trackIndex, this.index)
  }

  override updateSelection(): void {
    const { done, clip } = this
    MOVIE_MASHER.dispatch(EventChangeClipId.Type, done ? undefined : clip.id)
  }
}

class EditsClass implements Edits {
  constructor(public mashAsset: ClientMashAsset) { }

  private add(action: Edit): void {
    const remove = this.instances.length - (this.index + 1)
    if (isPositive(remove)) this.instances.splice(this.index + 1, remove)

    this.instances.push(action)
  }

  get canRedo(): boolean { return this.index < this.instances.length - 1 }

  get canSave(): boolean { return this.canUndo }

  get canUndo(): boolean { return this.index > -1 }

  create(object: EditObject): void {
    const { type = $CHANGE, ...rest } = object
    const clone: EditObject = { ...rest, type }
    if (this.currentEditIsLast) {
      const { currentEdit: action } = this
      if (isChangeEditObject(object) && isChangeEdit(action)) {
        const { target } = object
        if (action.target === target) {
          if (
            isChangePropertyEditObject(object)
            && isChangePropertyEdit(action) 
            && action.property === object.property
          ) {
            action.updateEdit(object)
            this.dispatchChangedEdit(action)
            return
          }
          else if (
            isChangePropertiesEditObject(object)
            && isChangePropertiesEdit(action)
          ) {
            const { redoValues } = object
            const { undoValues } = action
            const objectKeys = Object.keys(redoValues)
            const actionKeys = Object.keys(undoValues)
            if (objectKeys.some(key => actionKeys.includes(key))) {
              action.updateEdit(object)
              this.dispatchChangedEdit(action)
              return
            }
          }
        }
      }
    }
    const action = MOVIE_MASHER.call<Edit, EditObject>(type, clone, $EDIT)
    this.add(action)
    this.redo()
  }

  private get currentEdit(): Edit | undefined { return this.instances[this.index] }

  private get currentEditIsLast(): boolean { return this.canUndo && !this.canRedo }

  private dispatchChangedAction(): void {
    MOVIE_MASHER.dispatchCustom(new EventChangedClientAction(UNDO))
    MOVIE_MASHER.dispatchCustom(new EventChangedClientAction(REDO))
  }

  private dispatchChangedEdit(edit: Edit): void {
    const { mashAsset } = this
    edit.updateSelection()
    this.dispatchChangedAction()
    mashAsset.dispatchChanged(edit)
  }

  private index = -1

  private instances: Edit[] = []

  redo(): void {
    this.index += 1
    const action = this.currentEdit
    assertDefined(action)

    action.redo()
    this.dispatchChangedEdit(action)
  }

  save(): void {
    this.instances.splice(0, this.index + 1)
    this.index = -1
    this.dispatchChangedAction()
  }

  undo(): void {
    const action = this.currentEdit
    assertDefined(action)
    
    this.index -= 1
    action.undo()
    this.dispatchChangedEdit(action)
  }
}

export const editFunction = (object: EditObject | ClientMashAsset): Edit | Edits => {
  const { type } = object
  switch (type) {
    case $INSERT: return new AddClipsEditClass(<AddClipsEditObject>object)
    case ADD_TRACK: return new AddTrackEditClass(<AddTrackEditObject>object)
    case $CHANGE: return new ChangePropertyEditClass(<ChangePropertyEditObject>object)
    case $FRAME: return new ChangeFramesEditClass(<ChangePropertyEditObject>object)
    case $CHANGES: return new ChangePropertiesEditClass(<ChangePropertiesEditObject>object)
    case MOVE_CLIP: return new MoveClipEditClass(<MoveClipEditObject>object)
    case REMOVE_CLIP: return new RemoveClipEditClass(<RemoveClipEditObject>object)
    default: return new EditsClass(<ClientMashAsset>object)
  }
}
