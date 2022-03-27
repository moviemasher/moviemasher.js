import React from 'react'

import { ReactResult, PropsAndChildren } from '../../declarations'
import { useSelected } from '../../Hooks/useSelected'

interface InspectorDefinedProps extends PropsAndChildren {
  property: string
  properties?: string[]
}

/**
 * @parents InspectorContent
 */
function InspectorDefined(props: InspectorDefinedProps): ReactResult {
  const { property, properties, children } = props
  const selected = useSelected()

  if (!selected) return null

  const strings = properties || [property]
  const names = selected.properties.map(property => property.name)
  const found = strings.filter(string => names.includes(string))
  if (found.length !== strings.length) return null


  return <>{children}</>
}

export { InspectorDefined, InspectorDefinedProps }
