import React from "react"
import { 
  assertSelectType, DataGroup, isPopulatedObject, selectedPropertyObject 
} from "@moviemasher/moviemasher.js"

import { ElementRecord, ReactResult } from "../../../../declarations"
import { InspectorContext } from "../../../Inspector/InspectorContext"
import { DataGroupInputs, DataGroupProps } from "./DataGroupInputs"
import { View } from "../../../../Utilities/View"
import { InspectorProperty, InspectorPropertyProps } from "../../../Inspector/InspectorProperty"
import { DefaultIcons } from "@moviemasher/icons-default"


export function TimingGroupInput(props: DataGroupProps): ReactResult {
  const { selectType } = props
  assertSelectType(selectType)

  const inspectorContext = React.useContext(InspectorContext)
  const { selectedItems: properties } = inspectorContext
  const byName = selectedPropertyObject(properties, DataGroup.Timing, selectType)

  const elementsByName: ElementRecord = Object.fromEntries(Object.entries(byName).map(([key, selectedProperty]) => {
    const { property, changeHandler, selectType, value, name: nameOveride } = selectedProperty
    const { name: propertyName } = property
    const name = nameOveride || propertyName
    const propertyProps: InspectorPropertyProps = {
      key: `inspector-${selectType}-group-${name}`,
      property, value, changeHandler, name,
      ...props
    }
    return [key, <InspectorProperty {...propertyProps} />]
  }))

  const { timing, ...rest } = elementsByName
  if (!isPopulatedObject(rest)) {
    const viewProps = {
      children: [DefaultIcons.timing, timing], className: 'row'
    }
    return <View { ...viewProps} />
  }

  const legendElements = [DefaultIcons.timing]
  if (timing) legendElements.push(timing)
  const elements = Object.entries(rest).map(([key, value]) => {
    const icon = DefaultIcons[key]
    const children = [value]
    if (icon) children.unshift(icon)
    const frameProps = { className: "timing", children }
    return <View { ...frameProps } />
  })

  return <fieldset><legend><View>{legendElements}</View></legend>{elements}</fieldset>
}

DataGroupInputs[DataGroup.Timing] = <TimingGroupInput key="timing-group-input" />
