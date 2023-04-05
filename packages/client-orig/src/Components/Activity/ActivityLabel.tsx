import React from "react"
import { UnknownRecord } from "@moviemasher/lib-core"

import { WithClassName } from "../../Types/Core"
import { ActivityContentContext } from "./ActivityContentContext"
import { CollapseContext } from "../Collapse/CollapseContext"
import { View } from "../../Utilities/View"
import Text from "../Text/Text.lite"

/**
 * @parents ActivityItem
 */
 export function ActivityLabel(props: WithClassName) {
  const collapseContext = React.useContext(CollapseContext)
  const { collapsed } = collapseContext
  
  const activityContentContext = React.useContext(ActivityContentContext)
  const { infos } = activityContentContext
  const [firstInfo] = infos
  const labeledInfo = infos.find(info => info.label) || { label: '' }
  const label = labeledInfo.label || firstInfo.type 
  const viewProps: UnknownRecord = { ...props }
  if (collapsed) viewProps.children = label
  else {
    // const activityLabels = [ label, ...infos.map(info => activityLabel(info))]
    viewProps.children = infos.map(info => {
      const { label = '', id } = info
      return <Text key={id} label={label} />
      
    })
  }
  return <View { ...viewProps } />
 }