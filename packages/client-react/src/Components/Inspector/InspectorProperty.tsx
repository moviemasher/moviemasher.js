import React from 'react'
import { PropertiedChangeHandler, Property, Scalar } from "@moviemasher/moviemasher.js"

import { PropsAndChildren, ReactResult, WithClassName } from '../../declarations'
import { InputContext } from '../../Contexts/InputContext'
import {
  InspectorPropertyContainer, InspectorPropertyContainerProps
} from './InspectorPropertyContainer'
import { DataTypeInputs } from '../Editor/EditorInputs/DefaultInputs/DataTypeInputs'

interface InspectorPropertyProps extends PropsAndChildren, WithClassName {
  property: Property
  value: Scalar
  changeHandler: PropertiedChangeHandler
}

/**
 * @parents InspectorContent
 */
function InspectorProperty(props: InspectorPropertyProps): ReactResult {
  const { changeHandler, property, value, ...rest } = props

  const { type, name } = property

  // const value = instance.value(name)
  const input = DataTypeInputs[type]

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

export { InspectorProperty, InspectorPropertyProps }
