import React from "react"
import { UnknownObject } from '@moviemasher/moviemasher.js'
import { View } from "../../Utilities/View"

interface MMBrowserSourceProps extends UnknownObject {
  children: React.ReactNode
  className?: string
}

const MMBrowserSource: React.FC<MMBrowserSourceProps> = props => {
  return <View {...props}/>
}

export { MMBrowserSource }
