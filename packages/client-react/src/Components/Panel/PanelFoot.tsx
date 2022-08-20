import React from 'react'
import { CollapseContext } from '../Collapse/CollapseContext'

import { PropsAndChildren, ReactResult, WithClassName } from "../../declarations"
import { BarProps } from '../../Utilities/Bar'
import { View } from '../../Utilities/View'

export interface PanelFootProps extends PropsAndChildren, WithClassName {}

export function PanelFoot(props: BarProps): ReactResult {
  const panelContext = React.useContext(CollapseContext)
  const { collapsed } = panelContext
  if (collapsed) return null

  const { before, content, after, props: viewProps = {} } = props

  if (!(before || content || after)) return null

  const children = [before, content, after].filter(Boolean)

  viewProps.children = children
  return <View {...viewProps}/>
}

