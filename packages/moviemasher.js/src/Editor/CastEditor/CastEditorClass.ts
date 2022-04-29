import { Any, Scalar, SelectedProperties, Size, VisibleContextData } from "../../declarations"
import { Emitter } from "../../Helpers/Emitter"
import { CastEditor, CastEditorOptions } from "./CastEditor"
import { EditType, EventType, SelectType } from "../../Setup/Enums"
import { EditorClass } from "../EditorClass"
import { Cast } from "../../Edited/Cast/Cast"
import { CastFactory } from "../../Edited/Cast/CastFactory"

class CastEditorClass extends EditorClass implements CastEditor {
  constructor(...args: Any[]) {
    super(...args)
    const [object] = args
    const { } = <CastEditorOptions> object
  }
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

  change(property: string, value?: Scalar): void {
    this.cast.setValue(value!, property)
  }

  editType = EditType.Cast

  get editingMash(): boolean {
    return false
  }
  eventTarget = new Emitter()

  get imageData() : VisibleContextData { return this.cast.imageData }

  get imageSize() : Size { return this.cast.imageSize }

  set imageSize(value : Size) {this.cast.imageSize = value }

  get selectedProperties(): SelectedProperties {
    const properties: SelectedProperties = []
    properties.push(...this.cast.properties.map(property => ({
      selectType: SelectType.Cast, property, changeHandler: this.change,
      value: this.cast.value(property.name)
    })))
    return properties
  }

  streaming = false

  streamUrl = ''
}

export { CastEditorClass }
