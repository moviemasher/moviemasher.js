import React from 'react'

import { PropsWithoutChild, ReactResult, WithClassName } from "../../declarations"
import { ViewerContext } from '../../Contexts/ViewerContext'
import { View } from '../../Utilities/View'

interface StreamerContentProps extends PropsWithoutChild, WithClassName {}
function StreamerContent(props: StreamerContentProps): ReactResult {
  const viewerContext = React.useContext(ViewerContext)

  const { url, streaming } = viewerContext
  if (!(streaming && url)) return <View {...props} />

  const videoProps = { ...props, autoPlay: true }
  return <video src={url} { ...videoProps } />
}

export { StreamerContent, StreamerContentProps }
