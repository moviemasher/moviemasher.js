
import type {SelectedProperties} from '@moviemasher/runtime-client'
import type {EditorSelection} from './EditorSelection.js'
import type { EditorSelectionObject } from "@moviemasher/runtime-client"
import type {Selectable, Selectables} from '@moviemasher/runtime-client'
import type { Selector } from '../../../Helpers/Select/Select.js'
import type {Masher} from '../Masher.js'
import type { SelectorType } from "@moviemasher/runtime-client"
import type { ClientClip, ClientTrack, ClientMashAsset } from '../../../Client/Mash/ClientMashTypes.js'
import type { ClientInstance } from '../../../Client/ClientTypes.js'

import {
  TypeClip, TypeContainer, TypeContent, TypeMash, TypeNone,
  TypesSelector, TypeTrack, EventTypeDuration, EventTypeLoaded,
  EventTypeSelection, EventTypeTrack
} from "../../../Setup/EnumConstantsAndFunctions.js"
import { assertTrue, isPositive } from '../../../Shared/SharedGuards.js'
import { isPopulatedString } from "@moviemasher/runtime-shared"
import { isClientClip, isClientTrack, isClientMashAsset } from '../../../Client/Mash/ClientMashGuards.js'

export class EditorSelectionClass implements EditorSelection {
  get selector(): Selector {
    return { type: TypeNone }
  }

  get [TypeNone](): Selectable | undefined { return undefined }


  get [TypeClip](): ClientClip | undefined { 
    const { clip } = this._object
    if (isClientClip(clip)) return clip as ClientClip
  }

  get [TypeMash](): ClientMashAsset | undefined { 
    const { mash } = this._object
    if (isClientMashAsset(mash)) return mash
  }
  get [TypeTrack](): ClientTrack | undefined { 
    const { clip, track } = this._object
    if (isClientTrack(track)) return track
    
    if (isClientClip(clip)) return clip.track
  }
  
  get [TypeContainer](): ClientInstance | undefined { 
    const { clip } = this
    if (clip) return clip.container
  }
  get [TypeContent](): ClientInstance | undefined { 
    const { clip } = this
    if (clip) return clip.content
  }

  private _editor?: Masher
  get editor() { return this._editor! }
  set editor(value: Masher) { this._editor = value }

  _focus: SelectorType = TypeMash
  get focus(): SelectorType { return this._focus }
  set focus(value: SelectorType) { this._focus = value }

  get(selectType: SelectorType): Selectable | undefined {
    return this[selectType]
  }

  unset(selectType: SelectorType): void {
    // console.log(this.constructor.name, 'unset', selectType)
    const selectable = this.object[selectType]
    if (!selectable) return
    const selectables = selectable.selectables()
    assertTrue(selectables[0] === selectable)
    selectables.shift() 
    this.object = this.selectionFromSelectables(selectables)
  }

  set(selectable: Selectable): void {
    const { selectType } = selectable
    this.object = { [selectType]: selectable }
  }

  
  _object: EditorSelectionObject = {}


  get object() { 
    return Object.fromEntries(TypesSelector.map(selectType => (
      [selectType, this.get(selectType)]
    )))

  }
  set object(selection: EditorSelectionObject) {
    const populated = this.selectionPopulated(selection)
    
    const { object: originalObject } = this
    this.clear()
    Object.assign(this._object, populated)

    const { object: newObject } = this

    // if (TypesSelector.every(type => originalObject[type] === newObject[type])) return

    const { mash: oldMash, clip: oldClip } = originalObject

    const { mash, clip } = newObject

    if (clip !== oldClip) {
      if (isClientClip(clip) && isPositive(clip.trackNumber)) clip.track.mash.clearPreview()
      if (isClientClip(oldClip) && isPositive(oldClip.trackNumber)) oldClip.track.mash.clearPreview()
    }
    Object.assign(this._object, populated)

    this.editor.eventTarget.emit(EventTypeSelection)  

    if (mash !== oldMash) {
      this.editor.eventTarget.emit(EventTypeLoaded)
      this.editor.eventTarget.emit(EventTypeTrack)
      this.editor.eventTarget.emit(EventTypeDuration)
    }
  }

  clear() {
    TypesSelector.forEach(selectType => { delete this._object[selectType] })
  }

  private selectionFromSelectables(selectables: Selectables): EditorSelectionObject {
    return Object.fromEntries(selectables.map(selectable => (
      [selectable.selectType, selectable]
    )))
  }

  private selectionPopulated(selection: EditorSelectionObject): EditorSelectionObject {
    const { mash: mashOld, object } = this
    const { clip, track, mash } = selection
    const target = clip || track || mash || mashOld 
    assertTrue(target, 'target')

    return this.selectionFromSelectables(target.selectables())
  }

  get selectTypes(): SelectorType[] {
    const selectTypes: SelectorType[] = []
    const { mash, object } = this
    const { clip, track } = object
   
    if (!mash) return selectTypes

    selectTypes.push(TypeMash)
    if (!track) return selectTypes

    selectTypes.push(TypeTrack)
    if (!isClientClip(clip)) return selectTypes

    selectTypes.push(TypeClip)
    selectTypes.push(TypeContent)
    if (isPopulatedString(clip.containerId)) {
      selectTypes.push(TypeContainer)
    }
    return selectTypes
  }

  selectedItems(types: SelectorType[] = TypesSelector): SelectedProperties {
    const { selectTypes, object: selection } = this
    const filteredTypes = selectTypes.filter(type => types.includes(type))
    
    const { clip } = selection
    // console.log(this.constructor.name, 'selectedItems', this.object)
    return filteredTypes.flatMap(type => {
      let target = selection[type]
      if ((type === TypeContainer || type === TypeContent) && isClientClip(clip)){
        target = clip[type]
      }
      assertTrue(target, type)
      
      return target.selectedItems(this.editor.actions)
    })
  }

}