
import {
  Any, Size, VisibleContextData
} from "../../declarations"

import { Emitter } from "../../Helpers/Emitter"
import { SelectionValue } from "../../Base/Propertied"
import { CastEditor, CastEditorOptions } from "./CastEditor"

import { EditType, EventType } from "../../Setup/Enums"
import { EditorClass } from "../EditorClass"
import { Cast } from "../../Edited/Cast/Cast"
import { CastFactory } from "../../Edited/Cast/CastFactory"

class CastEditorClass extends EditorClass implements CastEditor {
  // [index : string] : unknown
  constructor(...args: Any[]) {
    super(...args)
    const [object] = args
    const { } = <CastEditorOptions> object
  }

  change(_property: string, _value?: SelectionValue): void {
    // ...
  }

  editType = EditType.Cast

  get editingMash(): boolean {
    return false
  }
  eventTarget = new Emitter()

  get imageData() : VisibleContextData { return this.cast.imageData }

  get imageSize() : Size { return this.cast.imageSize }

  set imageSize(value : Size) {this.cast.imageSize = value }

  private _cast? : Cast

  get cast() : Cast {
    if (this._cast) return this._cast

    const instance = CastFactory.instance()
    this.cast =instance
    return instance
  }

  set cast(object: Cast) {
    if (this._cast === object) return

    // if (this._stream) this._stream.destroy()

    this._cast = object
    this._cast.emitter = this.eventTarget
    // if (this._actions) {
    //   this._actions.destroy()
    //   this._actions.cast = this._stream
    // }

    this.eventTarget.emit(EventType.Cast)

    this.eventTarget.emit(EventType.Action)

  }

  streaming = false

  streamUrl = ''
}

export { CastEditorClass }
