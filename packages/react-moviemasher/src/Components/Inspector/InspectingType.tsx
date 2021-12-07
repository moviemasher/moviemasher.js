import React from 'react'

import { propsDefinitionTypes } from '../../Utilities/Props'
import { InspectorContext } from '../../Contexts/InspectorContext'

interface InspectingTypeProps {
  type?: string
  types?: string | string[]
}

const InspectingType: React.FunctionComponent<InspectingTypeProps> = props => {
  const inspectorContext = React.useContext(InspectorContext)
  const { definitionType } = inspectorContext
  if (!definitionType) return null

  const { type, types, children } = props
  if (!children) return null

  const definitionTypes = propsDefinitionTypes(type, types)
  if (!definitionTypes.includes(definitionType)) return null

  return <>{children}</>
}

export { InspectingType }
