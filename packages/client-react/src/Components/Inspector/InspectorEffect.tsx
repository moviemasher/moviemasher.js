import { ClassSelected, Effect, EffectRemovehandler } from '@moviemasher/moviemasher.js'
import React from 'react'

import { ReactResult, WithClassName } from '../../declarations'
import { DragSuffix } from '../../Helpers/DragDrop'
import { View } from '../../Utilities'

export interface InspectorEffectProps extends WithClassName {
  effect: Effect
  selectedEffect: Effect | null
  setSelectedEffect: (effect: Effect | null) => void
  index: number 
  removeHandler: EffectRemovehandler
}

/**
 * @parents InspectorEffects
 */
export function InspectorEffect(props: InspectorEffectProps): ReactResult {
  const { 
    className, removeHandler, index, effect, selectedEffect, setSelectedEffect, 
    ...rest 
  } = props
  const selected = selectedEffect === effect

  const onMouseDown = () => { if (!selected) setSelectedEffect(effect) }

  const onDragEnd = (event: DragEvent) => {
    const { dataTransfer } = event
    if (!dataTransfer) return 
    
    const { dropEffect } = dataTransfer
    if (dropEffect === 'none') removeHandler(effect)
  }

  const onDragStart = (event: DragEvent) => {
    if (!selected) onMouseDown()
    const data = { index }
    const json = JSON.stringify(data)
    const { dataTransfer } = event

    if (!dataTransfer) return 

    dataTransfer.effectAllowed = 'move'
    dataTransfer.setData(`effect${DragSuffix}`, json)
  }

  const classes = [className || 'effect']
  if (selected) classes.push(ClassSelected)
  const viewProps = {
    ...rest,
    children: effect.label,
    className: classes.join(' '),
    onMouseDown, onDragStart, onDragEnd,
    onClick: (event: React.MouseEvent) => event.stopPropagation(),
    draggable: true,
  }
  return <View {...viewProps} />
}
