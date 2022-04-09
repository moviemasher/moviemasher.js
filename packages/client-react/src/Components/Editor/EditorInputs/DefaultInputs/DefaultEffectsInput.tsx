import { DataType, DefinitionType, Effects, UnknownObject } from '@moviemasher/moviemasher.js'
import React from 'react'
import { InputContext } from '../../../../Contexts/InputContext'
import { ReactResult } from "../../../../declarations"
import { DragEffectObject } from '../../../../Helpers/DragDrop'
import { useMashEditor } from '../../../../Hooks/useMashEditor'
import { useSelectedEffect } from '../../../../Hooks/useSelectedEffect'
import { DragSuffix } from '../../../../Setup/Constants'
import { View } from '../../../../Utilities/View'
import { InspectorEffect } from '../../../Inspector/InspectorEffect'
import { DataTypeInputs } from './DataTypeInputs'

/**
 *
 * @children InspectorEffect
 */
export function DefaultEffectsInput(): ReactResult {
  const ref = React.useRef<HTMLDivElement>(null)
  const [isOver, setIsOver] = React.useState(false)
  const inputContext = React.useContext(InputContext)
  const selectedEffect = useSelectedEffect()
  const { property, value } = inputContext
  const masher = useMashEditor()
  if (!masher) return null
  if (!property) return null


  const childNodes = (): React.ReactElement[] => {
    const valueEffects = value as Effects
    return valueEffects.map((effect, index) => {
      const clipProps = {
        key: effect.id,
        index,
        effect,
      }
    //   if (!dense) prevClipEnd = clip.frames + clip.frame
      return <InspectorEffect {...clipProps} />
    })
  }

  const dropAllowed = (event: React.DragEvent): boolean => {
    const { dataTransfer } = event
    const type = dropType(dataTransfer)
    if (!type) return false
    if (!type.endsWith(DragSuffix)) return false

    const [definitionType] = type.split('/')
    return definitionType === String(DefinitionType.Effect)
  }

  const dropEffect = (event: React.DragEvent) => {
    const { dataTransfer } = event
    const type = dropType(dataTransfer)!
    const json = dataTransfer.getData(type)
    const data: DragEffectObject = JSON.parse(json)
    const { definition, index } = data
    const droppedIndex = dropIndex(event)
    if (typeof definition === 'undefined') {
      if (!selectedEffect || droppedIndex === index) return

      masher.moveEffect(selectedEffect, droppedIndex)
    } else {
      masher.add(definition, droppedIndex)
    }
  }

  const dropIndex = (event: React.DragEvent): number => {
    const { target } = event
    if (target && target instanceof HTMLDivElement) {
      const index = target.getAttribute('index')
      if (index) return Number(index)
    }
    return (value as Effects).length
  }

  const dropType = (dataTransfer: DataTransfer): string | undefined => {
    return dataTransfer.types.find(type => type.endsWith(DragSuffix))
  }

  const onDragLeave: React.DragEventHandler = () => { setIsOver(false) }

  const onDragOver: React.DragEventHandler = event => {
    const allowed = dropAllowed(event)
    setIsOver(allowed)
    if (allowed) event.preventDefault()
  }

  const onDrop: React.DragEventHandler = event => {
    setIsOver(false)
    const { dataTransfer } = event
    const type = dropType(dataTransfer)
    if (!type) return

    dropEffect(event)
    event.preventDefault()
  }
  // TODO: don't hardcode these
  const className = 'effects'
  const dropClass = 'drop'
  const classes: string[] = []
  if (className) classes.push(className)
  if (isOver && dropClass) classes.push(dropClass)

  const viewProps:UnknownObject = {
    className: classes.join(' '),
    children: childNodes(),
    ref,
    onDragLeave,
    onDragOver,
    onDrop,
  }
  return <View {...viewProps}/>
}

DataTypeInputs[DataType.Effects] = <DefaultEffectsInput />
