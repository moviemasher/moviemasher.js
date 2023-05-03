import React from "react"
import { 
  assertSelectorType, ClassButton, DataGroup, DataGroupTiming, isPopulatedObject, selectedPropertyObject 
} from "@moviemasher/lib-core"

import { ElementRecord } from "../../../../Types/Element"
import { InspectorContext } from "../../InspectorContext"
import { DataGroupInputs, DataGroupProps } from "./DataGroupInputs"
import { View } from "../../../../Utilities/View"
import { InspectorProperty, InspectorPropertyProps } from "../../InspectorProperty"
import MasherContext from "../../../Masher/MasherContext"

export interface OptionGroupInputProps extends DataGroupProps {
  dataGroup: DataGroup
}

export function OptionGroupInput(props: OptionGroupInputProps) {
  const masherContext = React.useContext(MasherContext)
  const { icons } = masherContext
  const { selectType, selectedItems: propsItems, dataGroup, ...rest } = props
  assertSelectorType(selectType)

  const inspectorContext = React.useContext(InspectorContext)
  const selectedItems = propsItems || inspectorContext.selectedItems
  const byName = selectedPropertyObject(selectedItems, dataGroup, selectType)
  const elementsByName: ElementRecord = Object.fromEntries(Object.entries(byName).map(([key, selectedProperty]) => {
    const { property, changeHandler, selectType, value, name: nameOveride } = selectedProperty
    const { name: propertyName } = property
    const name = nameOveride || propertyName
    const propertyProps: InspectorPropertyProps = {
      property, value, changeHandler, name,
      ...props
    }
    return [key, <InspectorProperty key={`inspector-${selectType}-group-${name}`} {...propertyProps} />]
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

  const timingProps = { dataGroup: DataGroupTiming, key: `${DataGroupTiming}-group-input` }
  DataGroupInputs[DataGroupTiming] = <OptionGroupInput { ...timingProps } />
// })
