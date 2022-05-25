import React from "react"
import { PanelContext } from "../../Contexts/PanelContext"
import { PropsWithChildren, ReactResult, WithClassName } from "../../declarations"
import { View } from "../../Utilities/View"

export interface PanelCollapseControlProps extends PropsWithChildren, WithClassName {}

export function PanelCollapseControl(props: PanelCollapseControlProps): ReactResult {
  const panelContext = React.useContext(PanelContext)
  const { collapsed, setCollapsed } = panelContext
  const viewProps = { ...props, onClick: () => { setCollapsed(!collapsed) } }
  return <View {...viewProps} />
}
