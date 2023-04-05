import React from 'react'
import { 
  assertTrue,
  ClassSelected, sizeAboveZero, sizeCopy, sizeScale, Strings, UnknownRecord} from "@moviemasher/lib-core"


import { WithClassName } from "../../Types/Core"
import { PropsWithoutChild } from "../../Types/Props"
import { DragDefinitionObject, DragSuffix } from '@moviemasher/client-core'
import { useDefinition } from './useDefinition'
import { View } from '../../Utilities/View'
import { sizeCeil } from '@moviemasher/lib-core'
import MasherContext from '../Masher/MasherContext'
import { BrowserContext } from '../Browser/BrowserContext'

export interface DefinitionItemProps extends WithClassName, PropsWithoutChild {
  draggable?: boolean
  iconRatio?: number
}

/**
 * @parents BrowserContent, DefinitionDrop
 */
export function DefinitionItem(props: DefinitionItemProps) {
  const { className, iconRatio, ...rest } = props
  const ratio = iconRatio || 0.25
  
  const svgRef = React.useRef<HTMLDivElement>(null)
  const viewRef = React.useRef<HTMLDivElement>(null)
  const browserContext = React.useContext(BrowserContext)
  const { refresh } = browserContext
  const masherContext = React.useContext(MasherContext)
  const { masher: editor, changeDefinition, current } = masherContext
  
  assertTrue(editor)

  const media = useDefinition()

  const { id, label } = media
 
  const updateRef = async () => {
    const { rect } = editor
    const { current } = svgRef
    if (!(current && sizeAboveZero(rect))) return 

    const scaled = sizeCeil(sizeScale(sizeCopy(rect), ratio, ratio))
    const element = await media.definitionIcon(scaled)
    if (element) current.replaceChildren(element)
  }

  React.useEffect(() => { updateRef() }, [])
  if (svgRef.current) updateRef()

  const childNodes = () => {
    const nodes = [<View key="icon" ref={svgRef} />]
    if (label) nodes.unshift(<label key='label'>{label}</label>)
    return nodes
  }

  const onPointerDown = (event: Event) => { 
    event.stopPropagation()
    
    changeDefinition(media) 
    refresh()
  }

  const onDragStart = (event: DragEvent) => {
    onPointerDown(event)
    const rect = viewRef.current!.getBoundingClientRect()
    const { left } = rect
    const { clientX } = event
    const mediaObject = media.toJSON()
    const data: DragDefinitionObject = { offset: clientX - left, mediaObject }
    const json = JSON.stringify(data)
    // console.log("DefinitionItem.onDragStart", mediaObject, json)
    const { dataTransfer } = event
    if (!dataTransfer) return 
    
    dataTransfer.effectAllowed = 'copy'
    console.log("DefinitionItem.onDragStart", media.type + DragSuffix, json)
    dataTransfer.setData(media.type + DragSuffix, json)
  }

  const calculateClassName = () => {
    const classes: Strings = []
    if (className) classes.push(className)
    if (current.mediaId === id) classes.push(ClassSelected)
    return classes.join(' ')
  }

  const viewProps: UnknownRecord = {
    ...rest,
    className,
    children: childNodes(),
    ref: viewRef, key: id,
  }
  if (props.draggable) {
    viewProps.onDragStart = onDragStart
    viewProps.onPointerDown = onPointerDown
    viewProps.className = calculateClassName()
  }
  return <View {...viewProps}/>
}
