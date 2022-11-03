import { Scalar } from "../../../declarations";
import { Actions, Selectables } from "../../../Editor";
import { Clicking, Clickings, DataType, SelectType } from "../../../Setup/Enums";
import { DataGroup, propertyInstance } from "../../../Setup/Property";
import { PropertiedClass } from "../../../Base/Propertied";
import { idGenerate } from "../../../Utility/Id";
import { assertPopulatedString } from "../../../Utility/Is";
import { SelectedItems, SelectedProperty } from "../../../Utility/SelectedProperty";
import { Control, ControlObject } from "./Control";

export class ControlClass extends PropertiedClass implements Control {
  constructor(object: ControlObject) {
    super()
    this.properties.push(propertyInstance({ 
      name: 'icon', type: DataType.Icon, defaultValue: 'view'
    }))
    this.properties.push(propertyInstance({ 
      name: 'label', type: DataType.String, defaultValue: ''
    }))
    this.properties.push(propertyInstance({ 
      name: 'clicking', type: DataType.Option, defaultValue: Clicking.Show,
      group: DataGroup.Clicking, options: Clickings,
    }))
    this.properties.push(propertyInstance({ 
      name: 'frame', type: DataType.Frame, defaultValue: 0, min: 0, step: 1,
      group: DataGroup.Clicking
    }))
    this.properties.push(propertyInstance({ 
      name: 'frames', type: DataType.Frame, defaultValue: 0, min: 0, step: 1,
      group: DataGroup.Clicking
    }))
    this.propertiesInitialize(object)
  }

  declare clicking: Clicking

  declare frame: number

  declare frames: number

  declare icon: string
  
  private _id?: string
  get id(): string { return this._id ||= idGenerate('control') }


  declare label: string

  selectType = SelectType.None

  selectables(): Selectables { return [this] }

  selectedItems(actions: Actions): SelectedItems {
    const { clicking, properties } = this
    const filtered = properties.filter(property => {
      const { name } = property
      if (!name.startsWith('frame')) return true

      if (clicking === Clicking.Play) return true

      if (name === 'frames') return false

      return clicking !== Clicking.Hide
    })
    
    const items = filtered.map(property => {
      const { name } = property
      const undoValue = this.value(name)
      const target = this
      const selectedProperty: SelectedProperty = {
        value: undoValue,
        selectType: SelectType.Mash, 
        property, 
        changeHandler: (property: string, redoValue: Scalar) => {
          assertPopulatedString(property)
      
          const options = { property, target, redoValue, undoValue }
          actions.create(options)
        }
      }
      return selectedProperty
    })
    console.log(this.constructor.name, "selectedItems", items)
    return items
  }
}


export const isControl = (value: any): value is Control => {
  return value instanceof ControlClass
}