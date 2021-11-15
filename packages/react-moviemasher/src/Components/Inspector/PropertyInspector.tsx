import React from 'react'
import { MasherChangeHandler } from "@moviemasher/moviemasher.js"

import { EditorInputs } from '../../declarations'
import { EditorContext } from "../Editor/EditorContext"
import { InputContext } from './InputContext'
import { PropertyContainer } from './PropertyContainer'
import { useSelected } from './useSelected'

interface PropertyInspectorProps {
  property: string
  className?: string
  inputs: EditorInputs
}

const PropertyInspector: React.FunctionComponent<PropertyInspectorProps> = props => {
  const { inputs, className, property, children } = props
  const { masher } = React.useContext(EditorContext)
  const selected = useSelected()

  const { definition } = selected
  const definitionProperty = definition.property(property)
  if (!definitionProperty) return null

  const { type, name } = definitionProperty
  const value = selected.value(name)
  const input = inputs[type.id]

  const changeHandler: MasherChangeHandler = (property, value) => {
    masher.change(property, value)
  }
  const inputContext = { property, value, changeHandler }
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
