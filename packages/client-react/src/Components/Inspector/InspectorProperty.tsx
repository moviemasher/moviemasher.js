import React from 'react'
import { PropertiedChangeHandler, Propertied } from "@moviemasher/moviemasher.js"

import { PropsAndChildren, ReactResult, WithClassName } from '../../declarations'
import { InputContext } from '../../Contexts/InputContext'
import {
  InspectorPropertyContainer, InspectorPropertyContainerProps
} from './InspectorPropertyContainer'
import { DataTypeInputs } from '../Editor/EditorInputs/DefaultInputs/DataTypeInputs'

interface InspectorPropertyProps extends PropsAndChildren, WithClassName {
  property: string
  instance: Propertied
  changeHandler: PropertiedChangeHandler
}

/**
 * @parents InspectorContent
 */
function InspectorProperty(props: InspectorPropertyProps): ReactResult {
  const { changeHandler, property: propertyName, instance, ...rest } = props
  const property = instance.property(propertyName)
  if (!property) return null

  const { type, name } = property

  const { id } = type
  const value = instance.value(name)
  const input = DataTypeInputs[id]

  const inputContext = { property, value, changeHandler }

  const inputWithContext = (
    <InputContext.Provider key='context' value={inputContext}>
      {input}
    </InputContext.Provider>
  )

  const containerProps: InspectorPropertyContainerProps = {
    property: propertyName,
    type: type.id,
    contained: inputWithContext,
    ...rest
  }
  return <InspectorPropertyContainer {...containerProps} />
}

export { InspectorProperty, InspectorPropertyProps }
