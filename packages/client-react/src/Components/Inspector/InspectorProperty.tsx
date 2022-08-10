import React from 'react'
import { isDefined, PropertiedChangeHandler, Property, Scalar, Time } from "@moviemasher/moviemasher.js"

import { PropsWithoutChild, ReactResult, WithClassName } from '../../declarations'
import { InputContext } from './Inputs/InputContext'
import {
  InspectorPropertyContainer, InspectorPropertyContainerProps
} from './InspectorPropertyContainer'
import { DataTypeInputs } from './Inputs/DataTypeInputs/DataTypeInputs'

export interface InspectorPropertyProps extends PropsWithoutChild, WithClassName {
  property: Property
  value: Scalar
  defaultValue?: Scalar
  changeHandler: PropertiedChangeHandler
  name: string
  time?: Time
}

/**
 * @parents InspectorContent
 */
export function InspectorProperty(props: InspectorPropertyProps): ReactResult {
  const { 
    defaultValue: propsDefault, changeHandler, time, property, value, name, 
    ...rest 
  } = props
  const { type, defaultValue: propertyDefault } = property
  const defaultValue = isDefined(propsDefault) ? propsDefault : propertyDefault
  const input = DataTypeInputs[type] 
  const inputContext = { 
    property, value, changeHandler, name, time, defaultValue
  }
  const inputWithContext = (
    <InputContext.Provider key='context' value={inputContext}>
      {input}
    </InputContext.Provider>
  )
  const containerProps: InspectorPropertyContainerProps = {
    type, property: name, contained: inputWithContext,
    ...rest
  }
  return <InspectorPropertyContainer {...containerProps} />
}
