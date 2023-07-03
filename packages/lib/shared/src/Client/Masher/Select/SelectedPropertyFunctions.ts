import type { SelectedProperty, SelectedPropertyObject, SelectedProperties, SelectorType } from '@moviemasher/runtime-client'
import type { DataGroup, ScalarRecord } from '@moviemasher/runtime-shared'

import { isObject } from '@moviemasher/runtime-shared'

export const isSelectedProperty = (value: any): value is SelectedProperty => {
  return isObject(value) && 'changeHandler' in value
}

export const selectedPropertyObject = (properties: SelectedProperties, group: DataGroup, selectType: SelectorType): SelectedPropertyObject => {
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
