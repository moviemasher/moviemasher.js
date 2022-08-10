import React from 'react'
import { PropsAndChildren, ReactResult, WithClassName } from '../../declarations'
import { View } from '../../Utilities/View'
import { InspectorContext } from './InspectorContext'
import { propsSelectTypes } from '../../Utilities/Props'
import { assertSelectType, ClassSelected, isPopulatedString, SelectType } from '@moviemasher/moviemasher.js'


export interface InspectorTypePickerProps extends PropsAndChildren, WithClassName {
  type: string | SelectType
}
/**
 * @parents Inspector
 */

export function InspectorTypePicker(props: InspectorTypePickerProps): ReactResult {
  const { type, children, className } = props
  assertSelectType(type)
  
  const inspectorContext = React.useContext(InspectorContext)
  const { changeSelected, selectedInfo } = inspectorContext
  const { selectTypes, selectedType} = selectedInfo

  if (!selectTypes.includes(type)) return null

  const onClick = () => { changeSelected(type) }

  const classes: string[] = []
  if (isPopulatedString(className)) classes.push(className)
  if (selectedType === type) classes.push(ClassSelected)

  const viewProps = { children, onClick, className: classes.join(' ') }
  return <View {...viewProps} />
}
