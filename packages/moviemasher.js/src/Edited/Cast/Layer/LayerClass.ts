import { PropertiedClass } from "../../../Base/Propertied"
import { Errors } from "../../../Setup/Errors"
import { DataType, LayerType } from "../../../Setup/Enums"
import { propertyInstance } from "../../../Setup/Property"
import { Mashes } from "../../Mash/Mash"
import { Layer, LayerArgs } from "./Layer"
import { UnknownObject } from "../../../declarations"
import { idGenerate } from "../../../Utility/Id"

export class LayerClass extends PropertiedClass implements Layer {
  constructor(args: LayerArgs) {
    super()

    this._properties.push(propertyInstance({ name: 'label', type: DataType.String }))

    this.propertiesInitialize(args)
  }

  _id?: string
  get id(): string { return this._id ||= idGenerate() }

  get mashes(): Mashes { throw Errors.unimplemented + 'mashes'}

  declare label: string

  toJSON(): UnknownObject {
    const json = super.toJSON()
    json.type = this.type
    json.triggers = this.triggers
    return json
  }

  triggers = []

  type!: LayerType
}
