import React from "react"

import { EditorInputs } from "../../declarations"
import { propsStringArray } from "../../Utilities/Props"
import { PropertyInspector } from "./PropertyInspector"
import { useSelected } from "./useSelected"

interface InspectorProps {
  property?: string
  properties?: string | string[]
  className?: string
  inputs: EditorInputs
}

const Inspector: React.FunctionComponent<InspectorProps> = props => {
  const { inputs, className, property, properties, children } = props
  const selected = useSelected()
  const strings = propsStringArray(property, properties, selected.definition.properties)
  const kids = strings.map(property => {
    const propertyProps = {
      key: `inspector-${property}`, inputs, className, property, children
    }
    return <PropertyInspector {...propertyProps} />
  })
  return <>{kids}</>
}

export { Inspector }
