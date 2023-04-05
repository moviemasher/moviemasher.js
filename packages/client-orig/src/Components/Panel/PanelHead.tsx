import React from 'react'


import { PropsWithChildren } from '../../Types/Props'
import { View } from '../../Utilities/View'

export interface PanelHeadProps extends PropsWithChildren { }

export function PanelHead(props: PanelHeadProps) {
  const { children, className } = props
  if (!children) return null

  const viewProps = { className, children }
  return <View {...viewProps} />
}

