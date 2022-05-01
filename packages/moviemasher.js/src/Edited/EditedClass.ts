import { Any, Described, Size, UnknownObject, VisibleContextData } from "../declarations"
import { Emitter } from "../Helpers/Emitter"
import { Errors } from "../Setup/Errors"
import { DataType, EventType } from "../Setup/Enums"
import { propertyInstance } from "../Setup/Property"
import { Edited } from "./Edited"
import { PropertiedClass } from "../Base/Propertied"
import { isUndefined } from "../Utility/Is"

export class EditedClass extends PropertiedClass implements Edited {
  constructor(...args: Any[]) {
    super(...args)
    const [object] = args
    const { createdAt, id, label } = object as Described

    if (id) this._id = id
    if (createdAt) this.createdAt = createdAt
    if (label) this.label = label

    this.properties.push(propertyInstance({ name: 'label', type: DataType.String }))
  }

  createdAt = ''

  data: UnknownObject = {}

  protected dataPopulate(rest: UnknownObject) {
    Object.entries(rest).forEach(([key, value]) => {
      if (this.properties.find(property => property.name === key)) return
      this.data[key] = value
    })
  }

  _emitter?: Emitter
  get emitter(): Emitter | undefined { return this._emitter }
  set emitter(value: Emitter | undefined) {
    this._emitter = value
    this.emitterChanged()
  }
  protected emitterChanged() { }

  protected _id = ''
  get id(): string { return this._id }
  set id(value: string) {
    this._id = value
    this.emitter?.emit(EventType.Save)
  }

  get imageData(): VisibleContextData { throw Errors.unimplemented }

  get imageSize(): Size { throw Errors.unimplemented }

  declare label: string

  toJSON(): UnknownObject {
    const json = super.toJSON()
    json.createdAt = this.createdAt
    Object.entries(this.data).forEach(([key, value]) => {
      if (isUndefined(json[key])) json[key] = value
    })
    if (this._id) json.id = this.id
    return json
  }
}
