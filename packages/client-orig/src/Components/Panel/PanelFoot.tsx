import React from 'react'
import { CollapseContext } from '../Collapse/CollapseContext'

import { JsxChildren, JsxChilds } from "../../Types/Element"
import { PropsWithChildren } from "../../Types/Props"
import { BarProps } from '../../Utilities/Bar'
import { View } from '../../Utilities/View'
import { isArray } from '@moviemasher/moviemasher.js'

export interface PanelFootProps extends PropsWithChildren {}

export function PanelFoot(props: BarProps) {
  const panelContext = React.useContext(CollapseContext)
  const { collapsed } = panelContext
  if (collapsed) return null

  const { before, content, after, props: viewProps = {} } = props

  if (!(before || content || after)) return null

  const children: JsxChildren = []
  if (before) children.push(...before)
  if (content) {
    if (isArray(content)) children.push(...content)
    else children.push(content)
  }
  if (after) children.push(...after)

  viewProps.children = children
  return <View {...viewProps}/>
}

