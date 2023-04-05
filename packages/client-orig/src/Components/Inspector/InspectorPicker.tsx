import React from 'react'
import { 
  Identified,
  assertSelectorType, ClassSelected, isPopulatedString, 
} from '@moviemasher/lib-core'



import { WithClassName } from "../../Types/Core"
import { PropsAndChild } from "../../Types/Props"
import { View } from '../../Utilities/View'
import { InspectorContext } from './InspectorContext'



export interface InspectorPickerProps extends PropsAndChild, WithClassName, Identified {}
/**
 * @parents Inspector
 */

export function InspectorPicker(props: InspectorPickerProps) {
  const { id, children, className } = props
  assertSelectorType(id)
  
  const inspectorContext = React.useContext(InspectorContext)
  const { changeSelected, selectedInfo } = inspectorContext
  const { selectTypes, selectedType} = selectedInfo

  if (!selectTypes.includes(id)) return null

  const onClick = () => { changeSelected(id) }

  const classes: string[] = []
  if (isPopulatedString(className)) classes.push(className)
  if (selectedType === id) classes.push(ClassSelected)

  const viewProps = { children, onClick, className: classes.join(' ') }
  return <View {...viewProps} />
}
