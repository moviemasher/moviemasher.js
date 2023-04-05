import React from 'react'
import { assertPopulatedArray } from '@moviemasher/lib-core'


import { InspectorContext } from './InspectorContext'
import { propsSelectorTypes } from '../../Utilities/Props'

export interface InspectorPickedProps {
  types?: string | string[]
  type?: string
  children: React.ReactNode
}

/**
 * @parents InspectorContent
 */
export function InspectorPicked(props: InspectorPickedProps) {
  const inspectorContext = React.useContext(InspectorContext)
  const { selectedInfo } = inspectorContext
  const { selectedType } = selectedInfo
  const { type, types, children } = props
  const selectTypes = propsSelectorTypes(type, types)
  assertPopulatedArray(selectTypes)
  
  if (!selectTypes.includes(selectedType)) return null

  return <>{children}</>
}
