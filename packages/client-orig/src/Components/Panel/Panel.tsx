import React from 'react'

import { ElementRecord, JsxChildren } from "../../Types/Element"
import type { BarOptions } from '../../Utilities/Bar'
import type { CollapseContextInterface } from '../Collapse/CollapseContext'
import type { PropsWithChildren } from "../../Types/Props"
import type { WithClassName } from "../../Types/Core"

import { assertPopulatedObject } from '@moviemasher/lib-core'

import { CollapseContext } from '../Collapse/CollapseContext'
import { View } from '../../Utilities/View'

export interface ContentOptions {
  props?: WithClassName
  children?: JsxChildren
}

export interface PanelOptionsStrict {
  icons: ElementRecord
  props: WithClassName
  header: BarOptions
  content: ContentOptions
  footer: BarOptions
}

export type PanelOptions = Partial<PanelOptionsStrict>

export const panelOptionsStrict = (options: PanelOptions): PanelOptionsStrict => {
  options.header ||= {}
  options.header.props ||= {}
  options.header.props.className ||= 'head'

  options.content ||= {}
  options.content.props ||= {}
  options.content.props.className ||= 'content'

  options.footer ||= {}
  options.footer.props ||= {}
  options.footer.props.className ||= 'foot'

  options.props ||= {}

  assertPopulatedObject(options.icons)

  return options as PanelOptionsStrict
}

export interface PanelProps extends PropsWithChildren {
  collapsed?: boolean
}

export function Panel(props: PanelProps) {
  const { children, className, collapsed: collapsedProp } = props
  const [collapsed, changeCollapsed] = React.useState(!!collapsedProp)

  const classes: string[] = []
  if (className) classes.push(className)
  if (collapsed) classes.push('collapsed')

  const viewProps = { children, className: classes.join(' ') }
  const collapseContext: CollapseContextInterface = { collapsed, changeCollapsed }
  return <CollapseContext.Provider value={collapseContext}>
    <View {...viewProps} />
  </CollapseContext.Provider>
}
