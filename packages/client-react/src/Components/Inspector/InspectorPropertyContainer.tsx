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
  const templateElements = [<label/>]
  const kids : React.ReactChild[] = []
  if (templateElements.length) {
    const [first, second] = templateElements
    if (React.isValidElement(first)) {
      const firstOptions = { key: `label-${property}`, children: property }
      kids.push(React.cloneElement(first, firstOptions))
      if (second) {
        if (React.isValidElement(second)) {
          const secondOptions = { key: `contained-${property}`, children: contained }
          kids.push(React.cloneElement(second, secondOptions))
        } else kids.push(second, contained)
      } else kids.push(contained)

    } else kids.push(property, ...templateElements, contained)
  }
  else kids.push(property, contained)

  const viewProps = { children: kids, key: property, className }
  return <View {...viewProps} />
}
