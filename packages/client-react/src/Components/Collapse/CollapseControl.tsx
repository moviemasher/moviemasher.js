import React from "react"
import { CollapseContext } from "./CollapseContext"
import { PropsWithChildren, ReactResult, WithClassName } from "../../declarations"
import { View } from "../../Utilities/View"

export interface CollapseControlProps extends PropsWithChildren, WithClassName {}

export function CollapseControl(props: CollapseControlProps): ReactResult {
  const collapseContext = React.useContext(CollapseContext)
  const { collapsed, changeCollapsed: setCollapsed } = collapseContext
  const viewProps = { 
    ...props, 
    onClick: () => { setCollapsed(!collapsed) },
  }
  return <View {...viewProps} />
}
