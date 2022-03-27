import React from 'react'

import { propsDefinitionTypes } from '../../Utilities/Props'
import { InspectorContext } from '../../Contexts/InspectorContext'
import { ReactResult } from '../../declarations'

interface InspectorNotTypeProps {
  type?: string
  types?: string | string[]
  children: React.ReactNode
}

/**
 * @parents InspectorContent
 */
function InspectorNotType(props: InspectorNotTypeProps): ReactResult {
  const inspectorContext = React.useContext(InspectorContext)

  const { definitionType } = inspectorContext
  if (!definitionType) return null

  const { type, types, children } = props
  if (!children) return null

  const definitionTypes = propsDefinitionTypes(type, types)
  if (definitionTypes.includes(definitionType)) return null

  return <>{children}</>
}

export { InspectorNotType, InspectorNotTypeProps }
