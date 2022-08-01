import React from "react"
import { SelectType, UnknownObject, isSelectedProperty, SelectedItems } from "@moviemasher/moviemasher.js"

import { PropsWithoutChild, ReactResult, WithClassName } from "../../declarations"
import { InspectorProperty, InspectorPropertyProps } from "./InspectorProperty"
import { InspectorContext } from "../../Contexts/InspectorContext"
import { DataGroupInputs } from "../DataGroupInputs/DataGroupInputs"

export interface InspectorPropertiesProps extends PropsWithoutChild, WithClassName {
  selectedItems?: SelectedItems
}

/**
 * @parents InspectorContent
 */
export function InspectorProperties(props: InspectorPropertiesProps): ReactResult {
  const inspectorContext = React.useContext(InspectorContext)
  const { selectedItems: propsItems } = props
  const { selectedItems: inspectorItems } = inspectorContext
  const selectedItems = propsItems || inspectorItems

  const ungroupedInputs: React.ReactChild[] = []
  const groupedInputs: React.ReactChild[] = []
  const groups: UnknownObject = {} 
  const selectTypes = new Set<SelectType>()
  selectedItems.forEach(selectedProperty => {
    if (isSelectedProperty(selectedProperty)) {
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
    } else {
      const effectsProps = {
        key: "inspector-effects",
        selectedEffects: selectedProperty,
      }
      groupedInputs.push(React.cloneElement(DataGroupInputs.effects, effectsProps))
    }
  })
  if (selectTypes.has(SelectType.Clip)) {
    ungroupedInputs.push()
  }

  return <>{ungroupedInputs}{groupedInputs}</>
}
