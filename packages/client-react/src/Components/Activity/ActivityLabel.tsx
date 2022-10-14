import React from "react"
import { UnknownObject } from "@moviemasher/moviemasher.js"

import { ReactResult, WithClassName } from "../../declarations"
import { ActivityContentContext } from "./ActivityContentContext"
import { activityLabel } from "./ActivityContext"
import { CollapseContext } from "../Collapse/CollapseContext"
import { View } from "../../Utilities/View"

/**
 * @parents ActivityItem
 */
 export function ActivityLabel(props: WithClassName): ReactResult {
  const collapseContext = React.useContext(CollapseContext)
  const { collapsed } = collapseContext
  
  const activityContentContext = React.useContext(ActivityContentContext)
  const { infos } = activityContentContext
  const [firstInfo] = infos
  const labeledInfo = infos.find(info => info.label) || { label: '' }
  const label = labeledInfo.label || firstInfo.type 
  const viewProps: UnknownObject = { ...props }
  if (collapsed) viewProps.children = label
  else {
    const labels = [ label, ...infos.map(info => activityLabel(info))]
    viewProps.children = labels.map((label, i) => <View key={i} children={label} />)
  }
  return <View { ...viewProps } />
 }