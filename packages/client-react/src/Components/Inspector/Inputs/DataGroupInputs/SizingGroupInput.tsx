import React from "react"
import { 
  assertSelectType, DataGroup, selectedPropertyObject 
} from "@moviemasher/moviemasher.js"

import { ElementRecord, ReactResult } from "../../../../declarations"
import { InspectorContext } from "../../InspectorContext"
import { DataGroupInputs, DataGroupProps } from "./DataGroupInputs"
import { View } from "../../../../Utilities/View"
import { InspectorProperty, InspectorPropertyProps } from "../../InspectorProperty"


export function SizingGroupInput(props: DataGroupProps): ReactResult {
  const { selectType } = props
  assertSelectType(selectType)

  const inspectorContext = React.useContext(InspectorContext)
  const { selectedItems: properties } = inspectorContext
  const byName = selectedPropertyObject(properties, DataGroup.Sizing, selectType)

  const elementsByName: ElementRecord = Object.fromEntries(Object.entries(byName).map(([key, selectedProperty]) => {
    const { 
      property, changeHandler, selectType, value, name: nameOveride 
    } = selectedProperty
    const { name: propertyName } = property
    const name = nameOveride || propertyName
    const propertyProps: InspectorPropertyProps = {
      key: `inspector-${selectType}-group-${name}`,
      property, value, changeHandler, name,
      ...props
    }
    return [key, <InspectorProperty {...propertyProps} />]
  }))

  return <View>{Object.values(elementsByName)}</View>
}

DataGroupInputs[DataGroup.Sizing] = <SizingGroupInput key="sizing-group-input" />
