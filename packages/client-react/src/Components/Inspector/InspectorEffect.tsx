import { Effect, Transformable } from '@moviemasher/moviemasher.js'
import React from 'react'

import { ReactResult, WithClassName } from '../../declarations'
import { useSelected, useSelectedEffect } from '../../Hooks'
import { useMashEditor } from '../../Hooks/useMashEditor'
import { DragSuffix } from '../../Setup/Constants'
import { View } from '../../Utilities'

interface InspectorEffectProps extends WithClassName {
  effect: Effect
}

/**
 * @parents DefaultEffectsInput
 */
function InspectorEffect(props: InspectorEffectProps): ReactResult {
  const masher = useMashEditor()
  const selectedEffect = useSelectedEffect()
  const selectedClip = useSelected()
  const { effect, ...rest } = props

  const selected = selectedEffect === effect

  const onMouseDown = (event: React.MouseEvent) => {
    if (!selected) masher.selectEffect(effect)
  }


  const onDragEnd: React.DragEventHandler = event => {
    const { dataTransfer } = event
    const { dropEffect } = dataTransfer
    if (dropEffect === 'none') {
      masher.removeEffect(effect)
    }
  }

  const onDragStart: React.DragEventHandler = event => {
    if (!selected) onMouseDown(event)

    const data = { index: (selectedClip! as Transformable).effects.indexOf(effect)}
    const json = JSON.stringify(data)
    const { dataTransfer } = event
    dataTransfer.effectAllowed = 'move'
    // console.log("onDragStart setData", `effect${DragSuffix}`, json)
    dataTransfer.setData(`effect${DragSuffix}`, json)
  }

  const classes = ['effect']
  if (selected) classes.push('selected')
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

export { InspectorEffect, InspectorEffectProps }
