import React from 'react'
import { Clip, pixelToFrame, TrackType, UnknownObject } from '@moviemasher/moviemasher.js'

import { View } from '../../../Utilities/View'
import { TrackContext } from '../../../Contexts/TrackContext'
import { TimelineClip } from './TimelineClip'
import { DragClipObject, ReactResult } from '../../../declarations'
import { useMashScale } from '../../../Hooks/useMashScale'
import { DragSuffix } from '../../../Setup/Constants'
import { useMashEditor } from '../../../Hooks/useMashEditor'

interface TimelineClipsProps extends UnknownObject {
  children: React.ReactNode
  label?: string
  className?: string
  dropClass?: string
  selectClass?: string
}

/**
 * @parents TimelineContent
 */
function TimelineClips(props: TimelineClipsProps): ReactResult {
  const trackContext = React.useContext(TrackContext)
  const [isOver, setIsOver] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const scale = useMashScale()

  const masher = useMashEditor()
  if (!masher) return null

  const { dropClass, className, children, ...rest } = props
  const kid = React.Children.only(children)
  if (!React.isValidElement(kid)) throw `TimelineClips`

  const { mash } = masher
  const { trackType, layer } = trackContext

  const track = mash.trackOfTypeAtIndex(trackType, layer)
  const { clips, dense } = track

  const childNodes = (): React.ReactElement[] => {
    let prevClipEnd = dense ? -1 : 0
    return clips.map(clip => {
      const clipProps = {
        ...rest,
        prevClipEnd,
        key: clip.id,
        clip,
        children: kid,
      }
      if (!dense) prevClipEnd = clip.frames + clip.frame
      return <TimelineClip {...clipProps} />
    })
  }

  const dropType = (dataTransfer: DataTransfer): string | undefined => {
    return dataTransfer.types.find(type => type.endsWith(DragSuffix))
  }

  const dropAllowed = (dataTransfer: DataTransfer): boolean => {
    const type = dropType(dataTransfer)
    // console.log("dropAllowed", trackType, type)
    if (!type) return false

    if (!type.endsWith(DragSuffix)) return true

    const [definitionType] = type.split('/')
    if (definitionType === String(trackType)) return true

    if (trackType !== TrackType.Video) return false

    return ![TrackType.Transition, TrackType.Audio].map(String).includes(definitionType)
  }

  const dropClip = (dataTransfer: DataTransfer, offsetDrop: number) => {
    const type = dropType(dataTransfer)!

    const json = dataTransfer.getData(type)
    const data: DragClipObject = JSON.parse(json)

    const { offset, definition } = data
    const frame = pixelToFrame(Math.max(0, offsetDrop - offset), scale)
    const frameOrIndex = dense ? frameToIndex(frame, track.clips) : frame

    if (typeof definition === 'undefined') {
      const clip = masher.selection.clip
      if (!clip) return

      masher.moveClip(clip, frameOrIndex, layer)
    } else {
      masher.add(definition, frameOrIndex, layer)
    }
  }

  const dropOffset = (clientX: number) => {
    const { current } = ref
    if (!current) return 0

    const rect = current.getBoundingClientRect()
    return clientX - rect.x
  }

  const frameToIndex = (frame: number, clips: Clip[]) => {
    const { length } = clips
    if (!length) return 0

    const foundIndex = clips.findIndex(clip => frame < clip.frame + clip.frames)
    if (foundIndex > -1) return foundIndex

    return length
  }

  const onDragOver: React.DragEventHandler = event => {
    const { dataTransfer } = event
    const allowed = dropAllowed(dataTransfer)
    setIsOver(allowed)
    if (allowed) event.preventDefault()
  }

  const onDragLeave: React.DragEventHandler = () => {
    setIsOver(false)
  }

  const onDrop: React.DragEventHandler = event => {
    setIsOver(false)
    const { dataTransfer, clientX } = event
    const type = dropType(dataTransfer)
    if (!type) return

    const offset = dropOffset(clientX)
    if (type.endsWith(DragSuffix)) dropClip(dataTransfer, offset)

    // TODO: handle other types
    event.preventDefault()
  }

  const classes = []
  if (className) classes.push(className)
  if (isOver && dropClass) classes.push(dropClass)
  const viewProps:UnknownObject = {
    className: classes.join(' '),
    children: childNodes(),
    ref,
    onDragLeave,
    onDragOver,
    onDrop,
  }
  // console.log("TimelineClips")
  return <View {...viewProps}/>
}

export { TimelineClips, TimelineClipsProps }
