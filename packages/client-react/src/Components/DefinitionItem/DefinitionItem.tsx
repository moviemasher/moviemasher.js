import React from 'react'
import { 
  assertTrue,
  ClassSelected, DefinitionType, idGenerateString, sizeAboveZero, sizeCopy, sizeScale, UnknownObject} from "@moviemasher/moviemasher.js"

import { 
  PropsWithoutChild, ReactResult, WithClassName 
} from '../../declarations'
import { DragSuffix } from '../../Helpers/DragDrop'
import { useDefinition } from './useDefinition'
import { View } from '../../Utilities/View'
import { sizeCeil } from '@moviemasher/moviemasher.js'
import { MasherContext } from '../Masher/MasherContext'
import { BrowserContext } from '../Browser/BrowserContext'

export interface DefinitionItemProps extends WithClassName, PropsWithoutChild {
  draggable?: boolean
  iconRatio?: number
}

/**
 * @parents BrowserContent, DefinitionDrop
 */
export function DefinitionItem(props: DefinitionItemProps): ReactResult {
  const { className, iconRatio, ...rest } = props
  const ratio = iconRatio || 0.25
  
  const svgRef = React.useRef<HTMLDivElement>(null)
  const viewRef = React.useRef<HTMLDivElement>(null)
  const browserContext = React.useContext(BrowserContext)
  const { refresh } = browserContext
  const editorContext = React.useContext(MasherContext)
  const { editor, changeDefinition, current } = editorContext
  
  assertTrue(editor)

  const definition = useDefinition()

  const { id, label } = definition
 
  const updateRef = async () => {
    const { rect, preloader } = editor
    const { current } = svgRef
    if (!(current && sizeAboveZero(rect))) return 

    const scaled = sizeCeil(sizeScale(sizeCopy(rect), ratio, ratio))
    const element = await definition.definitionIcon(preloader, scaled)
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
    
    changeDefinition(definition) 
    refresh()
  }

  const onDragStart = (event: DragEvent) => {
    onPointerDown(event)
    const rect = viewRef.current!.getBoundingClientRect()
    const { left } = rect
    const { clientX } = event
    const data = { offset: clientX - left, definitionObject: definition }
    const json = JSON.stringify(data)
    const { dataTransfer } = event
    if (!dataTransfer) return 
    
    dataTransfer.effectAllowed = 'copy'
    // console.log("DefinitionItem.onDragStart", definition.type + DragSuffix, json)
    dataTransfer.setData(definition.type + DragSuffix, json)
  }

  const calculateClassName = () => {
    const classes = []
    if (className) classes.push(className)
    if (current.definitionId === id) classes.push(ClassSelected)
    return classes.join(' ')
  }

  const viewProps: UnknownObject = {
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
