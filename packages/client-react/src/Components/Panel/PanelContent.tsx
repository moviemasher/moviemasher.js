import React from 'react'

import { PropsAndChildren, ReactResult, WithClassName } from "../../declarations"
import { View } from '../../Utilities/View'

export interface PanelContentProps extends PropsAndChildren, WithClassName { }

export function PanelContent(props: PanelContentProps): ReactResult {
  const { children, className } = props
  if (!children) return null
  const viewProps = { className, children }
  return <View {...viewProps} />
}

export type PanelContentElement = React.FunctionComponentElement<typeof PanelContent>
