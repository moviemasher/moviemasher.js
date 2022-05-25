import React from 'react'
import { UnknownObject, Clip, pixelFromFrame, DroppingPosition, isDefined } from '@moviemasher/moviemasher.js'

import { PropsAndChild, ReactResult, WithClassName } from '../../declarations'
import { Problems } from '../../Setup/Problems'
import { DragSuffix } from '../../Helpers/DragDrop'
import { TrackContext } from '../../Contexts/TrackContext'
import { TimelineContext } from '../../Contexts/TimelineContext'
import { EditorContext } from '../../Contexts/EditorContext'

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
    droppingPosition, droppingClip, scale, selectedClip,
    dragTypeValid, setDroppingPosition, setDroppingClip, setDroppingTrack, onDragLeave
  } = timelineContext
  const { track } = trackContext
  const { editor, selectedClass, droppingPositionClass } = editorContext

  if (!editor) return null

  const { icon: iconVar, label: labelVar, clip, prevClipEnd, children } = props
  const { label, type, frame, frames } = clip

  const kid = React.Children.only(children)
  if (!React.isValidElement(kid)) throw Problems.child

  const onMouseDown = () => { editor.select(clip) }

  const onDragEnd: React.DragEventHandler = event => {
    const { dataTransfer } = event
    const { dropEffect } = dataTransfer
    if (dropEffect === 'none') {
      editor.removeClip(clip)
    }
  }

  const onDragStart: React.DragEventHandler = event => {
    onMouseDown()
    const { dataTransfer, clientX } = event
    const rect = ref.current!.getBoundingClientRect()
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

  const onDragOver: React.DragEventHandler = event => {
    const { dataTransfer } = event
    const definitionType = dragTypeValid(dataTransfer, track)

    setDroppingTrack(definitionType ? track : undefined)
    setDroppingClip(definitionType ? clip : undefined)
    setDroppingPosition(definitionType ? DroppingPosition.At : DroppingPosition.None)

    event.stopPropagation()
    if (definitionType) event.preventDefault()
  }

  const { className: propsClassName } = kid.props as WithClassName

  const calculatedClassName = (): string => {
    const selected = clip === selectedClip
    const classes: string[] = []
    if (propsClassName) classes.push(propsClassName)
    if (selected) classes.push(selectedClass)
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
    onMouseDown, onDragStart, onDragEnd,
    onDragOver, onDragLeave,
    onClick: (event: React.MouseEvent) => event.stopPropagation(),
    draggable: true,
    ref,
  }

  return React.cloneElement(kid, clipProps)
}
