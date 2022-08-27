import React from 'react'
import { 
  ClassSelected, sizeCopy, sizeScale, UnknownObject} from "@moviemasher/moviemasher.js"

import { 
  PropsWithoutChild, ReactResult, WithClassName 
} from '../../declarations'
import { BrowserContext } from '../Browser/BrowserContext'
import { DragSuffix } from '../../Helpers/DragDrop'
import { useEditor } from '../../Hooks/useEditor'
import { useDefinition } from './useDefinition'
import { View } from '../../Utilities/View'
import { sizeCeil } from '@moviemasher/moviemasher.js'

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
  const editor = useEditor()

  const definition = useDefinition()

  const { definitionId, changeDefinitionId: setDefinitionId } = browserContext
  const { id, label } = definition

  const updateRef = async () => {
    const { current } = svgRef
    if (!current) return 

    const { rect, preloader } = editor
    const { endpoint } = preloader
    const scaled = sizeCeil(sizeScale(sizeCopy(rect), ratio, ratio))
    const element = await definition.definitionIcon(endpoint, scaled)
    if (element) current.replaceChildren(element)
  }

  React.useEffect(() => { updateRef() }, [])
  if (svgRef.current) updateRef()

  const childNodes = () => {
    const nodes = [<View key="icon" ref={svgRef} />]
    if (label) nodes.unshift(<label key='label'>{label}</label>)
    return nodes
  }

  const onPointerDown = () => { setDefinitionId(id) }

  const onDragStart = (event: DragEvent) => {
    onPointerDown()
    const rect = viewRef.current!.getBoundingClientRect()
    const { left } = rect
    const { clientX } = event
    const data = { offset: clientX - left, definitionObject: definition }
    const json = JSON.stringify(data)
    const { dataTransfer } = event
    if (!dataTransfer) return 
    
    dataTransfer.effectAllowed = 'copy'
    dataTransfer.setData(definition.type + DragSuffix, json)
  }

  const calculateClassName = () => {
    const classes = []
    if (className) classes.push(className)
    if (definitionId === id) classes.push(ClassSelected)
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
