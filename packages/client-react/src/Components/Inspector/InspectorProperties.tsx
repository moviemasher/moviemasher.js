import React from "react"
import { PropertiedChangeHandler, Propertied } from "@moviemasher/moviemasher.js"

import { PropsAndChildren, ReactResult, WithClassName } from "../../declarations"
import { propsStringArray } from "../../Utilities/Props"
import { InspectorProperty, InspectorPropertyProps } from "./InspectorProperty"
import { useSelected } from "../../Hooks/useSelected"
import { useEditor } from "../../Hooks/useEditor"

interface InspectorPropertiesProps extends PropsAndChildren, WithClassName {
  property?: string
  propertyPrefix?: string
  properties?: string | string[]
  inspected?: Propertied
}

/**
 * @parents InspectorContent
 */
function InspectorProperties(props: InspectorPropertiesProps): ReactResult {
  const editor = useEditor()
  const { propertyPrefix, inspected, property, properties, ...rest } = props
  const instance = inspected || useSelected()
  if (!instance) return null

  const changeHandler: PropertiedChangeHandler = (property, value) => {
    const propertyPath = propertyPrefix ? `${propertyPrefix}.${property}` : property
    editor.change(propertyPath, value)
  }

  const strings = propsStringArray(property, properties, instance.properties)

  const kids = strings.map(property => {
    const propertyProps: InspectorPropertyProps = {
      key: `inspector-${property}`,
      property,
      propertyPrefix,
      instance,
      changeHandler,
      ...rest
    }
    return <InspectorProperty {...propertyProps} />
  })
  return <>{kids}</>
}

export { InspectorProperties, InspectorPropertiesProps }
