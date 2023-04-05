import React from 'react'


import { PropsWithChildren } from '../../Types/Props'
import { View } from '../../Utilities/View'

export interface PanelContentProps extends PropsWithChildren { }

export function PanelContent(props: PanelContentProps) {
  const { children, className } = props
  if (!children) return null
  
  const viewProps = { className, children }
  return <View {...viewProps} />
}

