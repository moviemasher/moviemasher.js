import React, { useRef } from 'react'
import ReactDOM from 'react-dom'
import { DropTargetMonitor, useDrop } from 'react-dnd'
import { DefinitionType, pixelToFrame, pixelFromFrame, TrackType, UnknownObject } from '@moviemasher/moviemasher.js'

import { View } from '../../View'
import { AppContext } from '../../AppContext'
import { TrackContext } from './TrackContext'
import { TimelineClip } from './TimelineClip'
import { DragClipObject, DropClipsMonitor, DropClipsProps, DropClipsResult } from '../../declarations'
import { usePerFrame } from './usePerFrame'

const TimelineClips: React.FC<UnknownObject> = props => {
  const { className, children, ...rest } = props
  const ref = useRef<HTMLDivElement>(null)
  const perFrame = usePerFrame()

  const appContext = React.useContext(AppContext)
  const trackContext = React.useContext(TrackContext)
  const { type, index } = trackContext
  console.log("TimelineClips perFrame", perFrame)

  const track = appContext.masher.mash.trackOfTypeAtIndex(type, index)
  const main = track.isMainVideo
  const { clips } = track





  const canDrop = (item : DragClipObject) => {
    if (item.type === DefinitionType.Transition) return main

    return true
  }
  const collect = (monitor:DropClipsMonitor): DropClipsProps => {
    return { isOver: !!monitor.isOver() }
  }
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: type,
    canDrop,
    drop: (item : DragClipObject, monitor: DropClipsMonitor) => {
      const xy = monitor.getClientOffset()
      if (!xy) return
      // const { perFrame } = item
      const { x } = xy
      const { current } = ref
      if (!current) return

      const rect = current.getBoundingClientRect()
      const pixels = x - rect.x

      // console.log("TimelineClips.drop perFrame", perFrame)

      // const frame = pixelToFrame(pixel, perFrame)

      // console.log("TimelineClips.drop pixel", pixel, "frame", frame, "perFrame", contextPerFrame)
      // const frameOrIndex = main ? frameToIndex(frame): frame
      return { type, index, pixels }
    },
    collect,
  }), [])


  // if (!perFrame) return null

  const kid = React.Children.only(children)
  if (!React.isValidElement(kid)) throw `TimelineClips`

  const clipNodes = (): React.ReactElement[] => {
    let frame = 0
    return clips.map(clip => {
      const { label: labelVar, ...kidRest } = kid.props
      const { label } = clip
      const width = pixelFromFrame(clip.frames, perFrame, 'floor')
      const style: UnknownObject = {
        width,
        [labelVar]: `'${label.replace("'", "\\'")}'`,
      }
      if (index || type === TrackType.Audio) {
        style.marginLeft = pixelFromFrame(clip.frame - frame, perFrame, 'floor')
        frame = clip.frames + clip.frame
      }

      const clipProps = {
        ...kidRest,
        key: clip.identifier,
        style,
        clip,
        children: kid,
      }

      return <TimelineClip {...clipProps} />
    })
  }

  const classes = []
  if (className) classes.push(className)
  if (isOver) classes.push('moviemasher-drop')
  const viewProps:UnknownObject = {
    ...rest,
    className: classes.join(' '),
    children: clipNodes(),
    ref: dropRef,
   }

  const containerProps = {
    ref,
    children: <View {...viewProps}/>
  }
  return <View {...containerProps}/>
}

export { TimelineClips }
