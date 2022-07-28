import { assertClip, Effect } from '@moviemasher/moviemasher.js'
import React from 'react'

import { ReactResult, WithClassName } from '../../declarations'
import { DragSuffix } from '../../Helpers/DragDrop'
import { useSelected, useSelectedEffect } from '../../Hooks'
import { useEditor } from '../../Hooks/useEditor'
import { View } from '../../Utilities'

export interface InspectorEffectProps extends WithClassName {
  effect: Effect
}

/**
 * @parents InspectorEffects
 */
export function InspectorEffect(props: InspectorEffectProps): ReactResult {
  const editor = useEditor()
  const selectedEffect = useSelectedEffect()
  const selectedClip = useSelected()
  const { effect, ...rest } = props

  const selected = selectedEffect === effect

  const onMouseDown = (event: React.MouseEvent) => {
    if (!selected) editor.select(effect)
  }


  const onDragEnd: React.DragEventHandler = event => {
    const { dataTransfer } = event
    const { dropEffect } = dataTransfer
    if (dropEffect === 'none') {
      editor.removeEffect(effect)
    }
  }

  const onDragStart: React.DragEventHandler = event => {
    if (!selected) onMouseDown(event)

    assertClip(selectedClip)
    const data = { index: selectedClip.effects.indexOf(effect)}
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
