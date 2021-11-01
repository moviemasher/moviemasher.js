import React from "react"
import {  UnknownObject } from "@moviemasher/moviemasher.js"

import { View } from "../../Utilities/View"
import { useProperties } from "./useProperties"
import { useSelected } from "./useSelected"

interface SelectionInspectorProps extends UnknownObject {
  className?: string
}

const SelectionInspector: React.FunctionComponent<SelectionInspectorProps> = props => {
  const { className, children, ...rest } = props
  const properties = useProperties()
  const selected = useSelected()


  const entries = properties.map(property => {
    const { name } = property

    const value = selected.value(name)
    return [name, String(value)]
  })
  const viewProps = {
    ...props,
    children: entries.map(([key, value]) => (
      <View key={key}><label>{key}</label>{value}</View>
    ))
  }
  return <View {...viewProps}/>
}

export { SelectionInspector }
