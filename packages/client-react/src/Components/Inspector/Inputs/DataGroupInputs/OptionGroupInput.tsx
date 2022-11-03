import React from "react"
import { 
  assertSelectType, ClassButton, DataGroup, isPopulatedObject, selectedPropertyObject 
} from "@moviemasher/moviemasher.js"

import { ElementRecord, ReactResult } from "../../../../declarations"
import { InspectorContext } from "../../InspectorContext"
import { DataGroupInputs, DataGroupProps } from "./DataGroupInputs"
import { View } from "../../../../Utilities/View"
import { InspectorProperty, InspectorPropertyProps } from "../../InspectorProperty"
import { MasherContext } from "../../../Masher/MasherContext"

export interface OptionGroupInputProps extends DataGroupProps {
  dataGroup: DataGroup
}

export function OptionGroupInput(props: OptionGroupInputProps): ReactResult {
  const masherContext = React.useContext(MasherContext)
  const { icons } = masherContext
  const { selectType, selectedItems: propsItems, dataGroup, ...rest } = props
  assertSelectType(selectType)

  const inspectorContext = React.useContext(InspectorContext)
  const selectedItems = propsItems || inspectorContext.selectedItems
  const byName = selectedPropertyObject(selectedItems, dataGroup, selectType)
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

  const { [dataGroup]: input, ...otherElements } = elementsByName
  const iconElement = icons[dataGroup]
  if (!isPopulatedObject(otherElements)) {
    const viewProps = {
      key: dataGroup, children: [iconElement, input], className: 'row'
    }
    return <View { ...viewProps} />
  }

  const legendElements = [iconElement]
  if (input) legendElements.push(input)
  const elements = Object.entries(otherElements).map(([key, value]) => {
    const icon = icons[key]
    const children = [value]
    if (icon) children.unshift(<View key={`${key}-icon`} children={icon} className={ClassButton} />)
    const frameProps = { key: `${key}-view`, children }
    return <View { ...frameProps } />
  })


  const fieldsetProps = { ...rest }
  return <fieldset { ...fieldsetProps }>
    <legend key="legend"><View>{legendElements}</View></legend>
    {elements}
  </fieldset>
}

[DataGroup.Timing, DataGroup.Clicking].forEach(dataGroup => {
  const props = { dataGroup, key: `${dataGroup}-group-input` }
  DataGroupInputs[dataGroup] = <OptionGroupInput { ...props } />
})
