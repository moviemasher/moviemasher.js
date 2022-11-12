import React from 'react'

import { PropsWithoutChild, ReactResult, WithClassName } from '../../declarations'
import { CollapseContext } from '../Collapse/CollapseContext'
import { WebrtcContext } from './WebrtcContext'
import { WebrtcDevices } from './WebrtcDevices'
import { WebrtcPreview } from './WebrtcPreview'

export interface WebrtcContentProps extends PropsWithoutChild, WithClassName {}

export function WebrtcContent(props: WebrtcContentProps): ReactResult {
  const webrtcContext = React.useContext(WebrtcContext)
  const collapseContext = React.useContext(CollapseContext)
  const { collapsed } = collapseContext
  if (collapsed) return null

  const { picked } = webrtcContext
  if (picked ==='preview') return <WebrtcPreview { ...props } />
  
  return <WebrtcDevices { ...props } />
}
