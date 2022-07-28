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
  const { selectTypes, changeType, selectedTypes } = inspectorContext
  if (!selectTypes.length) return null

  const propTypes = propsSelectTypes(type, types)
  if (!propTypes.some(type => selectTypes.includes(type))) return null

  const onClick = () => { 
    const types = propTypes.join(',')
    // console.log("InspectorTypePicker onClick", types)
    changeType(types) 
  }
  const classes: string[] = []
  if (isPopulatedString(className)) classes.push(className)

  if (propTypes.some(type => selectedTypes.includes(type))) classes.push(ClassSelected)


  const viewProps = { children, onClick, className: classes.join(' ') }

  return <View {...viewProps} />
}
