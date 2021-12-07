import React from 'react'
import { UnknownObject, Clip, pixelFromFrame, EventType, Masher } from '@moviemasher/moviemasher.js'

import { DragTypeSuffix } from '../../Setup/Constants'
import { useMashScale } from '../../Hooks/useMashScale'
import { useListeners } from '../../Hooks/useListeners'
import { OnlyChildProps } from '../../declarations'

interface TimelineClipProps extends UnknownObject, OnlyChildProps {
  clip: Clip
  selectClass?: string
  prevClipEnd: number
  label?: string
}

const TimelineClip: React.FC<TimelineClipProps> = props => {
  const ref = React.useRef<HTMLDivElement>(null)
  const [clickOffset, setClickOffset] = React.useState(0)
  const scale = useMashScale()
  // const selectedId = (masher: Masher): string => masher.selection.clip?.id || ''
  const { masher } = useListeners({
    [EventType.Selection]: masher => {
      setSelectedClipIdentifier(masher.selection.clip?.id || '')
    }
  })

  const [selectedClipIdentifier, setSelectedClipIdentifier] = React.useState(() => masher.selection.clip?.id || '')

  const { label: labelVar, clip, prevClipEnd, selectClass, children } = props
  const { label, id, type, frame, frames } = clip

  const kid = React.Children.only(children)
  if (!React.isValidElement(kid)) throw `TimelineClip expects single child element`

  const classNamesState = () => {
    const classes = []
    const { className } = kid.props
    if (className) classes.push(className)
    if (selectClass && id === selectedClipIdentifier) {
      classes.push(selectClass)
    }
    return classes.join(' ')
  }

  const onMouseDown = (event: React.MouseEvent) => {
    const { current } = ref
    if (!current) return

    const rect = current.getBoundingClientRect()
    const { left } = rect
    const { clientX } = event
    setClickOffset(clientX - left)
    masher.selectClip(clip)
  }

  const onDragStart: React.DragEventHandler = event => {
    onMouseDown(event)
    const data = { offset: clickOffset }
    const json = JSON.stringify(data)
    const { dataTransfer } = event
    dataTransfer.effectAllowed = 'move'
    dataTransfer.setData(type + DragTypeSuffix, json)
  }

  const width = pixelFromFrame(frames, scale, 'floor')
  const style: UnknownObject = { width }
  if (labelVar) style[labelVar] = `'${label.replace("'", "\\'")}'`
  if (prevClipEnd > -1) {
    style.marginLeft = pixelFromFrame(frame - prevClipEnd, scale, 'floor')
  }

  const clipProps = {
    ...kid.props,
    style,
    className: classNamesState(),
    onMouseDown,
    onDragStart,
    onClick: (event: React.MouseEvent) => event.stopPropagation(),
    draggable: true,
    ref,
  }

  return React.cloneElement(kid, clipProps)
}

export { TimelineClip }
