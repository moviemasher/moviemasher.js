import React from 'react'
import { Instance, MasherChangeHandler } from "@moviemasher/moviemasher.js"

import { EditorInputs } from '../../declarations'
import { InputContext } from '../../Contexts/InputContext'
import { PropertyContainer } from './PropertyContainer'

interface PropertyInspectorProps {
  property: string
  instance: Instance
  className?: string
  inputs: EditorInputs
  changeHandler: MasherChangeHandler
}

const PropertyInspector: React.FunctionComponent<PropertyInspectorProps> = props => {
  const {
    changeHandler, inputs, className, property: propertyId, instance, children
  } = props

  const property = instance.property(propertyId)
  if (!property) return null

  const { type, name } = property
  const { id } = type
  const value = instance.value(name)
  const input = inputs[id]

  const inputContext = { property: propertyId, value, changeHandler }

  const inputWithContext = (
    <InputContext.Provider key='context' value={inputContext}>
      {input}
    </InputContext.Provider>
  )

  const containerProps = {
    className,
    children,
    property: name,
    contained: inputWithContext,
  }
  return <PropertyContainer {...containerProps} />
}

export { PropertyInspector }
