import React from 'react'
import {
  UnknownObject, pixelFromFrame, DroppingPosition, ClassSelected, eventStop, 
  assertTrue,
  sizeAboveZero,
  Size,
  assertObject
} from '@moviemasher/moviemasher.js'

import { PropsWithoutChild, ReactResult, WithClassName } from '../../declarations'
import { DragSuffix, droppingPositionClass } from '../../Helpers/DragDrop'
import { TrackContext } from '../../Contexts/TrackContext'
import { TimelineContext } from '../Timeline/TimelineContext'
import { useEditor } from '../../Hooks/useEditor'
import { ClipContext } from './ClipContext'
import { View } from '../../Utilities/View'

export interface ClipItemProps extends WithClassName, PropsWithoutChild {}
/**
 * @parents TimelineTrack
 */
export function ClipItem(props: ClipItemProps): ReactResult {
  const { className, ...rest } = props

  const svgRef = React.useRef<HTMLDivElement>(null)
  const viewRef = React.useRef<HTMLDivElement>(null)
  const editor = useEditor()
  const trackContext = React.useContext(TrackContext)
  const timelineContext = React.useContext(TimelineContext)
  const clipContext = React.useContext(ClipContext)
  const {
    droppingPosition, droppingClip, scale, selectedClip, onDrop,
    dragTypeValid, setDroppingPosition, setDroppingClip, setDroppingTrack, 
    onDragLeave,
  } = timelineContext
  const { track } = trackContext
  const { clip, prevClipEnd} = clipContext
  assertTrue(clip)

  const { label, type, frame, frames } = clip
  const width = pixelFromFrame(frames, scale, 'floor')
  const updateRef = async () => {
    const { current } = svgRef
    if (!current) return
    
    const currentSize: Size = { width, height: 0 }
    const parent = current.parentNode
    if (parent instanceof HTMLDivElement) {
      const rect = parent.getBoundingClientRect()
      currentSize.height = rect.height
    }

    if (!sizeAboveZero(currentSize)) return

    const { rect: size, edited } = editor
    assertObject(edited)

    const { backcolor } = edited

    const minWidth = currentSize.height * (size.width / size.height)
    currentSize.width = Math.max(currentSize.width,  minWidth)
    const element = await clip.clipIcon(currentSize, scale, 1, backcolor)
    if (element) current.replaceChildren(element)
  }

  React.useEffect(() => { updateRef() }, [])
  if (svgRef.current) updateRef()

  const onPointerDown = (event: MouseEvent) => { 
    event.stopPropagation()
    editor.selection.set(clip) 
  }

  const onDragEnd = (event: DragEvent) => {
    eventStop(event)
    const { dataTransfer } = event
    if (!dataTransfer) return
    
    const { dropEffect } = dataTransfer
    if (dropEffect === 'none') {
      console.log("TimelineClip removeClip")
      editor.removeClip(clip)
    }
  }

  const onDragStart = (event: DragEvent) => {
    event.stopPropagation()
    const { dataTransfer, clientX } = event
    const { current } = viewRef
    if (!(dataTransfer && current)) return

    const rect = current.getBoundingClientRect()
    const { left } = rect

    const data = { offset: clientX - left }
    const json = JSON.stringify(data)
    dataTransfer.effectAllowed = 'move'
    dataTransfer.setData(type + DragSuffix, json)
  }

  const onDragOver = (event: DragEvent) => {
    eventStop(event)
    const { dataTransfer } = event
    if (!dataTransfer) {
      console.log("TimelineClip onDragOver no dataTransfer")
      return
    } 

    const definitionType = dragTypeValid(dataTransfer, clip)
    const pos = definitionType ? DroppingPosition.At : DroppingPosition.None
    setDroppingTrack(definitionType ? track : undefined)
    setDroppingClip(definitionType ? clip : undefined)
    setDroppingPosition(pos)
  }

  const calculateClassName = (): string => {
    const selected = clip === selectedClip
    const classes: string[] = []
    if (className) classes.push(className)
    if (selected) classes.push(ClassSelected)
    if (droppingClip === clip) classes.push(droppingPositionClass(droppingPosition))

    // console.log("TimelineClip calculatedClassName", classes.join(' '))
    return classes.join(' ')
  }

  const childNodes = () => {
    const nodes = [<View key="icon" ref={svgRef} />]
    if (label) nodes.unshift(<label key='label'>{label}</label>)
    return nodes
  }

  const style: UnknownObject = { width }
  if (prevClipEnd > -1) {
    style.marginLeft = pixelFromFrame(frame - prevClipEnd, scale, 'floor')
  }

  const clipProps = {
    ...rest,
    style,
    className: calculateClassName(),
    onPointerDown, onDragStart, onDragEnd,
    onDragOver, onDragLeave, onDrop,
    onClick: (event: React.MouseEvent) => event.stopPropagation(),
    draggable: true,
    ref: viewRef,
    children: childNodes()
  }

  return <View { ...clipProps } />
}
