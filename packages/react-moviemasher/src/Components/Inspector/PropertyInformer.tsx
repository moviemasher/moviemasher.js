import React from 'react'

import { EditorContext } from "../Editor/EditorContext"
import { PropertyContainer } from './PropertyContainer'

interface PropertyInformerProps {
  property: string
  className?: string
}

const PropertyInformer: React.FunctionComponent<PropertyInformerProps> = props => {
  const { className, property, children } = props
  const editorContext = React.useContext(EditorContext)
  const masher = editorContext.masher!

  const { selected } = masher
  const value = String(selected.value(property))

  const containerProps = { className, children, property, contained: value }
  return <PropertyContainer {...containerProps} />
}

export { PropertyInformer }
