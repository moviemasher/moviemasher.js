import React from "react"
import { SelectType, DataGroup, UnknownObject } from "@moviemasher/moviemasher.js"

import { PropsWithoutChild, ReactResult, WithClassName } from "../../declarations"
import { InspectorProperty, InspectorPropertyProps } from "./InspectorProperty"
import { InspectorContext } from "../../Contexts/InspectorContext"
import { InspectorEffects } from "./InspectorEffects"
import { DataGroupInputs } from "../DataGroupInputs/DataGroupInputs"

export interface InspectorPropertiesProps extends PropsWithoutChild, WithClassName {}

/**
 * @parents InspectorContent
 */
export function InspectorProperties(props: InspectorPropertiesProps): ReactResult {
  const inspectorContext = React.useContext(InspectorContext)
  const { selectedProperties } = inspectorContext
  const ungroupedInputs: React.ReactChild[] = []
  const groupedInputs: React.ReactChild[] = []
  const groups: UnknownObject = {} // = new Map<DataGroup, SelectType>()// new Set<DataGroup>()
  const selectTypes = new Set<SelectType>()
  selectedProperties.forEach(selectedProperty => {
    const { property, changeHandler, selectType, value, name: nameOveride } = selectedProperty
    const { name: propertyName, group } = property
    if (group) {
      const key = [group, selectType].join('-')
      if (!groups[key]) {
        groups[key] = true
        groupedInputs.push(React.cloneElement(DataGroupInputs[group], { selectType }))
      }
      return
    } 
    
    const name = nameOveride || propertyName
    selectTypes.add(selectType)
    const propertyProps: InspectorPropertyProps = {
      key: `inspector-${selectType}-${name}`,
      property, value, changeHandler, name,
      ...props
    }
    ungroupedInputs.push(<InspectorProperty {...propertyProps} />)
  })
  if (selectTypes.has(SelectType.Clip)) {
    ungroupedInputs.push(<InspectorEffects key="inspector-effects" />)
  }

  return <>{ungroupedInputs}{groupedInputs}</>
}
