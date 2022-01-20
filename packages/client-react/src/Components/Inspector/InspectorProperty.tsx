import React from 'react'
import { PropertiedChangeHandler, Propertied } from "@moviemasher/moviemasher.js"

import { PropsAndChildren, ReactResult, WithClassName } from '../../declarations'
import { InputContext } from '../../Contexts/InputContext'
import { InspectorPropertyContainer, InspectorPropertyContainerProps } from './InspectorPropertyContainer'
import { EditorContext } from '../../Contexts/EditorContext'

interface InspectorPropertyProps extends PropsAndChildren, WithClassName {
  property: string
  instance: Propertied
  changeHandler: PropertiedChangeHandler
}

/**
 * @parents InspectorContent
 */
function InspectorProperty(props: InspectorPropertyProps): ReactResult {
  const { changeHandler, property, instance, ...rest } = props
  const editorContext = React.useContext(EditorContext)
  const { inputs } = editorContext
  const propertyInstance = instance.property(property)
  if (!(propertyInstance && inputs)) {
    console.error("InspectorProperty", !!inputs, !!propertyInstance)
    return null
  }

  const { type, name } = propertyInstance
  const { id } = type
  const value = instance.value(name)
  const input = inputs[id]

  const inputContext = { property: property, value, changeHandler }

  const inputWithContext = (
    <InputContext.Provider key='context' value={inputContext}>
      {input}
    </InputContext.Provider>
  )

  const containerProps: InspectorPropertyContainerProps = {
    property,
    type: type.id,
    contained: inputWithContext,
    ...rest
  }
  return <InspectorPropertyContainer {...containerProps} />
}

export { InspectorProperty, InspectorPropertyProps }
