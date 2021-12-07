import React from 'react'

import { PropertyContainer } from './PropertyContainer'
import { useSelected } from '../../Hooks/useSelected'

interface PropertyInformerProps {
  property: string
  className?: string
}

const SelectionInformer: React.FunctionComponent<PropertyInformerProps> = props => {
  const selected = useSelected()
  if (!selected) return null

  const { className, property, children } = props
  const value = String(selected.value(property))
  const containerProps = { className, children, property, contained: value }
  return <PropertyContainer {...containerProps} />
}

export { SelectionInformer }
