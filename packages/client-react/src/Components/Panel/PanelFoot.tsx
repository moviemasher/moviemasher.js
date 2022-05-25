import React from 'react'

import { PropsAndChildren, ReactResult, WithClassName } from "../../declarations"
import { View } from '../../Utilities/View'

export interface PanelFootProps extends PropsAndChildren, WithClassName {}

export function PanelFoot(props: PanelFootProps): ReactResult {
  const { children, className } = props
  if (!children) return null
  const viewProps = { className, children }
  return <View {...viewProps} />
}

export type PanelFootElement = React.FunctionComponentElement<typeof PanelFoot>
