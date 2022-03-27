import React from 'react'
import { PropertiedChangeHandler, Propertied } from "@moviemasher/moviemasher.js"

import { PropsAndChildren, ReactResult, WithClassName } from '../../declarations'
import { InspectorProperty, InspectorPropertyProps } from './InspectorProperty'
import { useSelected } from '../../Hooks/useSelected'
import { useEditor } from '../../Hooks/useEditor'

interface InspectorSelectionProps extends PropsAndChildren, WithClassName {
  property: string
  inspected?: Propertied
  propertyPrefix?: string
}

/**
 * @parents InspectorContent
 */
function InspectorSelection(props: InspectorSelectionProps): ReactResult {
  const { propertyPrefix, inspected, ...rest } = props
  const editor = useEditor()
  const instance = inspected || useSelected()
  if (!instance) return null

  const changeHandler: PropertiedChangeHandler = (property, value) => {
    const propertyPath = propertyPrefix ? `${propertyPrefix}.${property}` : property
    editor.change(propertyPath, value)
  }
  const containerProps: InspectorPropertyProps = { instance, changeHandler, ...rest }
  return <InspectorProperty {...containerProps} />
}

export { InspectorSelection, InspectorSelectionProps }
