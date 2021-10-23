import React from "react"
import { UnknownObject } from '@moviemasher/moviemasher.js'
import { View } from "../../Utilities/View"

interface MMBrowserViewProps extends UnknownObject {
  children: React.ReactNode
  className?: string
}

const MMBrowserView: React.FC<MMBrowserViewProps> = props => {
  return <View {...props}/>
}

export { MMBrowserView }
