import { 
  isEffectDefinition, Defined, DefinitionType, assertEffect, UnknownObject, 
  ClassDropping, SelectedEffects, Effect, DataGroup, assertTrue 
} from '@moviemasher/moviemasher.js'
import React from 'react'

import { PropsWithoutChild, ReactResult, WithClassName } from "../../../../declarations"
import { DragEffectObject, dragType, dropType } from '../../../../Helpers/DragDrop'
import { useEditor } from '../../../../Hooks/useEditor'
import { View } from '../../../../Utilities/View'
import { InspectorEffect } from '../../../Inspector/InspectorEffect'
import { InspectorProperties } from '../../../Inspector/InspectorProperties'
import { DataGroupInputs } from './DataGroupInputs'

export interface EffectsInputProps extends PropsWithoutChild, WithClassName {
  selectedEffects?: SelectedEffects
}
/**
 *
 * @children InspectorEffect
 */
export function EffectsGroupInput(props: EffectsInputProps): ReactResult {
  const { selectedEffects, className, ...rest } = props
  const ref = React.useRef<HTMLDivElement>(null)
  const [isOver, setIsOver] = React.useState(false)
  const [selectedEffect, setSelectedEffect] = React.useState<Effect | null>(null)
  
  const editor = useEditor()
  const { actions } = editor
  assertTrue(selectedEffects)
  const { value: effects, addHandler, removeHandler, moveHandler } = selectedEffects
  const selected = (selectedEffect && effects.includes(selectedEffect)) ? selectedEffect : null
  if (selected !== selectedEffect) setSelectedEffect(selected)

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
    const { definitionObject, index } = data
    const droppedIndex = dropIndex(event)
    if (typeof definitionObject === 'undefined') {
      if (droppedIndex === index) return
      assertEffect(selected)
      moveHandler(selected, droppedIndex)
    } else {
      const definition = Defined.fromObject(definitionObject)
      if (isEffectDefinition(definition)) {
        const effect = definition.instanceFromObject()
        addHandler(effect, droppedIndex)
      }
    }
  }

  const onClick: React.MouseEventHandler = () => { setSelectedEffect(null) }

  const childNodes = (): React.ReactElement[] => {
    return effects.map((effect, index) => {
      const clipProps = {
        key: effect.id,
        selectedEffect: selected, setSelectedEffect,
        effect,
        index, removeHandler
      }
      return <InspectorEffect {...clipProps} />
    })
  }

  const calculateClassName = (): string => {
    const classes = [className || 'effects']
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
  const effectsView = <View {...viewProps}/>
  const effectView = selected ? <InspectorProperties selectedItems={selected.selectedItems(actions)}/>: <></>
  return <>{effectsView}{effectView}</>
}

DataGroupInputs[DataGroup.Effects] = <EffectsGroupInput />