
import type { Clip } from '../../../Media/Mash/Track/Clip/Clip.js'
import type { Track } from '../../../Media/Mash/Track/Track.js'
import type { MashMedia} from '../../../Media/Mash/Mash.js'
import type {SelectedItems} from '../../../Helpers/Select/SelectedProperty.js'
import type {EditorSelection, EditorSelectionObject} from './EditorSelection.js'
import type {Selectable, Selectables} from '../Selectable.js'
import type {Effect} from '../../../Media/Effect/Effect.js'
import type {Container} from '../../../Media/Container/Container.js'
import type {Content} from '../../../Media/Content/Content.js'
import type { Selector } from '../../../Helpers/Select/Select.js'
import type {Masher} from '../Masher.js'
import type {SelectorType, } from '../../../Setup/Enums.js'

import {isMashMedia} from '../../../Media/Mash/Mash.js'
import { isTrack } from '../../../Media/Mash/Track/Track.js'
import { isClip } from '../../../Media/Mash/Track/Clip/Clip.js'
import {
  TypeClip, TypeContainer, TypeContent, TypeEffect, TypeMash, TypeNone, 
  TypesSelector, TypeTrack, EventTypeDuration, EventTypeLoaded, 
  EventTypeSelection, EventTypeTrack
} from '../../../Setup/Enums.js'
import { assertTrue, isPopulatedString, isPositive } from '../../../Utility/Is.js'
import { isEffect} from '../../../Media/Effect/Effect.js'

export class EditorSelectionClass implements EditorSelection {

  get selector(): Selector {
    return { type: TypeNone }
  }

  get [TypeNone](): Selectable | undefined { return undefined }


  get [TypeClip](): Clip | undefined { 
    const { clip } = this._object
    if (isClip(clip)) return clip
  }

  get [TypeMash](): MashMedia | undefined { 
    const { mash } = this._object
    if (isMashMedia(mash)) return mash
  }
  get [TypeTrack](): Track | undefined { 
    const { clip, track } = this._object
    if (isTrack(track)) return track
    
    if (isClip(clip)) return clip.track
  }
  
  get [TypeContainer](): Container | undefined { 
    const { clip } = this._object
    if (isClip(clip)) return clip.container
  }
  get [TypeContent](): Content | undefined { 
    const { clip } = this._object
    if (isClip(clip)) return clip.content
  }
  get [TypeEffect](): Effect | undefined { 
    const { effect } = this._object
    if (isEffect(effect)) return effect
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
      if (isClip(clip) && isPositive(clip.trackNumber)) clip.track.mash.clearPreview()
      if (isClip(oldClip) && isPositive(oldClip.trackNumber)) oldClip.track.mash.clearPreview()
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
    if (!isClip(clip)) return selectTypes

    selectTypes.push(TypeClip)
    selectTypes.push(TypeContent)
    if (isPopulatedString(clip.containerId)) {
      selectTypes.push(TypeContainer)
    }
    return selectTypes
  }

  selectedItems(types: SelectorType[] = TypesSelector): SelectedItems {
    const { selectTypes, object: selection } = this
    const filteredTypes = selectTypes.filter(type => types.includes(type))
    
    const { clip } = selection
    // console.log(this.constructor.name, 'selectedItems', this.object)
    return filteredTypes.flatMap(type => {
      let target = selection[type]
      if ((type === TypeContainer || type === TypeContent) && isClip(clip)){
        target = clip[type]
      }
      assertTrue(target, type)
      
      return target.selectedItems(this.editor.actions)
    })
  }

}