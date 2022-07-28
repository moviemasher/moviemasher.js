import React from 'react'
import { PropertiedChangeHandler, Property, Scalar } from "@moviemasher/moviemasher.js"

import { PropsWithoutChild, ReactResult, WithClassName } from '../../declarations'
import { InputContext } from '../../Contexts/InputContext'
import {
  InspectorPropertyContainer, InspectorPropertyContainerProps
} from './InspectorPropertyContainer'
import { DataTypeInputs } from '../DataTypeInputs/DataTypeInputs'

export interface InspectorPropertyProps extends PropsWithoutChild, WithClassName {
  property: Property
  value: Scalar
  changeHandler: PropertiedChangeHandler
  name: string
}

/**
 * @parents InspectorContent
 */
export function InspectorProperty(props: InspectorPropertyProps): ReactResult {
  const { changeHandler, property, value, name, ...rest } = props
  const { type } = property
  const input = DataTypeInputs[type] 
  const inputContext = { property, value, changeHandler, name }
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
