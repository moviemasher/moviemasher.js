import React from 'react'
import { ReactResult } from '../../declarations'

import { View } from "../../Utilities/View"

export interface InspectorPropertyContainerProps {
  property: string
  type: string
  className?: string
  contained: React.ReactChild
}

/**
 * @parents InspectorContent
 */
export function InspectorPropertyContainer(props: InspectorPropertyContainerProps): ReactResult {
  const { contained, className, property } = props
  const children: React.ReactChild[] = []
  if (!property.endsWith('Id')) {
    const firstOptions = { key: `label-${property}`, children: property }
    children.push(<label { ...firstOptions} />)
  }
  children.push(contained)
  const viewProps = { children, key: property, className }
  return <View {...viewProps} />
}
