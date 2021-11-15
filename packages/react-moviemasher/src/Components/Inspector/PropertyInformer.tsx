import React from 'react'

import { PropertyContainer } from './PropertyContainer'
import { useSelected } from './useSelected'

interface PropertyInformerProps {
  property: string
  className?: string
}

const PropertyInformer: React.FunctionComponent<PropertyInformerProps> = props => {
  const { className, property, children } = props

  const selected = useSelected()
  const value = String(selected.value(property))

  const containerProps = { className, children, property, contained: value }
  return <PropertyContainer {...containerProps} />
}

export { PropertyInformer }
