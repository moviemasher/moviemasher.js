import { DefinitionType, assertEffect, UnknownObject, SelectType, ClassDropping, isVisible, isVisibleClip } from '@moviemasher/moviemasher.js'
import React from 'react'
import { ReactResult } from "../../declarations"
import { DragEffectObject, dragType, dropType } from '../../Helpers/DragDrop'
import { useEditor } from '../../Hooks/useEditor'
import { useSelectedEffect } from '../../Hooks/useSelectedEffect'
import { View } from '../../Utilities/View'
import { InspectorEffect } from './InspectorEffect'
import { useSelected } from '../../Hooks/useSelected'

/**
 *
 * @children InspectorEffect
 */
export function InspectorEffects(): ReactResult {
  const ref = React.useRef<HTMLDivElement>(null)
  const [isOver, setIsOver] = React.useState(false)
  const selectedEffect = useSelectedEffect()
  const selectedClip = useSelected()
  const editor = useEditor()

  if (!isVisibleClip(selectedClip)) return <>NOT EFFECTABLE {selectedClip?.value('label')}</>
  const { effects } = selectedClip

  const childNodes = (): React.ReactElement[] => {
    return effects.map((effect, index) => {
      const clipProps = {
        key: effect.id,
        index,
        effect,
      }
      return <InspectorEffect {...clipProps} />
    })
  }

  const dropIndex = (event: React.DragEvent): number => {
    const { target } = event
    if (target && target instanceof HTMLDivElement) {
      const index = target.getAttribute('index')
      if (index) return Number(index)
    }
    return effects.length
  }


  const dropAllowed = (event: React.DragEvent): boolean => {
    const { dataTransfer } = event
    const type = dragType(dataTransfer)
    return type === DefinitionType.Effect
  }
  const onDragLeave: React.DragEventHandler = () => { setIsOver(false) }

  const onDragOver: React.DragEventHandler = event => {
    const allowed = dropAllowed(event)
    setIsOver(allowed)
    if (allowed) event.preventDefault()
  }

  const onDrop: React.DragEventHandler = event => {
    setIsOver(false)
    if (!dropAllowed(event)) return

    event.preventDefault()
    const { dataTransfer } = event
    const type = dropType(dataTransfer)!
    const json = dataTransfer.getData(type)
    const data: DragEffectObject = JSON.parse(json)
    const { definitionObject: definition, index } = data
    const droppedIndex = dropIndex(event)
    if (typeof definition === 'undefined') {
      if (droppedIndex === index) return
      assertEffect(selectedEffect)
      editor.moveEffect(selectedEffect, droppedIndex)
    } else {
      editor.add(definition, droppedIndex)
    }
  }

  const onClick: React.MouseEventHandler = () => { editor.deselect(SelectType.Effect) }

  const calculateClassName = (): string => {
    const classes = ['effects']
    if (isOver) classes.push(ClassDropping)
    return classes.join(' ')
  }

  const memoClassName = React.useMemo(calculateClassName, [isOver])

  const viewProps:UnknownObject = {
    className: memoClassName,
    children: childNodes(),
    ref,
    onDragLeave,
    onDragOver,
    onDrop,
    onClick,
  }
  return <View {...viewProps}/>
}
