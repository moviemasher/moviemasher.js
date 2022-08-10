import React from 'react'
import { assertSelectType, SelectType } from '@moviemasher/moviemasher.js'

import { ReactResult } from '../../declarations'
import { InspectorContext } from './InspectorContext'

export interface InspectorTypeProps {
  type?: string | SelectType
  children: React.ReactNode
}

/**
 * @parents InspectorContent
 */
export function InspectorType(props: InspectorTypeProps): ReactResult {
  const inspectorContext = React.useContext(InspectorContext)
  const { selectedInfo } = inspectorContext
  const { selectedType } = selectedInfo
  const { type, children } = props
  assertSelectType(type)
  if (selectedType !== type) return null

  return <>{children}</>
}
