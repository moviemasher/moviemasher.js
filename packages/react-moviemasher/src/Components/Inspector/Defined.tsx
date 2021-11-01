import React from 'react'
import { MasherChangeHandler, UnknownObject } from '@moviemasher/moviemasher.js'

import { EditorContext } from '../Editor/EditorContext'
import { View } from '../../Utilities/View'
import { InputContext } from './InputContext'

interface PropertyDefinedProps extends UnknownObject {
  property: string
  properties?: string[]
}

const Defined: React.FunctionComponent<React.PropsWithChildren<PropertyDefinedProps>> = props => {
  const { property, properties, ...rest } = props
  const editorContext = React.useContext(EditorContext)

  const masher = editorContext.masher!

  const { selected } = masher
  const strings = properties || [property]
  const found = strings.filter(string => selected.propertyNames.includes(string))
  if (found.length !== strings.length) return null

  const changeHandler: MasherChangeHandler = (property, value) => {
    masher.change(property, value)
  }

  const inputContext = { property, value: selected.value(property), changeHandler }

  return (
    <InputContext.Provider value={inputContext}>
      <View {...rest} />
    </InputContext.Provider>
  )
}

export { Defined }
