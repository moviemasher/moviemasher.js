import React from 'react'
import {
  Rect, RectZero,
  Clip, DefinitionType, DroppingPosition, EventType, Track, pixelToFrame, Clips, pixelPerFrame, Point, eventStop, arrayLast, EditorIndex, assertPopulatedString, isPositive, assertClip} from '@moviemasher/moviemasher.js'

import { PropsAndChildren, ReactResult } from '../../declarations'
import { TimelineContext, TimelineContextInterface } from './TimelineContext'
import { useListeners } from '../../Hooks/useListeners'
import {
  dragTypes, isDragOffsetObject, isDragDefinitionObject, isTransferType, 
  dragDefinitionType, TransferTypeFiles, dragData
} from '../../Helpers/DragDrop'
import { useEditor } from '../../Hooks/useEditor'
import { EditorContext } from '../../Components/Masher/EditorContext'


export interface TimelineProps extends PropsAndChildren {}
export const TimelineDefaultZoom = 1.0
/**
 * @parents Masher
 * @children TimelineContent, TimelineZoomer
 */
export function Timeline(props: TimelineProps): ReactResult {
  const editor = useEditor()
  const editorContext = React.useContext(EditorContext)
  const { drop } = editorContext
  const currentFrame = () => { return editor.selection.mash?.frame || 0 }
  const currentFrames = () => { return editor.selection.mash?.frames || 0 }
  const [frames, setFrames] = React.useState(currentFrames)
  const [frame, setFrame] = React.useState(currentFrame)
  const updateFrames = () => { setFrames(currentFrames()) }
  const updateFrame = () => { setFrame(currentFrame()) }

  const [droppingPosition, setDroppingPosition] = React.useState<DroppingPosition | number>(DroppingPosition.None)
  const [droppingTrack, setDroppingTrack] = React.useState<Track | undefined>()
  const [droppingClip, setDroppingClip] = React.useState<Clip | undefined>()
  const [selectedTrack, setSelectedTrack] = React.useState<Track | undefined>()
  const [refreshed, setRefreshed] = React.useState(0)
  const [selectedClip, setSelectedClip] = React.useState<Clip | undefined>()
  const [zoom, setZoom] = React.useState(TimelineDefaultZoom)
  const [rect, setRect] = React.useState<Rect>(RectZero)
  const [scroll, setScroll] = React.useState<Point>(RectZero)
  const refresh = () => { setRefreshed(value => value + 1) }

  useListeners({
    [EventType.Mash]: () => { setZoom(TimelineDefaultZoom) },
    [EventType.Action]: refresh,
    [EventType.Selection]: () => {
      setSelectedClip(editor.selection.clip)
      setSelectedTrack(editor.selection.track)
    },
    [EventType.Time]: updateFrame,
    [EventType.Duration]: updateFrames,
  }, editor.eventTarget)

  const dragTypeValid = (dataTransfer: DataTransfer, clip?: Clip): boolean => {
    const types = dragTypes(dataTransfer)
    // any file can be dropped
    if (types.includes(TransferTypeFiles)) return true

    const type = types.find(isTransferType)
    if (!type) return false

    // anything can be dropped on a clip 
    if (clip) return true

    // effects can only be dropped on clips
    const definitionType = dragDefinitionType(type)
    return definitionType !== DefinitionType.Effect
  }

  const onDragLeave = (event: DragEvent) => {
    eventStop(event)
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

  const onDrop = (event: DragEvent) => {
    eventStop(event)
    const { dataTransfer, clientX } = event 
    if (!(dataTransfer && dragTypeValid(dataTransfer, droppingClip))) {
      console.log("Timeline onDrop invalid", dataTransfer?.types, !!droppingClip)
      return
    }
    const types = dragTypes(dataTransfer)
    const droppingFiles = types.includes(TransferTypeFiles)

    const dense = !!droppingTrack?.dense
    const index = droppingTrack ? droppingTrack.index : -1
    const clips = droppingTrack?.clips || []

    const data = droppingFiles ? {} : dragData(dataTransfer)
    const draggingItem = !droppingFiles && isDragOffsetObject(data)
    const offset = draggingItem ? data.offset : 0

    let indexDrop = dropIndex(dense, clips)
    if (!isPositive(indexDrop)) {
      const offsetDrop = clientX - rect.x
      const frame = pixelToFrame(Math.max(0, scroll.x + (offsetDrop - offset)), scale)
      indexDrop = dense ? frameToIndex(frame, clips) : frame
    }
    const editorIndex: EditorIndex = { clip: indexDrop, track: index }

    if (droppingFiles) {
      drop(dataTransfer.files, editorIndex)
    } else if (draggingItem) {
      if (isDragDefinitionObject(data)) {
        const { definitionObject } = data
        console.log("Timeline onDrop definition", definitionObject)
        drop(definitionObject, editorIndex)
      } else {
        const { clip } = editor.selection
        assertClip(clip)
        
        console.log("Timeline onDrop moving clip", editorIndex, clip.content.definition.label)
        editor.moveClip(clip, editorIndex)
      }
    } 
    onDragLeave(event)
  }

  const { width } = rect

  const calculatedScale = (): number => {
    const scale = width ? pixelPerFrame(frames, width, zoom) : 0
    // console.log("calculatedScale", scale, "frames", frames, "width", width, 'zoom', zoom)
    return scale
  }

  const scale = React.useMemo(calculatedScale, [zoom, width, frames])

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
    frame, frames, 
  }

  return <TimelineContext.Provider value={timelineContext} children={props.children} />
}
