import { Any, Scalar, SelectedProperties, Size, VisibleContextData } from "../../declarations"
import { Emitter } from "../../Helpers/Emitter"
import { CastEditor, CastEditorOptions } from "./CastEditor"
import { EditType, EventType, MasherAction, SelectType } from "../../Setup/Enums"
import { EditorClass } from "../EditorClass"
import { Cast } from "../../Edited/Cast/Cast"
import { castInstance } from "../../Edited/Cast/CastFactory"
import { DataCastGetResponse } from "../../Api/Data"

export class CastEditorClass extends EditorClass implements CastEditor {
  constructor(...args: Any[]) {
    super(...args)
    const [object] = args
    const { } = <CastEditorOptions> object
  }

  can(action: MasherAction): boolean { return true }

  get cast(): Cast { return this.edited }

  clear(): void {
    this.edited = castInstance()
  }

  private _edited? : Cast

  get edited() : Cast {
    if (this._edited) return this._edited

    const instance = castInstance()
    this.edited =instance
    return instance
  }

  set edited(object: Cast) {
    if (this._edited === object) return

    // if (this._stream) this._stream.destroy()

    this._edited = object
    this._edited.emitter = this.eventTarget
    // if (this._actions) {
    //   this._actions.destroy()
    //   this._actions.cast = this._stream
    // }

    this.eventTarget.emit(EventType.Cast)
    this.eventTarget.emit(EventType.Action)
  }

  change(property: string, value?: Scalar): void {
    this.edited.setValue(value!, property)
  }

  editType = EditType.Cast

  get editingMash(): boolean {
    return false
  }

  eventTarget = new Emitter()

  get imageData() : VisibleContextData { return this.edited.imageData }

  get imageSize() : Size { return this.edited.imageSize }

  set imageSize(value : Size) {this.edited.imageSize = value }

  loadData(data: DataCastGetResponse): void {
    const { cast } = data
    this.edited = castInstance(cast)
  }

  get selectedProperties(): SelectedProperties {
    const properties: SelectedProperties = []
    properties.push(...this.edited.properties.map(property => ({
      selectType: SelectType.Cast, property, changeHandler: this.change,
      value: this.edited.value(property.name)
    })))
    return properties
  }

  streaming = false

  streamUrl = ''
}
