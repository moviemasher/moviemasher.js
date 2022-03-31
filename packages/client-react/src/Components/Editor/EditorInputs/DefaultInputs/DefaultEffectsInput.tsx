import { DataType, DefinitionType, Effects, TrackType, UnknownObject } from '@moviemasher/moviemasher.js'
import React from 'react'
import { InputContext } from '../../../../Contexts/InputContext'
import { ReactResult } from "../../../../declarations"
import { DragClipObject } from '../../../../Helpers/DragDrop'
import { useMashEditor } from '../../../../Hooks/useMashEditor'
import { DragSuffix } from '../../../../Setup/Constants'
import { View } from '../../../../Utilities/View'
import { InspectorEffect } from '../../../Inspector/InspectorEffect'
import { DataTypeInputs } from './DataTypeInputs'

/**
 *
 * @children InspectorEffect
 */
function DefaultEffectsInput(): ReactResult {
  const ref = React.useRef<HTMLDivElement>(null)
  const [isOver, setIsOver] = React.useState(false)
  const inputContext = React.useContext(InputContext)
  const masher = useMashEditor()
  if (!masher) return null

  const { changeHandler, property, value } = inputContext
  if (!property) return null

  const onChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    changeHandler(property.name, event.target.value)
  }

   const onDragOver: React.DragEventHandler = event => {
    const { dataTransfer } = event
    const allowed = dropAllowed(dataTransfer)
    setIsOver(allowed)
    if (allowed) event.preventDefault()
   }

  const childNodes = (): React.ReactElement[] => {
    const effects = value as Effects
    return effects.map(effect => {
      const clipProps = {
        key: effect.id,
        effect,
      }
    //   if (!dense) prevClipEnd = clip.frames + clip.frame
      return <InspectorEffect {...clipProps} />
    })
  }

  const dropType = (dataTransfer: DataTransfer): string | undefined => {
    return dataTransfer.types.find(type => type.endsWith(DragSuffix))
  }

  const dropAllowed = (dataTransfer: DataTransfer): boolean => {
    const type = dropType(dataTransfer)
    // console.log("dropAllowed", trackType, type)
    if (!type) return false

    if (!type.endsWith(DragSuffix)) return true

    const [definitionType] = type.split('/')
    return (definitionType === String(DefinitionType.Effect))
  }

  const onDragLeave: React.DragEventHandler = () => {
    setIsOver(false)
  }

  const pixelToIndex = (pixel: number): number => {
    return 0
  }
  const dropClip = (dataTransfer: DataTransfer, offsetDrop: number) => {
    const type = dropType(dataTransfer)!
    console.log("dropClip", type, offsetDrop)


    const json = dataTransfer.getData(type)
    const data: DragClipObject = JSON.parse(json)

    const { offset, definition } = data
    const index = pixelToIndex(Math.max(0, offsetDrop - offset))

    if (typeof definition === 'undefined') {
      console.log('no definition')
      const effect = masher.selection.effect
      if (!effect) return

      masher.moveEffect(effect, index)
    } else {
      masher.add(definition, index)
    }

  }

    const dropOffset = (clientY: number) => {
    const { current } = ref
    if (!current) return 0

    const rect = current.getBoundingClientRect()
    return clientY - rect.y
  }


  const onDrop: React.DragEventHandler = event => {
    setIsOver(false)
    const { dataTransfer, clientY } = event
    const type = dropType(dataTransfer)
    if (!type) return

    const offset = dropOffset(clientY)
    if (type.endsWith(DragSuffix)) dropClip(dataTransfer, offset)

    // TODO: handle other types
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


export { DefaultEffectsInput }
