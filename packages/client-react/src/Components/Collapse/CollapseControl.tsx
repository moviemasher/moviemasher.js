import React from "react"
import { CollapseContext } from "./CollapseContext"

import { PropsWithChildren } from "../../Types/Props"
import { View } from "../../Utilities/View"


export function CollapseControl(props: PropsWithChildren) {
  const collapseContext = React.useContext(CollapseContext)
  const { collapsed, changeCollapsed: setCollapsed } = collapseContext
  const viewProps = { 
    ...props, 
    onClick: () => { setCollapsed(!collapsed) },
  }
  return <View {...viewProps} />
}
