import /* type */ { SelectorType } from "../../Setup/Enums"
import /* type */ { PropertiedChangeHandler } from "../../Base/Propertied"
import /* type */ { DataGroup, Property } from "../../Setup/Property"
import /* type */ { Scalar, ScalarRecord } from "../../Types/Core"
import /* type */ { IndexHandler } from "./Select"
import /* type */ { Movable, Movables } from "../../Media/Mash/Mash"

import { isObject } from "../../Utility/Is"

export interface Selected {
  selectType: SelectorType
  name?: string
}

export interface SelectedProperty extends Selected {
  property: Property
  changeHandler: PropertiedChangeHandler
  value: Scalar
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




export const isSelectedProperty = (value: any): value is SelectedProperty => {
  return isObject(value) && "changeHandler" in value
}


export const selectedPropertyObject = (properties: SelectedItems, group: DataGroup, selectType: SelectorType): SelectedPropertyObject => {
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

export const selectedPropertiesScalarObject = (byName: SelectedPropertyObject): ScalarRecord => {
  return Object.fromEntries(Object.entries(byName).map(entry => {
    return [entry[0], entry[1].value]
  }))
}
