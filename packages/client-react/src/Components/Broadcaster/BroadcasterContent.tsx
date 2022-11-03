import React from 'react'
import { assertPopulatedString, sizeAboveZero } from '@moviemasher/moviemasher.js'

import { PropsWithoutChild, ReactResult, WithClassName } from "../../declarations"
import { View } from '../../Utilities/View'
import { useEditor } from '../../Hooks/useEditor'
import { CollapseContext } from '../Collapse/CollapseContext'
import { MasherContext } from '../Masher/MasherContext'

export interface BroadcasterContentProps extends PropsWithoutChild, WithClassName {}
export function BroadcasterContent(props: BroadcasterContentProps): ReactResult {

  const masherContext = React.useContext(MasherContext)
  const collapseContext = React.useContext(CollapseContext)
  const editor = useEditor()
  const { collapsed } = collapseContext
  const { rect } = editor
  const { current, streaming } = masherContext
  const { streamUrl } = current
  if (collapsed || !sizeAboveZero(rect) || !(streaming && streamUrl)) {
    return <View {...props} />
  }
  assertPopulatedString(streamUrl)

  const videoProps = { ...props, autoPlay: true }
  return <video src={streamUrl} { ...videoProps } />
}
