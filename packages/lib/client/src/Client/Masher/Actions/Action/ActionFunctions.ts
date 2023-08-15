import type { Action, ActionObject, ChangeAction, ChangeActionObject, ChangePropertiesAction, ChangePropertiesActionObject, ChangePropertyAction, ChangePropertyActionObject } from '@moviemasher/runtime-client'

import { isPropertied } from '@moviemasher/lib-shared'
import { isObject, isPopulatedString, isTyped } from '@moviemasher/runtime-shared'

export const isAction = (value: any): value is Action => {
  return isObject(value) && 'redo' in value && 'undo' in value
}

export const isChangeAction = (value: any): value is ChangeAction => (
  isAction(value) 
  && 'updateAction' in value 
  && 'target' in value && isPropertied(value.target)
)

export const isChangePropertyAction = (value: any): value is ChangePropertyAction => (
  isChangeAction(value)
  && 'property' in value && isPopulatedString(value.property)
)

export const isChangePropertiesAction = (value: any): value is ChangePropertiesAction => (
  isChangeAction(value) 
  && 'redoValues' in value && isObject(value.redoValues)
  && 'undoValues' in value && isObject(value.undoValues)
)

export const isActionObject = (value: any): value is ActionObject => {
  return isTyped(value)  
}

export const isChangeActionObject = (value: any): value is ChangeActionObject => (
  isActionObject(value) 
  && 'target' in value && isPropertied(value.target)
)

export const isChangePropertyActionObject = (value: any): value is ChangePropertyActionObject => (
  isChangeActionObject(value) 
  && 'property' in value && isPopulatedString(value.property)
)

export const isChangePropertiesActionObject = (value: any): value is ChangePropertiesActionObject => (
  isChangeActionObject(value) 
  && 'redoValues' in value && isObject(value.redoValues)
  && 'undoValues' in value && isObject(value.undoValues)
)
