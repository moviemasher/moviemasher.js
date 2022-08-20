import React from 'react'
import {
  UnknownObject, Clip, pixelFromFrame, DroppingPosition, ClassSelected, eventStop
} from '@moviemasher/moviemasher.js'

import { PropsAndChild, ReactResult, WithClassName } from '../../declarations'
import { Problems } from '../../Setup/Problems'
import { DragSuffix, droppingPositionClass } from '../../Helpers/DragDrop'
import { TrackContext } from '../../Contexts/TrackContext'
import { TimelineContext } from './TimelineContext'
import { EditorContext } from '../../Contexts/EditorContext'
import { useEditor } from '../../Hooks/useEditor'

export interface TimelineClipProps extends UnknownObject, PropsAndChild {
  clip: Clip
  prevClipEnd: number
  label?: string
  icon?: string
}

/**
 * @parents TimelineClips
 */
export function TimelineClip(props: TimelineClipProps): ReactResult {
  const trackContext = React.useContext(TrackContext)
  const timelineContext = React.useContext(TimelineContext)
  const editorContext = React.useContext(EditorContext)
  const ref = React.useRef<HTMLDivElement>(null)
  const {
    droppingPosition, droppingClip, scale, selectedClip, onDrop,
    dragTypeValid, setDroppingPosition, setDroppingClip, setDroppingTrack, onDragLeave
  } = timelineContext
  const { track } = trackContext
  const editor = useEditor()

  const { icon: iconVar, label: labelVar, clip, prevClipEnd, children } = props
  const { label, type, frame, frames } = clip

  const kid = React.Children.only(children)
  if (!React.isValidElement(kid)) throw Problems.child

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
    const { current } = ref
    if (!(dataTransfer && current)) return

    const rect = current.getBoundingClientRect()
    const { left } = rect

    const data = { offset: clientX - left }
    const json = JSON.stringify(data)
    dataTransfer.effectAllowed = 'move'
    dataTransfer.setData(type + DragSuffix, json)
  }

  const width = pixelFromFrame(frames, scale, 'floor')
  const style: UnknownObject = { width }
  if (labelVar) style[labelVar] = `'${label.replaceAll("'", "\\'")}'`
  if (iconVar) {
    const { preloader } = editor
    const url = clip.iconUrl(preloader)
    if (url) style[iconVar] = `url('${url}')`
  }

  if (prevClipEnd > -1) {
    style.marginLeft = pixelFromFrame(frame - prevClipEnd, scale, 'floor')
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

  const { className: propsClassName } = kid.props as WithClassName

  const calculatedClassName = (): string => {
    const selected = clip === selectedClip
    const classes: string[] = []
    if (propsClassName) classes.push(propsClassName)
    if (selected) classes.push(ClassSelected)
    if (droppingClip === clip) classes.push(droppingPositionClass(droppingPosition))

    // console.log("TimelineClip calculatedClassName", classes.join(' '))
    return classes.join(' ')
  }

  const className = React.useMemo(
    calculatedClassName, [droppingPosition, droppingClip, selectedClip]
  )

  const clipProps = {
    ...kid.props,
    style,
    className,
    onPointerDown, onDragStart, onDragEnd,
    onDragOver, onDragLeave, onDrop,
    onClick: (event: React.MouseEvent) => event.stopPropagation(),
    draggable: true,
    ref,
  }

  return React.cloneElement(kid, clipProps)
}
