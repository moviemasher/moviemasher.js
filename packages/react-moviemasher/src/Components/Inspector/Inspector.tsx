import React from "react"

import { EditorInputs } from "../../declarations"
import { propsStringArray } from "../../Utilities/Props"
import { SelectionInspector } from "./SelectionInspector"
import { useSelected } from "../../Hooks/useSelected"

interface InspectorProps {
  property?: string
  properties?: string | string[]
  className?: string
  inputs: EditorInputs
}

const Inspector: React.FunctionComponent<InspectorProps> = props => {
  const { inputs, className, property, properties, children } = props
  const selected = useSelected()

  if (!selected) return null

  const strings = propsStringArray(property, properties, selected.properties)
  const kids = strings.map(property => {
    const propertyProps = {
      key: `inspector-${property}`, inputs, className, property, children
    }
    return <SelectionInspector {...propertyProps} />
  })
  return <>{kids}</>
}

export { Inspector }
