import { PropertiedClass } from "../../../Base/Propertied"
import { Errors } from "../../../Setup/Errors"
import { ActionType, DataType, LayerType, SelectType } from "../../../Setup/Enums"
import { propertyInstance } from "../../../Setup/Property"
import { Mashes } from "../../Mash/Mash"
import { Layer, LayerArgs } from "./Layer"
import { Scalar, UnknownObject } from "../../../declarations"
import { idGenerate } from "../../../Utility/Id"
import { Actions } from "../../../Editor/Actions/Actions"
import { SelectedItems } from "../../../Utility/SelectedProperty"
import { assertPopulatedString, isUndefined } from "../../../Utility/Is"
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
  
  _id?: string
  get id(): string { return this._id ||= idGenerate() }

  get mashes(): Mashes { throw Errors.unimplemented + 'mashes'}

  declare label: string

  selectType = SelectType.Layer

  selectables(): Selectables { return [this, ...this.cast.selectables()] }

  selectedItems(actions: Actions): SelectedItems {
    return this.properties.map(property => ({
      selectType: SelectType.Layer, property, 
      changeHandler: (property: string, value: Scalar) => {
        assertPopulatedString(property, 'changeLayer property')
    
        const redoValue = isUndefined(value) ? this.value(property) : value
        const undoValue = this.value(property)
        const options: UnknownObject = {
          property, target: this, redoValue, undoValue, type: ActionType.Change
        }
        actions.create(options)
      },
      value: this.value(property.name)
    }))
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
