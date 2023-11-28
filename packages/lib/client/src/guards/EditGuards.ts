import type { Edit, EditObject, ChangeEdit, ChangeEditObject, ChangePropertyEdit, ChangePropertyEditObject } from '@moviemasher/runtime-client'
import type { Propertied } from '@moviemasher/runtime-shared'

import { isArray, isObject, isPopulatedString, isTyped } from '@moviemasher/runtime-shared'

const isEdit = (value: any): value is Edit => {
  return isObject(value) && 'redo' in value && 'undo' in value
}

export const isChangeEdit = (value: any): value is ChangeEdit => (
  isEdit(value) 
  && 'updateEdit' in value 
  && 'target' in value && isPropertied(value.target)
)

export const isChangePropertyEdit = (value: any): value is ChangePropertyEdit => (
  isChangeEdit(value)
  && 'property' in value && isPopulatedString(value.property)
)

const isEditObject = (value: any): value is EditObject => {
  return isTyped(value)  
}

export const isChangeEditObject = (value: any): value is ChangeEditObject => (
  isEditObject(value) 
  && 'target' in value && isPropertied(value.target)
)

export const isChangePropertyEditObject = (value: any): value is ChangePropertyEditObject => (
  isChangeEditObject(value) 
  && 'property' in value && isPopulatedString(value.property)
)

const isPropertied = (target: any): target is Propertied => {
  return isObject(target) && 'properties' in target && isArray(target.properties)
}
