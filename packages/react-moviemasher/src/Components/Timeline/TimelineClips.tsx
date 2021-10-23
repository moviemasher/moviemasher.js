import React from 'react'
import { Clip, DefinitionType, DefinitionTypes, pixelFromFrame, pixelToFrame, TrackType, UnknownObject } from '@moviemasher/moviemasher.js'

import { View } from '../../Utilities/View'
import { MMContext } from '../App/MMContext'
import { TrackContext } from './TrackContext'
import { TimelineClip } from './TimelineClip'
import { DragClipObject } from '../../declarations'
import { useMashScale } from './useMashScale'
import { DragTypeSuffix } from '../../Setup/Constants'

interface TimelineClipsProps extends UnknownObject {
  children: React.ReactNode,
  label?: string,
  className?: string
  dropClass?: string
  selectClass?: string
}

const TimelineClips: React.FC<TimelineClipsProps> = props => {
  const appContext = React.useContext(MMContext)
  const trackContext = React.useContext(TrackContext)
  const [isOver, setIsOver] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const scale = useMashScale()

  const { masher } = appContext
  if (!masher) return null

  const { label: labelVar, dropClass, selectClass, className, children, ...rest } = props
  const kid = React.Children.only(children)
  if (!React.isValidElement(kid)) throw `TimelineClips`

  const { mash } = masher
  const { type, index } = trackContext

  const track = mash.trackOfTypeAtIndex(type, index)
  const { clips } = track
  const main = track.isMainVideo

  const childNodes = (): React.ReactElement[] => {
    // console.log("TimelineClips.childNodes")
    let frame = 0
    return clips.map(clip => {
      const { ...kidRest } = kid.props
      const { label } = clip
      const width = pixelFromFrame(clip.frames, scale, 'floor')
      const style: UnknownObject = { width }
      if (labelVar) style[labelVar] = `'${label.replace("'", "\\'")}'`
      if (!main) {
        style.marginLeft = pixelFromFrame(clip.frame - frame, scale, 'floor')
        frame = clip.frames + clip.frame
      }

      const clipProps = {
        ...kidRest,
        key: clip.identifier,
        style,
        clip,
        children: kid,
        selectClass,
      }

      return <TimelineClip {...clipProps} />
    })
  }

  const dropType = (dataTransfer: DataTransfer): string | undefined => {
    return dataTransfer.types.find(type => type.endsWith(DragTypeSuffix))
  }

  const dropAllowed = (dataTransfer: DataTransfer): boolean => {
    const type = dropType(dataTransfer)
    if (!type) return false

    if (!type.endsWith(DragTypeSuffix)) return true

    const [definitionType] = type.split('/')
    const clipIsTransition = definitionType === DefinitionType.Transition
    if (clipIsTransition) return main // transitions only allowed on main track

    const clipIsAudio = definitionType === DefinitionType.Audio
    const trackIsAudio = track.type === TrackType.Audio
    return clipIsAudio === trackIsAudio // audio clips only allowed on audio tracks
  }

  const dropClip = (dataTransfer: DataTransfer, offsetDrop: number) => {
    const type = dropType(dataTransfer)!
    const json = dataTransfer.getData(type)
    const data: DragClipObject = JSON.parse(json)

    const clip = masher.selectedClips[0]
    const { offset } = data
    const frame = pixelToFrame(offsetDrop - offset, scale)
    const frameOrIndex = main ? frameToIndex(frame, track.clips) : frame
    masher.moveClips(clip, frameOrIndex, index)
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
    if (type.endsWith(DragTypeSuffix)) dropClip(dataTransfer, offset)

    // TODO: handle other types
    event.preventDefault()
  }

  const classes = []
  if (className) classes.push(className)
  if (isOver && dropClass) classes.push(dropClass)
  const viewProps:UnknownObject = {
    ...rest,
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

export { TimelineClips }
