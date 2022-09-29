import { SelectType } from "../Setup/Enums"
import { PropertiedChangeHandler } from "../Base/Propertied"
import { DataGroup, Property } from "../Setup/Property"
import { Scalar, ScalarObject } from "../declarations"
import { Effect, Effects } from "../Media/Effect/Effect"
import { isObject } from "./Is"


export interface Selected {
  selectType: SelectType
  name?: string
}

export type EffectAddHandler = (effect: Effect, insertIndex?: number) => void
export type EffectMoveHandler = (effect: Effect, index?: number) => void
export type EffectRemovehandler = (effect: Effect) =>  void


export interface SelectedProperty extends Selected {
  property: Property
  changeHandler: PropertiedChangeHandler
  value: Scalar
}
export const isSelectedProperty = (value: any): value is SelectedProperty => {
  return isObject(value) && "changeHandler" in value
}

export interface SelectedEffects extends Selected {
  value: Effects
  moveHandler: EffectMoveHandler
  removeHandler: EffectRemovehandler
  addHandler: EffectAddHandler
}

export type SelectedItems = Array<SelectedProperty | SelectedEffects>

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
