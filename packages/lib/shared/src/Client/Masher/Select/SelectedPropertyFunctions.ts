import type { SelectedProperty, SelectedPropertyRecord, SelectedProperties } from '@moviemasher/runtime-client'
import type { DataGroup, Scalar, ScalarRecord, SelectorType } from '@moviemasher/runtime-shared'

import { isDefined, isObject, isUndefined } from '@moviemasher/runtime-shared'

export const isSelectedProperty = (value: any): value is SelectedProperty => {
  return isObject(value) && 'changeHandler' in value
}

// export const selectedPropertyObject = (properties: SelectedProperties, group: DataGroup, selectorType: SelectorType): SelectedPropertyRecord => {
//   const filtered = properties.filter(prop => {
//     if (!isSelectedProperty(prop))
//       return false
//     return prop.property.targetId === group && prop.selectorType === selectorType
//   }) as SelectedProperties
//   const byName = Object.fromEntries(filtered.map(selected => {
//     const { property } = selected
//     const { name } = property
//     return [name, selected]
//   }))
//   return byName
// }

export const selectedPropertiesScalarObject = (byName: SelectedPropertyRecord): ScalarRecord => {
  return Object.fromEntries(Object.entries(byName).flatMap(entry => {
    const [name, selected] = entry
    const { value } = selected
    if (isDefined<Scalar>(value)) return [[name, value]]

    return []
  }))
}
