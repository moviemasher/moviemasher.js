import React from 'react'

import { PropsWithoutChild, ReactResult, WithClassName } from "../../declarations"
import { ViewerContext } from '../../Contexts/ViewerContext'
import { View } from '../../Utilities/View'
import { useEditor } from '../../Hooks/useEditor'
import { sizeCopy } from '@moviemasher/moviemasher.js'

export interface BroadcasterContentProps extends PropsWithoutChild, WithClassName {}
export function BroadcasterContent(props: BroadcasterContentProps): ReactResult {
  const viewerContext = React.useContext(ViewerContext)
  const editor = useEditor()
  const { rect } = editor
  const { url, streaming } = viewerContext
  if (!(streaming && url)) return <View {...props} />

  const videoProps = { ...sizeCopy(rect), ...props, autoPlay: true }
  return <video src={url} { ...videoProps } />
}
