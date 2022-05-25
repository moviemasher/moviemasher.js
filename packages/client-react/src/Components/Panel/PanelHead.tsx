import React from 'react'

import { PropsAndChildren, ReactResult, WithClassName } from "../../declarations"
import { View } from '../../Utilities/View'

export interface PanelHeadProps extends PropsAndChildren, WithClassName { }

export function PanelHead(props: PanelHeadProps): ReactResult {
  const { children, className } = props
  if (!children) return null
  const viewProps = { className, children }
  return <View {...viewProps} />
}

export type PanelHeadElement = React.FunctionComponentElement<typeof PanelHead>
