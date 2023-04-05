import { SelectorType } from '../../Setup/Enums.js'
import { DataGroup } from '../../Setup/Property.js'
import { ScalarRecord } from '../../Types/Core.js'
import { isObject } from '../../Utility/Is.js'
import {SelectedProperty, SelectedItems, SelectedPropertyObject, SelectedProperties} from './SelectedProperty.js'





export const isSelectedProperty = (value: any): value is SelectedProperty => {
  return isObject(value) && 'changeHandler' in value
}


export const selectedPropertyObject = (properties: SelectedItems, group: DataGroup, selectType: SelectorType): SelectedPropertyObject => {
  const filtered = properties.filter(prop => {
    if (!isSelectedProperty(prop))
      return false
    return prop.property.group === group && prop.selectType === selectType
  }) as SelectedProperties
  // console.log('selectedPropertyObject', properties.length, filtered.length, group, selectType)
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
