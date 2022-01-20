import React from 'react'
import { PropertiedChangeHandler, UnknownObject } from '@moviemasher/moviemasher.js'

import { View } from '../../Utilities/View'
import { InputContext } from '../../Contexts/InputContext'
import { useSelected } from '../../Hooks/useSelected'
import { ReactResult } from '../../declarations'
import { useMashEditor } from '../../Hooks/useMashEditor'

interface InspectorDefinedProps extends UnknownObject {
  property: string
  properties?: string[]
  children: React.ReactNode
}

/**
 * @parents InspectorContent
 */
function InspectorDefined(props: InspectorDefinedProps): ReactResult {
  const masher = useMashEditor()
  const { property, properties, ...rest } = props
  const selected = useSelected()

  if (!selected) return null

  const strings = properties || [property]
  const names = selected.properties.map(property => property.name)
  const found = strings.filter(string => names.includes(string))
  if (found.length !== strings.length) return null

  const changeHandler: PropertiedChangeHandler = (property, value) => {
    masher.change(property, value)
  }

  const inputContext = { property, value: selected.value(property), changeHandler }

  return (
    <InputContext.Provider value={inputContext}>
      <View {...rest} />
    </InputContext.Provider>
  )
}

export { InspectorDefined, InspectorDefinedProps as InspectorPropertyDefinedProps }
