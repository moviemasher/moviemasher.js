import React from 'react'

import { propsSelectTypes } from '../../Utilities/Props'
import { InspectorContext } from '../../Contexts/InspectorContext'
import { ReactResult } from '../../declarations'

export interface InspectorTypeProps {
  type?: string
  types?: string | string[]
  children: React.ReactNode
}

/**
 * @parents InspectorContent
 */
export function InspectorType(props: InspectorTypeProps): ReactResult {
  const inspectorContext = React.useContext(InspectorContext)
  const { selectedTypes } = inspectorContext
  if (!selectedTypes.length) return null

  const { type, types, children } = props
  const propTypes = propsSelectTypes(type, types)
  if (!propTypes.some(type => selectedTypes.includes(type))) return null

  return <>{children}</>
}
