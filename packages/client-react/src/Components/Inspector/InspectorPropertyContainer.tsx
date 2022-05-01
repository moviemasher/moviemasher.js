import React from 'react'
import { ReactResult } from '../../declarations'

import { View } from "../../Utilities/View"

export interface InspectorPropertyContainerProps {
  property: string
  type: string
  className?: string
  contained: React.ReactChild
  children: React.ReactNode
}


/**
 * @parents InspectorContent
 */
export function InspectorPropertyContainer(props: InspectorPropertyContainerProps): ReactResult {
  const { contained, className, property, children } = props
  const templateElements = React.Children.toArray(children)
  const kids = []
  if (templateElements.length) {
    const [first, second] = templateElements
    if (React.isValidElement(first)) {
      kids.push(React.cloneElement(first, { key: `label-${property}`, children: property }))
      if (second) {
        if (React.isValidElement(second)) {
          kids.push(React.cloneElement(second, { key: `contained-${property}`, children: contained }))
        } else kids.push(second, contained)
      } else kids.push(contained)

    } else kids.push(property, ...templateElements, contained)
  }
  else kids.push(property, contained)

  const viewProps = { children: kids, key: property, className }
  return <View {...viewProps} />
}
