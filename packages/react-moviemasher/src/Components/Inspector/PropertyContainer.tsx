import React from 'react'

import { View } from "../../Utilities/View"

interface PropertyContainerProps {
  property: string
  className?: string
  contained: React.ReactChild
}

const PropertyContainer: React.FC<React.PropsWithChildren<PropertyContainerProps>> = props => {
  const { contained, className, property, children } = props
  const templateElements = React.Children.toArray(children)
  const kids = []
  if (templateElements.length) {
    const [first, second, ...rest] = templateElements
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

export { PropertyContainer }
