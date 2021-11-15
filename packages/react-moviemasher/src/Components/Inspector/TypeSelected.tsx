import React from 'react'

import { propsDefinitionTypes } from '../../Utilities/Props'
import { InspectorContext } from './InspectorContext'

interface TypeSelectedProps {
  type?: string
  types?: string | string[]
}

const TypeSelected: React.FunctionComponent<TypeSelectedProps> = props => {
  const inspectorContext = React.useContext(InspectorContext)

  const { type, types, children } = props
  if (!children) return null

  const { definitionType } = inspectorContext
  const definitionTypes = propsDefinitionTypes(type, types)
  if (!definitionTypes.includes(definitionType)) return null

  return <>{children}</>
}

export { TypeSelected }
