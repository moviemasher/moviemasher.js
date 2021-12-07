import React from 'react'
import { MasherChangeHandler, UnknownObject } from '@moviemasher/moviemasher.js'

import { EditorContext } from '../../Contexts/EditorContext'
import { View } from '../../Utilities/View'
import { InputContext } from '../../Contexts/InputContext'
import { useSelected } from '../../Hooks/useSelected'

interface PropertyDefinedProps extends UnknownObject {
  property: string
  properties?: string[]
}

const Defined: React.FunctionComponent<React.PropsWithChildren<PropertyDefinedProps>> = props => {
  const { property, properties, ...rest } = props
  const selected = useSelected()
  const { masher } = React.useContext(EditorContext)

  if (!selected) return null

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
