import React from 'react'
import { ClassSelected, IndexHandler, isPopulatedString, Movable } from '@moviemasher/moviemasher.js'

import { ReactResult, WithClassName } from '../../declarations'
import { DragSuffix } from '@moviemasher/client-core'
import { View } from '../../Utilities/View'
import { MasherContext } from '../Masher/MasherContext'

export interface InspectorMovableProps extends WithClassName {
  movable: Movable
  selected: Movable | null
  select: (movable: Movable | null) => void
  index: number 
  removeHandler: IndexHandler<Movable>
  property: string
}

/**
 * @parents MovablesGroupInput
 */
export function InspectorMovable(props: InspectorMovableProps): ReactResult {
  const { 
    property, className, removeHandler, index, movable, selected, select, ...rest 
  } = props
  const isSelected = selected === movable

  const masherContext = React.useContext(MasherContext)
  const { icons } = masherContext
  
  const onMouseDown = () => { if (!isSelected) select(movable) }

  const onDragEnd = (event: DragEvent) => {
    const { dataTransfer } = event
    if (!dataTransfer) return 
    
    const { dropEffect } = dataTransfer
    if (dropEffect === 'none') removeHandler(movable)
  }

  const onDragStart = (event: DragEvent) => {
    if (!isSelected) onMouseDown()
    const data = { index }
    const json = JSON.stringify(data)
    const { dataTransfer } = event

    if (!dataTransfer) return 

    dataTransfer.effectAllowed = 'move'
    dataTransfer.setData(`${property}${DragSuffix}`, json)
  }

  const classes = [className || 'movable']
  if (isSelected) classes.push(ClassSelected)
  const viewChildren = []


  const label = movable.value('label')
  const icon = movable.value('icon')
  if (isPopulatedString(icon)) {
    const iconElement = icons[icon]
    if (iconElement) viewChildren.push(iconElement)
  }
  if (isPopulatedString(label)) viewChildren.push(label)
  
  const viewProps = {
    ...rest,
    children: viewChildren,
    className: classes.join(' '),
    onMouseDown, onDragStart, onDragEnd,
    onClick: (event: React.MouseEvent) => event.stopPropagation(),
    draggable: true,
  }
  return <View {...viewProps} />
}
