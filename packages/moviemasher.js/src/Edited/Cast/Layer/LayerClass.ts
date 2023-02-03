import { PropertiedClass } from "../../../Base/Propertied"
import { Errors } from "../../../Setup/Errors"
import { DataType, LayerType, SelectType } from "../../../Setup/Enums"
import { propertyInstance } from "../../../Setup/Property"
import { Mashes } from "../../Mash/Mash"
import { Layer, LayerArgs } from "./Layer"
import { Scalar, UnknownObject } from "../../../declarations"
import { idGenerate } from "../../../Utility/Id"
import { Actions } from "../../../Editor/Actions/Actions"
import { SelectedItems } from "../../../Utility/SelectedProperty"
import { assertPopulatedString } from "../../../Utility/Is"
import { Selectables } from "../../../Editor"
import { Cast } from "../Cast"

export class LayerClass extends PropertiedClass implements Layer {
  constructor(args: LayerArgs) {
    super()
    this.properties.push(propertyInstance({ name: 'label', type: DataType.String }))
    this.propertiesInitialize(args)
  }

  _cast?: Cast 
  get cast() { return this._cast! }
  set cast(value: Cast) { this._cast = value }
  
  cache() {}
  
  private _cached = false
  get cached(): boolean {
    // TODO: determine from mashes
    return this._cached
  }
  set cached(value: boolean) { this._cached = value }

  _id?: string
  get id(): string { return this._id ||= idGenerate('layer') }

  get mashes(): Mashes { throw Errors.unimplemented }

  declare label: string

  selectType = SelectType.Layer

  selectables(): Selectables { return [this, ...this.cast.selectables()] }

  selectedItems(actions: Actions): SelectedItems {
    return this.properties.map(property => {
      const undoValue = this.value(property.name)
      const target = this
      return {
        value: undoValue,
        selectType: SelectType.Layer, property, 
        changeHandler: (property: string, redoValue: Scalar) => {
          assertPopulatedString(property)
      
          const options = { property, target, redoValue, undoValue }
          actions.create(options)
        }
      }
    })
  }

  toJSON(): UnknownObject {
    const json = super.toJSON()
    json.type = this.type
    json.triggers = this.triggers
    return json
  }

  triggers = []

  type!: LayerType
}
