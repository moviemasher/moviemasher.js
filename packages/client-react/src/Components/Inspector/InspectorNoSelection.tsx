import React from 'react'

import { InspectorContext } from '../../Contexts/InspectorContext'
import { PropsWithChildren, ReactResult } from '../../declarations'

/**
 * @parents InspectorContent
 */
export function InspectorNoSelection(props: PropsWithChildren): ReactResult {
  const inspectorContext = React.useContext(InspectorContext)
  const { track } = inspectorContext

  if (track) return null

  const { children } = props
  return <>{children}</>
}
