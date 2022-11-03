import { SelectType } from "../Setup/Enums"
import { PropertiedChangeHandler } from "../Base/Propertied"
import { DataGroup, Property } from "../Setup/Property"
import { IndexHandler, Scalar, ScalarObject } from "../declarations"
import { isObject } from "./Is"
import { Movable, Movables } from "../Edited/Mash/Mash"

export interface Selected {
  selectType: SelectType
  name?: string
}

export interface SelectedProperty extends Selected {
  property: Property
  changeHandler: PropertiedChangeHandler
  value: Scalar
}
export const isSelectedProperty = (value: any): value is SelectedProperty => {
  return isObject(value) && "changeHandler" in value
}

export interface SelectedMovable extends Selected {
  value: Movables
  moveHandler: IndexHandler<Movable>
  removeHandler: IndexHandler<Movable>
  addHandler: IndexHandler<Movable>
}

export type SelectedItems = Array<SelectedProperty | SelectedMovable>

export type SelectedProperties = Array<SelectedProperty>

export type SelectedPropertyObject = Record<string, SelectedProperty>

export const selectedPropertyObject = (properties: SelectedItems, group: DataGroup, selectType: SelectType): SelectedPropertyObject => {
  const filtered = properties.filter(prop => {
    if (!isSelectedProperty(prop)) return false
    return prop.property.group === group && prop.selectType === selectType
  }) as SelectedProperties
  // console.log("selectedPropertyObject", properties.length, filtered.length, group, selectType)
  
  const byName = Object.fromEntries(filtered.map(selected => {
    const { name: nameOveride, property } = selected
    const { name } = property
    return [nameOveride || name, selected]
  }))
  return byName
} 

export const selectedPropertiesScalarObject = (byName: SelectedPropertyObject): ScalarObject => {
  return Object.fromEntries(Object.entries(byName).map(entry => {
    return [entry[0], entry[1].value]
  }))
}
