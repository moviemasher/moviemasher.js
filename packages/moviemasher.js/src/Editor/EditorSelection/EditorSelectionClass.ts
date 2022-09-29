import { Cast } from "../../Edited/Cast/Cast"
import { Layer } from "../../Edited/Cast/Layer/Layer"
import { isMash, Mash } from "../../Edited/Mash/Mash"
import { isTrack, Track } from "../../Edited/Mash/Track/Track"
import { Clip, isClip } from "../../Edited/Mash/Track/Clip/Clip"
import { EventType, isClipSelectType, SelectType, SelectTypes } from "../../Setup/Enums"
import { Selectable, SelectableRecord, Selectables } from "../Selectable"
import { EditorSelection, EditorSelectionObject } from "./EditorSelection"
import { SelectedItems } from "../../Utility/SelectedProperty"
import { assertTrue, isPopulatedString, isPositive } from "../../Utility/Is"
import { Editor } from "../Editor"
import { Container } from "../../Container/Container"
import { Content } from "../../Content/Content"
import { isLayer, isLayerMash } from "../../Edited/Cast/Layer/LayerFactory"
import { isCast } from "../../Edited/Cast/CastFactory"
import { Effect, isEffect } from "../../Media/Effect/Effect"

export class EditorSelectionClass implements EditorSelection {
    get [SelectType.None](): Selectable | undefined { return undefined }

  get [SelectType.Cast](): Cast | undefined { 
    const { cast } = this._object
    if (isCast(cast)) return cast
  }
  get [SelectType.Clip](): Clip | undefined { 
    const { clip } = this._object
    if (isClip(clip)) return clip
  }
  get [SelectType.Layer](): Layer | undefined { 
    const { layer } = this._object
    if (isLayer(layer)) return layer
  }
  get [SelectType.Mash](): Mash | undefined { 
    const { mash } = this._object
    if (isMash(mash)) return mash

    const { layer } = this
    if (isLayerMash(layer)) return layer.mash
  }
  get [SelectType.Track](): Track | undefined { 
    const { clip, track } = this._object
    if (isTrack(track)) return track
    
    if (isClip(clip)) return clip.track
  }
  
  get [SelectType.Container](): Container | undefined { 
    const { clip } = this._object
    if (isClip(clip)) return clip.container
  }
  get [SelectType.Content](): Content | undefined { 
    const { clip } = this._object
    if (isClip(clip)) return clip.content
  }
  get [SelectType.Effect](): Effect | undefined { 
    const { effect } = this._object
    if (isEffect(effect)) return effect
  }

  private _editor?: Editor
  get editor() { return this._editor! }
  set editor(value: Editor) { this._editor = value }

  _focus = SelectType.Mash
  get focus(): SelectType { return this._focus }
  set focus(value: SelectType) { this._focus = value }

  get(selectType: SelectType): Selectable | undefined {
    return this[selectType]
  }

  unset(selectType: SelectType): void {
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
    return Object.fromEntries(SelectTypes.map(selectType => (
      [selectType, this.get(selectType)]
    )))

  }
  set object(selection: EditorSelectionObject) {
    const populated = this.selectionPopulated(selection)
    
    const { object: originalObject } = this
    this.clear()
    Object.assign(this._object, populated)

    const { object: newObject } = this

    // if (SelectTypes.every(type => originalObject[type] === newObject[type])) return

    const { mash: oldMash, cast: oldCast, clip: oldClip } = originalObject

    const { mash, cast, clip } = newObject

    if (clip !== oldClip) {
      if (isClip(clip) && isPositive(clip.trackNumber)) clip.track.mash.clearPreview()
      if (isClip(oldClip) && isPositive(oldClip.trackNumber)) oldClip.track.mash.clearPreview()
    }
    Object.assign(this._object, populated)

    this.editor.eventTarget.emit(EventType.Selection)  

    if (cast !== oldCast) this.editor.eventTarget.emit(EventType.Cast)
    if (mash !== oldMash) {
      this.editor.eventTarget.emit(EventType.Mash)
      this.editor.eventTarget.emit(EventType.Track)
      this.editor.eventTarget.emit(EventType.Duration)
    }
  }

  clear() {
    SelectTypes.forEach(selectType => { delete this._object[selectType] })
  }

  private selectionFromSelectables(selectables: Selectables): EditorSelectionObject {
    return Object.fromEntries(selectables.map(selectable => (
      [selectable.selectType, selectable]
    )))
  }

  private selectionPopulated(selection: EditorSelectionObject): EditorSelectionObject {
    const { mash: mashOld, object } = this
    const { cast: castOld } = object
    const { clip, track, layer, cast, mash, effect } = selection
    const target = effect || clip || track || mash || layer || cast || castOld || mashOld 
    assertTrue(target, 'target')

    return this.selectionFromSelectables(target.selectables())
  }

  get selectTypes(): SelectType[] {
    const selectTypes: SelectType[] = []
    const { mash, object } = this
    const { clip, track, cast, layer, effect } = object
    if (cast) {
      selectTypes.push(SelectType.Cast)
      if (layer) selectTypes.push(SelectType.Layer)
    }

    if (!mash) return selectTypes

    if (!cast) selectTypes.push(SelectType.Mash)
    if (!track) return selectTypes

    selectTypes.push(SelectType.Track)
    if (!isClip(clip)) return selectTypes

    selectTypes.push(SelectType.Clip)
    selectTypes.push(SelectType.Content)
    if (isEffect(effect)) selectTypes.push(SelectType.Effect)
    if (isPopulatedString(clip.containerId)) {
      selectTypes.push(SelectType.Container)
    }
    return selectTypes
  }

  selectedItems(types: SelectType[] = SelectTypes): SelectedItems {
    const { selectTypes, object: selection } = this
    const { clip } = selection
    const filteredTypes = selectTypes.filter(type => types.includes(type))
    
    return filteredTypes.flatMap(type => {
      let target = selection[type]
      if (isClipSelectType(type) && isClip(clip)) target = clip[type]
      assertTrue(target, type)
      
      return target.selectedItems(this.editor.actions)
    })
  }

}