import React from "react"

import { propsStringArray } from "../../Utilities/Props"
import { SelectionInformer } from "./SelectionInformer"
import { useSelected } from "../../Hooks/useSelected"

interface InformerProps {
  property?: string
  properties?: string | string[]
  className?: string
}

const Informer: React.FunctionComponent<InformerProps> = props => {
  const { className, property, properties, children } = props
  const selected = useSelected()
  const strings = propsStringArray(property, properties, selected.definition.properties)
  const kids = strings.map(property => {
    const propertyProps = { key: `inspector-${property}`, className, property, children }
    return <SelectionInformer {...propertyProps} />
  })
  return <>{kids}</>
}

export { Informer }
