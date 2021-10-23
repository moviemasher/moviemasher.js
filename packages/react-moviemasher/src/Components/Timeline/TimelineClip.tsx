import React from 'react'
import {
  UnknownObject,
  Clip,
} from '@moviemasher/moviemasher.js'

import { MMContext } from '../App/MMContext'
import { MasherContext } from '../App/MasherContext'
import { DragClipObject } from '../../declarations'
import { DragTypeSuffix } from '../../Setup/Constants'

interface TimelineClipProps extends UnknownObject {
  clip: Clip
  children: React.ReactElement
  selectClass?: string
}

const TimelineClip: React.FC<TimelineClipProps> = props => {
  const { clip, className, selectClass, children, ...propsRest } = props
  const ref = React.useRef<HTMLDivElement>(null)
  const appContext = React.useContext(MMContext)
  const masherContext = React.useContext(MasherContext)

  const { selectedClipIdentifier  } = masherContext
  const classNamesState = () => {
    const classes = []
    if (className) classes.push(className)
    if (selectClass && clip.identifier === selectedClipIdentifier) {
      classes.push(selectClass)
    }
    const names = classes.join(' ')
    return names
  }

  const [classNames, setClassNames] = React.useState(classNamesState)
  const [clickOffset, setClickOffset] = React.useState(0)

  const handleSelectedClip = () => { setClassNames(classNamesState()) }

  const onMouseDown = (event: React.MouseEvent) => {
    const { current } = ref
    if (!current) return

    const rect = current.getBoundingClientRect()
    const { left } = rect
    const { clientX } = event // , shiftKey

    setClickOffset(clientX - left)

    appContext.masher?.selectClip(clip) //, shiftKey)
  }

  const onDragStart: React.DragEventHandler = event => {
    onMouseDown(event)
    const data: DragClipObject = { offset: clickOffset }
    const json = JSON.stringify(data)
    const { dataTransfer } = event
    dataTransfer.effectAllowed = 'move'
    dataTransfer.setData(clip.type + DragTypeSuffix, json)
  }

  React.useEffect(handleSelectedClip, [selectedClipIdentifier])

  const clipProps = {
    ...propsRest,
    className: classNames,
    onMouseDown,
    onDragStart,
    draggable: true,
    ref,
  }

  return React.cloneElement(children, clipProps)
}

export { TimelineClip }
