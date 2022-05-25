import React from 'react'
import { PanelContext } from '../../Contexts/PanelContext'

import { PropsAndChildren, ReactResult, WithClassName } from "../../declarations"
import { BarOptions } from '../../Utilities/Bar'
import { View } from '../../Utilities/View'

export interface ContentOptions {
  props?: WithClassName
  children?: React.ReactElement<WithClassName>
}

export interface PanelOptionsStrict {
  props: WithClassName
  header: BarOptions
  content: ContentOptions
  footer: BarOptions
}

export type PanelOptions = Partial<PanelOptionsStrict>

export const panelOptionsStrict = (options: PanelOptions): PanelOptionsStrict => {
  options.header ||= {}
  options.header.props ||= {}
  options.header.props.key ||= 'header'
  options.header.props.className ||= 'head'

  options.content ||= {}
  options.content.props ||= {}
  options.content.props.key ||= 'content'
  options.content.props.className ||= 'content'

  options.footer ||= {}
  options.footer.props ||= {}
  options.footer.props.key ||= 'footer'
  options.footer.props.className ||= 'foot'

  options.props ||= {}

  return options as PanelOptionsStrict
}

export interface PanelProps extends PropsAndChildren, WithClassName {
  collapsed?: boolean
}

export function Panel(props: PanelProps): ReactResult {
  const { children, className, collapsed: collapsedProp } = props
  const [collapsed, setCollapsed] = React.useState(!!collapsedProp)

  const classes: string[] = []
  if (className) classes.push(className)
  if (collapsed) classes.push('collapsed')

  const viewProps = { children, className: classes.join(' ') }
  const panelContext = { collapsed, setCollapsed }
  return <PanelContext.Provider value={panelContext}>
    <View {...viewProps} />
  </PanelContext.Provider>
}
