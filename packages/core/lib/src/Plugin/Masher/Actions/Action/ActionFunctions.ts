import type { 
  ChangeActionObject, ChangePropertiesActionObject, ChangePropertyActionObject, 
  Action, ActionObject, ChangeAction, ChangePropertiesAction, 
  ChangePropertyAction 
} from './Action.js';

import { 
  isObject, isPopulatedString, isScalar, isScalarRecord 
} from '../../../../Shared/SharedGuards.js'
import { isPropertied } from "../../../../Base/PropertiedFunctions.js";

export const isAction = (value: any): value is Action => {
  return isObject(value) && 'selection' in value && isObject(value.selection)
}

export const isActionObject = (value: any): value is ActionObject => {
  return isObject(value) 
    && 'redoSelection' in value && isObject(value.redoSelection)
    && 'type' in value && isPopulatedString(value.type)
    && 'undoSelection' in value && isObject(value.undoSelection)  
}

export const isChangeAction = (value: any): value is ChangeAction => {
  return isAction(value) 
    && 'target' in value && isPropertied(value.target)
    && 'property' in value && isPopulatedString(value.property)
  
}

export const isChangeActionObject = (value: any): value is ChangeActionObject => {
  return isActionObject(value) 
    && 'target' in value && isPropertied(value.target)
    && 'property' in value && isPopulatedString(value.property)
  
}

export const isChangePropertyAction = (value: any): value is ChangePropertyAction => (
  isChangeAction(value) && 'redoValue' in value && isScalar(value.redoValue)
)

export const isChangePropertiesAction = (value: any): value is ChangePropertiesAction => (
  isChangeAction(value) && 'redoValues' in value && isScalarRecord(value.redoValues)
)

export const isChangePropertyActionObject = (value: any): value is ChangePropertyActionObject => (
  isChangeActionObject(value) && 'redoValue' in value && isScalar(value.redoValue)
)

export const isChangePropertiesActionObject = (value: any): value is ChangePropertiesActionObject => (
  isChangeActionObject(value) && 'redoValues' in value && isScalarRecord(value.redoValues)
)
