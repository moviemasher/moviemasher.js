import React from "react"
import { UnknownObject } from '@moviemasher/moviemasher.js'
import { View } from "../../Utilities/View"

interface BrowserProps extends UnknownObject { children: React.ReactNode }


const MMBrowser: React.FunctionComponent<BrowserProps> = props => {
  const { children, ...rest } = props


  return <View {...rest}>
    {children}
  </View>
}

export { MMBrowser }
