import React from 'react'
import { MasherChangeHandler } from "@moviemasher/moviemasher.js"

import { EditorInputs } from '../../declarations'
import { EditorContext } from "../../Contexts/EditorContext"
import { useSelected } from '../../Hooks/useSelected'
import { PropertyInspector } from '../Inspector/PropertyInspector'

interface PropertyInspectorProps {
  property: string
  className?: string
  inputs: EditorInputs
}

const StreamOptions: React.FunctionComponent<PropertyInspectorProps> = props => {
  const { inputs, className, property, children } = props
  const { masher } = React.useContext(EditorContext)
  const selected = useSelected()

  const changeHandler: MasherChangeHandler = (property, value) => {
    masher.change(property, value)
  }

  if (!selected) return null

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

export { StreamOptions }
