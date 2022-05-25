import React from 'react'
import {
  Rect, EmptyRect,
  Clip, DefinitionType, DroppingPosition, EventType, isDefinitionType,
  Track, TrackType, pixelToFrame, Clips, pixelPerFrame, Point} from '@moviemasher/moviemasher.js'

import { PropsAndChildren, ReactResult } from '../../declarations'
import { TimelineContext, TimelineContextInterface } from '../../Contexts/TimelineContext'
import { useListeners } from '../../Hooks/useListeners'
import {
  DragSuffix, dragType, isDragClipObject, isDragDefinitionObject
} from '../../Helpers/DragDrop'
import { EditorContext } from '../../Contexts/EditorContext'
import { useEditor } from '../../Hooks/useEditor'


export interface TimelineProps extends PropsAndChildren {}
export const TimelineDefaultZoom = 1.0
/**
 * @parents Masher, Caster
 * @children TimelineContent, TimelineZoomer
 */
export function Timeline(props: TimelineProps): ReactResult {
  const editorContext = React.useContext(EditorContext)
  const [droppingPosition, setDroppingPosition] = React.useState<DroppingPosition | number>(DroppingPosition.None)
  const [droppingTrack, setDroppingTrack] = React.useState<Track | undefined>()
  const [droppingClip, setDroppingClip] = React.useState<Clip | undefined>()
  const [selectedTrack, setSelectedTrack] = React.useState<Track | undefined>()
  const [refreshed, setRefreshed] = React.useState(0)
  const [selectedClip, setSelectedClip] = React.useState<Clip | undefined>()
  const [zoom, setZoom] = React.useState(TimelineDefaultZoom)
  const [rect, setRect] = React.useState<Rect>(EmptyRect)
  const [scroll, setScroll] = React.useState<Point>(EmptyRect)
  const refresh = () => { setRefreshed(value => value + 1) }

  const editor = useEditor()
  useListeners({
    [EventType.Mash]: () => { setZoom(TimelineDefaultZoom) },
    [EventType.Action]: refresh,
    [EventType.Selection]: () => {
      setSelectedClip(editor.selection.clip)
      setSelectedTrack(editor.selection.track)
    },
  })

  const { frame, frames } = editorContext

  const dragTypeValid = (dataTransfer: DataTransfer, track?: Track): DefinitionType | undefined => {
    // TODO: support auto-creation of tracks
    if (!track) return

    const type = dragType(dataTransfer)
    if (!isDefinitionType(type)) return

    const { trackType } = track
    if (String(type) === String(trackType)) return type // audio, video, transition

    if ([TrackType.Transition, TrackType.Audio].includes(trackType)) return

    return type
  }

  const onDragLeave = () => {
    setDroppingPosition(DroppingPosition.None)
    setDroppingTrack(undefined)
    setDroppingClip(undefined)
  }

  const frameToIndex = (frame: number, clips: Clips) => {
    const { length } = clips
    if (!length) return 0

    const foundIndex = clips.findIndex(clip => frame < clip.frame + clip.frames)
    if (foundIndex > -1) return foundIndex

    return length
  }

  const dropIndex = (dense: boolean, clips: Clips) => {
    if (!dense) return -1
    if (!droppingClip) return 0

    const clipIndex = clips.indexOf(droppingClip)
    if (droppingPosition === DroppingPosition.After) return clipIndex + 1
    return clipIndex
  }

  const onDrop: React.DragEventHandler = event => {
    if (!droppingTrack) {
      console.error("no droppingTrack")
      return
    }
    const { dataTransfer, clientX } = event
    const definitionType = dragTypeValid(dataTransfer, droppingTrack)
    if (!definitionType) {
      console.error("no definitionType", dragType(dataTransfer))
      return
    }

    const offsetDrop = clientX - rect.x
    const json = dataTransfer.getData(definitionType + DragSuffix)
    const data = JSON.parse(json)
    if (isDragClipObject(data)) {
      const { offset } = data
      const { dense, clips, layer } = droppingTrack
      let index = dropIndex(dense, clips)
      if (index < 0) {
        const frame = pixelToFrame(Math.max(0, scroll.x + (offsetDrop - offset)), scale)
        index = dense ? frameToIndex(frame, clips) : frame
      }
      if (isDragDefinitionObject(data)) {
        const { definitionObject } = data
        editor.add(definitionObject, index, layer)
      } else {
        editor.moveClip(editor.selection.clip!, index, layer)
      }
    }
    onDragLeave()
    // TODO: handle other types
    event.preventDefault()
    event.stopPropagation()
  }

  const calculatedScale = (): number => {
    const { width } = rect
    // console.log("calculatedScale width", width, "frames", frames, 'zoom', zoom)
    if (!width) return 0

    return pixelPerFrame(frames, width, zoom)
  }

  const scale = React.useMemo(calculatedScale, [zoom, rect, frame, frames])

  const timelineContext: TimelineContextInterface = {
    scroll, setScroll,
    scale, refreshed, refresh,
    zoom, setZoom,
    rect, setRect,
    droppingTrack, setDroppingTrack,
    droppingClip, setDroppingClip,
    droppingPosition, setDroppingPosition,
    onDragLeave, onDrop, dragTypeValid,
    selectedClip, selectedTrack,
  }

  return <TimelineContext.Provider value={timelineContext} children={props.children} />
}
