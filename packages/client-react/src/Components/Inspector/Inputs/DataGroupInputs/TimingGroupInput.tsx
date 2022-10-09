import React from "react"
import { 
  assertSelectType, ClassButton, DataGroup, isPopulatedObject, selectedPropertyObject 
} from "@moviemasher/moviemasher.js"

import { ElementRecord, ReactResult } from "../../../../declarations"
import { InspectorContext } from "../../../Inspector/InspectorContext"
import { DataGroupInputs, DataGroupProps } from "./DataGroupInputs"
import { View } from "../../../../Utilities/View"
import { InspectorProperty, InspectorPropertyProps } from "../../../Inspector/InspectorProperty"
import { MasherContext } from "../../../Masher/MasherContext"


export function TimingGroupInput(props: DataGroupProps): ReactResult {
  const masherContext = React.useContext(MasherContext)
  const { icons } = masherContext
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
      key: 'timing', children: [icons.timing, timing], className: 'row'
    }
    return <View { ...viewProps} />
  }

  const legendElements = [icons.timing]
  if (timing) legendElements.push(timing)
  const elements = Object.entries(rest).map(([key, value]) => {
    const icon = icons[key]
    const children = [value]
    if (icon) children.unshift(<View key={`${key}-icon`} children={icon} className={ClassButton} />)
    const frameProps = { key: `${key}-view`, children }
    return <View { ...frameProps } />
  })

  return <fieldset>
    <legend key="legend"><View>{legendElements}</View></legend>
    {elements}
  </fieldset>
}

DataGroupInputs[DataGroup.Timing] = <TimingGroupInput key="timing-group-input" />
