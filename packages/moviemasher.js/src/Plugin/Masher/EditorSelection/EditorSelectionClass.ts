
import { isMashMedia, MashMedia } from "../../../Media/Mash/Mash"
import { isTrack, Track } from "../../../Media/Mash/Track/Track"
import { Clip, isClip } from "../../../Media/Mash/Track/Clip/Clip"
import { ClipType, ContainerType, ContentType, EffectType, EventType, MashType, NoneType, SelectorType, SelectorTypes, TrackType } from "../../../Setup/Enums"
import { Selectable, Selectables } from "../Selectable"
import { EditorSelection, EditorSelectionObject } from "./EditorSelection"
import { SelectedItems } from "../../../Helpers/Select/SelectedProperty"
import { assertTrue, isPopulatedString, isPositive } from "../../../Utility/Is"
import { Masher } from "../Masher"
import { Container } from "../../../Media/Container/Container"
import { Content } from "../../../Media/Content/Content"
import { Effect, isEffect } from "../../../Media/Effect/Effect"
import { Selector } from "../../../Helpers"

export class EditorSelectionClass implements EditorSelection {

  get selector(): Selector {
    return { type: NoneType }
  }

  get [NoneType](): Selectable | undefined { return undefined }


  get [ClipType](): Clip | undefined { 
    const { clip } = this._object
    if (isClip(clip)) return clip
  }

  get [MashType](): MashMedia | undefined { 
    const { mash } = this._object
    if (isMashMedia(mash)) return mash
  }
  get [TrackType](): Track | undefined { 
    const { clip, track } = this._object
    if (isTrack(track)) return track
    
    if (isClip(clip)) return clip.track
  }
  
  get [ContainerType](): Container | undefined { 
    const { clip } = this._object
    if (isClip(clip)) return clip.container
  }
  get [ContentType](): Content | undefined { 
    const { clip } = this._object
    if (isClip(clip)) return clip.content
  }
  get [EffectType](): Effect | undefined { 
    const { effect } = this._object
    if (isEffect(effect)) return effect
  }

  private _editor?: Masher
  get editor() { return this._editor! }
  set editor(value: Masher) { this._editor = value }

  _focus: SelectorType = MashType
  get focus(): SelectorType { return this._focus }
  set focus(value: SelectorType) { this._focus = value }

  get(selectType: SelectorType): Selectable | undefined {
    return this[selectType]
  }

  unset(selectType: SelectorType): void {
    // console.log(this.constructor.name, "unset", selectType)
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
    return Object.fromEntries(SelectorTypes.map(selectType => (
      [selectType, this.get(selectType)]
    )))

  }
  set object(selection: EditorSelectionObject) {
    const populated = this.selectionPopulated(selection)
    
    const { object: originalObject } = this
    this.clear()
    Object.assign(this._object, populated)

    const { object: newObject } = this

    // if (SelectorTypes.every(type => originalObject[type] === newObject[type])) return

    const { mash: oldMash, clip: oldClip } = originalObject

    const { mash, clip } = newObject

    if (clip !== oldClip) {
      if (isClip(clip) && isPositive(clip.trackNumber)) clip.track.mash.clearPreview()
      if (isClip(oldClip) && isPositive(oldClip.trackNumber)) oldClip.track.mash.clearPreview()
    }
    Object.assign(this._object, populated)

    this.editor.eventTarget.emit(EventType.Selection)  

    if (mash !== oldMash) {
      this.editor.eventTarget.emit(EventType.Loaded)
      this.editor.eventTarget.emit(EventType.Track)
      this.editor.eventTarget.emit(EventType.Duration)
    }
  }

  clear() {
    SelectorTypes.forEach(selectType => { delete this._object[selectType] })
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

    selectTypes.push(MashType)
    if (!track) return selectTypes

    selectTypes.push(TrackType)
    if (!isClip(clip)) return selectTypes

    selectTypes.push(ClipType)
    selectTypes.push(ContentType)
    if (isPopulatedString(clip.containerId)) {
      selectTypes.push(ContainerType)
    }
    return selectTypes
  }

  selectedItems(types: SelectorType[] = SelectorTypes): SelectedItems {
    const { selectTypes, object: selection } = this
    const filteredTypes = selectTypes.filter(type => types.includes(type))
    
    const { clip } = selection
    // console.log(this.constructor.name, "selectedItems", this.object)
    return filteredTypes.flatMap(type => {
      let target = selection[type]
      if ((type === ContainerType || type === ContentType) && isClip(clip)){
        target = clip[type]
      }
      assertTrue(target, type)
      
      return target.selectedItems(this.editor.actions)
    })
  }

}