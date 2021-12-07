import React from 'react'
import { MasherChangeHandler } from "@moviemasher/moviemasher.js"

import { EditorInputs } from '../../declarations'
import { EditorContext } from "../../Contexts/EditorContext"
import { PropertyInspector } from './PropertyInspector'
import { useSelected } from '../../Hooks/useSelected'

interface PropertyInspectorProps {
  property: string
  className?: string
  inputs: EditorInputs
}

const SelectionInspector: React.FunctionComponent<PropertyInspectorProps> = props => {
  const { inputs, className, property, children } = props
  const { masher } = React.useContext(EditorContext)
  const selected = useSelected()

  if (!selected) return null

  const changeHandler: MasherChangeHandler = (property, value) => {
    masher.change(property, value)
  }

  const containerProps = {
    className,
    children,
    instance: selected,
    inputs,
    property,
    changeHandler,
  }

  return <PropertyInspector {...containerProps} />
}

export { SelectionInspector }
