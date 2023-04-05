import React from "react"
import { 
  UnknownRecord, isSelectedProperty, SelectedItems, Time,
  assertDataGroup
} from "@moviemasher/lib-core"


import { WithClassName } from "../../Types/Core"
import { PropsWithoutChild } from "../../Types/Props"
import { InspectorProperty, InspectorPropertyProps } from "./InspectorProperty"
import { InspectorContext } from "./InspectorContext"
import { DataGroupInputs } from "./Inputs/DataGroupInputs/DataGroupInputs"
import { View } from "../../Utilities/View"
import MasherContext from "../Masher/MasherContext"

export interface InspectorPropertiesProps extends PropsWithoutChild, WithClassName {
  selectedItems?: SelectedItems
  time?: Time
}

/**
 * @parents InspectorContent
 */
export function InspectorProperties(props: InspectorPropertiesProps) {
  const masherContext = React.useContext(MasherContext)
  const { icons } = masherContext
  const inspectorContext = React.useContext(InspectorContext)
  const { selectedItems: propsItems } = props
  const { selectedItems: inspectorItems } = inspectorContext
  const selectedItems = propsItems || inspectorItems

  const ungroupedInputs: React.ReactChild[] = []
  const groupedInputs: React.ReactChild[] = []
  const groups: UnknownRecord = {} 
  selectedItems.forEach(selectedItem => {
    if (isSelectedProperty(selectedItem)) {
      const { property, changeHandler, selectType, value, name: nameOveride } = selectedItem
      const { name: propertyName, group } = property
      // console.log("InspectorProperties", selectType, nameOveride, propertyName, group)
      if (group) {
        const key = [group, selectType].join('-')
        if (!groups[key]) {
          groups[key] = true
          groupedInputs.push(React.cloneElement(DataGroupInputs[group], { selectType, selectedItems }))
        }
        return
      } 
      
      const name = nameOveride || propertyName

      const propertyProps: InspectorPropertyProps = {
        
        property, value, changeHandler, name, 
        ...props
      }
      const icon = icons[name]
      const inspectorProperty = <InspectorProperty key={`inspector-${selectType}-${name}`} {...propertyProps} />
      if (icon) {
        const viewChildren = [inspectorProperty]
        viewChildren.unshift(icon)
        const viewProps = {
          children: viewChildren,
          className: "row",
          key: `icon-${selectType}-${name}`,
        }

        ungroupedInputs.push(<View { ...viewProps } />)    
      } else ungroupedInputs.push(inspectorProperty)    
      
    } else {
      const { name } = selectedItem
      assertDataGroup(name)

      const groupProps = {
        key: `inspector-${name}`,
        selectedMovable: selectedItem,
      }
      groupedInputs.push(React.cloneElement(DataGroupInputs[name], groupProps))
    }
  })
  return <>{ungroupedInputs}{groupedInputs}</>
}
