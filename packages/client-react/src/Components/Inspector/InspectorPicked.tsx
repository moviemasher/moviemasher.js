import React from 'react'
import { assertPopulatedArray } from '@moviemasher/moviemasher.js'

import { ReactResult } from '../../declarations'
import { InspectorContext } from './InspectorContext'
import { propsSelectTypes } from '../../Utilities/Props'

export interface InspectorPickedProps {
  types?: string | string[]
  type?: string
  children: React.ReactNode
}

/**
 * @parents InspectorContent
 */
export function InspectorPicked(props: InspectorPickedProps): ReactResult {
  const inspectorContext = React.useContext(InspectorContext)
  const { selectedInfo } = inspectorContext
  const { selectedType } = selectedInfo
  const { type, types, children } = props
  const selectTypes = propsSelectTypes(type, types)
  assertPopulatedArray(selectTypes)
  
  if (!selectTypes.includes(selectedType)) return null

  return <>{children}</>
}
