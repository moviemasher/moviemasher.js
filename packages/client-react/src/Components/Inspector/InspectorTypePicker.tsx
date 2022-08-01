import React from 'react'
import { PropsAndChildren, ReactResult, WithClassName } from '../../declarations'
import { View } from '../../Utilities/View'
import { InspectorContext } from '../../Contexts/InspectorContext'
import { propsSelectTypes } from '../../Utilities/Props'
import { ClassSelected, isPopulatedString } from '@moviemasher/moviemasher.js'


export interface InspectorTypePickerProps extends PropsAndChildren, WithClassName {
  type?: string
  types?: string | string[]
}
/**
 * @parents Inspector
 */

export function InspectorTypePicker(props: InspectorTypePickerProps): ReactResult {
  const { type, types, children, className } = props
  const inspectorContext = React.useContext(InspectorContext)
  const { selectTypes, selected, changeSelected, selectedTypes, selectTypesObject } = inspectorContext
  const propTypes = propsSelectTypes(type, types)
  const key = propTypes.join('-')
  React.useEffect(() => {
    selectTypesObject[key] = propTypes
    return () => { delete selectTypesObject[key] }
  }, [])

  if (!selectTypes.length) return null
  if (!propTypes.some(type => selectTypes.includes(type))) return null

  const onClick = () => { changeSelected(key) }

  const classes: string[] = []
  if (isPopulatedString(className)) classes.push(className)
  if (propTypes.some(type => selectedTypes.includes(type))) classes.push(ClassSelected)

  const viewProps = { children, onClick, className: classes.join(' ') }
  return <View {...viewProps} />
}
