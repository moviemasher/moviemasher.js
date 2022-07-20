import React from 'react'
import { isDataType, PropertiedChangeHandler, Property, Scalar } from "@moviemasher/moviemasher.js"

import { PropsAndChildren, PropsWithoutChild, ReactResult, WithClassName } from '../../declarations'
import { InputContext } from '../../Contexts/InputContext'
import {
  InspectorPropertyContainer, InspectorPropertyContainerProps
} from './InspectorPropertyContainer'
import { DataTypeInputs, DefinitionTypeInputs } from '../EditorInputs/EditorInputs'

export interface InspectorPropertyProps extends PropsWithoutChild, WithClassName {
  property: Property
  value: Scalar
  changeHandler: PropertiedChangeHandler
}

/**
 * @parents InspectorContent
 */
export function InspectorProperty(props: InspectorPropertyProps): ReactResult {
  const { changeHandler, property, value, ...rest } = props

  const { type, name, tweenable } = property

  const input = isDataType(type) ? DataTypeInputs[type] : DefinitionTypeInputs[type]

  const inputContext = { property, value, changeHandler }

  const inputWithContext = (
    <InputContext.Provider key='context' value={inputContext}>
      {input}
    </InputContext.Provider>
  )

  const containerProps: InspectorPropertyContainerProps = {
    property: name,
    type,
    contained: inputWithContext,
    ...rest
  }
  return <InspectorPropertyContainer {...containerProps} />
}
