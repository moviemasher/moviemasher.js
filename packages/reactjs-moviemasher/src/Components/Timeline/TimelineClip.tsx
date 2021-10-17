import React from 'react'
import { DragSourceMonitor, useDrag } from 'react-dnd'
import {
  UnknownObject,
  Clip,
  pixelToFrame,
  TrackType,
} from '@moviemasher/moviemasher.js'

import { AppContext } from '../../AppContext'
import { DragClipProps, DragClipObject, DropClipsResult } from '../../declarations'
import { usePerFrame } from './usePerFrame'

interface TimelineClipProps extends UnknownObject {
  clip: Clip
  children: React.ReactElement
}

const TimelineClip: React.FC<TimelineClipProps> = props => {
  const { clip, className, children, ...propsRest } = props

  const perFrame = usePerFrame()
  const appContext = React.useContext(AppContext)
  const { masher, selectedClipIdentifier  } = appContext

  const classNamesState = () => {
    const classes = []
    if (className) classes.push(className)
    if (masher.isSelected(clip)) classes.push('moviemasher-selected')
    const names = classes.join(' ')
    // console.log("classNamesState", names)
    return names
  }

  const [classNames, setClassNames] = React.useState(classNamesState)

  const frameToIndex = (frame: number, clips: Clip[]) => {
    const { length } = clips
    if (!length) return 0

    const foundIndex = clips.findIndex(clip => frame < clip.frame + clip.frames)
    if (foundIndex > -1) return foundIndex
    return length
  }

  const item: DragClipObject = { type: clip.type }

  const [{isDragging}, drag] = useDrag(() => ({
    type: clip.trackType,
    item,
    collect: monitor => {
      const collectedProps: DragClipProps = {
        isDragging: !!monitor.isDragging(),
      }
      return collectedProps
    },
    end: (item : DragClipObject, monitor : DragSourceMonitor<DragClipObject, DropClipsResult>) => {
      if (!monitor.didDrop()) return

      const result = monitor.getDropResult()
      if (!result) return

      const { pixels, type, index } = result
      const frame = pixelToFrame(pixels, perFrame)
      console.log("TimelineClip.handleDrop pixels", pixels, "perFrame", perFrame, "frame", frame)
      const track = masher.mash.trackOfTypeAtIndex(type, index)
      const main = type === TrackType.Video && !index

      const frameOrIndex = main ? frameToIndex(frame, track.clips): frame

      masher.moveClips(clip, frameOrIndex, index)
    },
  }), [perFrame])


  const handleSelectedClip = () => {
    // console.log("handleSelectedClip")
    setClassNames(classNamesState())
  }
  const clipProps = {
    ...propsRest,
    className: classNames,
    onMouseDown: () => {//event: React.MouseEvent
      console.log("onMouseDown", clip)
      masher.selectClip(clip)//, event.shiftKey)
    },
    ref: drag,
  }

  React.useEffect(handleSelectedClip, [selectedClipIdentifier])

  return React.cloneElement(children, clipProps)
}

export { TimelineClip }
