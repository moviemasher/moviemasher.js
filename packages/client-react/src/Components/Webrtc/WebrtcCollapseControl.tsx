import React from "react"
import { PropsWithChildren, ReactResult, WithClassName } from "../../declarations"
import { View } from "../../Utilities/View"
import { CollapseContext } from "../Collapse/CollapseContext"

export interface WebrtcCollapseControlProps extends PropsWithChildren, WithClassName {}

export function WebrtcCollapseControl(props: WebrtcCollapseControlProps): ReactResult {
  const [initialized, setInitialized] = React.useState(false)

  const collapseContext = React.useContext(CollapseContext)
  const { collapsed, changeCollapsed: setCollapsed } = collapseContext
  const viewProps = { 
    ...props, 
    onClick: () => { 
      if (initialized) return setCollapsed(!collapsed)
      
      const { mediaDevices } = globalThis.navigator
      const promise = mediaDevices.getUserMedia({ audio: true, video: true })
      promise.then(() => {
        setInitialized(true)
        
      }).finally(() => { setCollapsed(!collapsed) })
    
    },
  }
  return <View {...viewProps} />
}

