import { PositionAfter, PositionNone } from '@moviemasher/client-core'
import type { Position } from '@moviemasher/client-core'
import React from 'react'
import {
  Rect, RectZero, Clip,  Track, pixelToFrame, Clips, 
  Point, eventStop, MashIndex, isPositive, assertClip, 
  isMediaObject, TypeEffect, EventTypeLoaded, EventTypeAction, EventTypeDuration, EventTypeSelection, EventTypeTime
} from '@moviemasher/lib-core'


import { PropsAndChildren } from "../../Types/Props"
import { TimelineContext, TimelineContextInterface } from './TimelineContext'
import { useListeners } from '../../Hooks/useListeners'
import {
  dragTypes, isDragOffsetObject, isDragDefinitionObject, isTransferType, 
  dragMediaType, TransferTypeFiles, dragData, pixelPerFrame
} from '@moviemasher/client-core'
import { useMasher } from '../../Hooks/useMasher'
import MasherContext from '../Masher/MasherContext'
import { View } from '../../Utilities/View'



export interface TimelineProps extends PropsAndChildren {}
export const TimelineDefaultZoom = 1.0
/**
 * @parents MasherApp
 * @children TimelineContent, TimelineZoomer
 */
export function Timeline(props: TimelineProps) {
  const editor = useMasher()
  const masherContext = React.useContext(MasherContext)
  const { drop } = masherContext
  const currentFrame = () => { return editor.selection.mash?.frame || 0 }
  const currentFrames = () => { return editor.selection.mash?.frames || 0 }
  const [frames, setFrames] = React.useState(currentFrames)
  const [frame, setFrame] = React.useState(currentFrame)
  const updateFrames = () => { setFrames(currentFrames()) }
  const updateFrame = () => { setFrame(currentFrame()) }

  const [droppingPosition, setDroppingPosition] = React.useState<Position | number>(PositionNone)
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
    [EventTypeLoaded]: () => { setZoom(TimelineDefaultZoom) },
    [EventTypeAction]: refresh,
    [EventTypeSelection]: () => {
      setSelectedClip(editor.selection.clip)
      setSelectedTrack(editor.selection.track)
    },
    [EventTypeTime]: updateFrame,
    [EventTypeDuration]: updateFrames,
  })

  const dragTypeValid = (dataTransfer: DataTransfer, clip?: Clip): boolean => {
    const types = dragTypes(dataTransfer)
    // any file can be dropped
    if (types.includes(TransferTypeFiles)) return true

    const type = types.find(isTransferType)
    if (!type) return false

    // anything can be dropped on a clip 
    if (clip || type.startsWith('clip')) return true

    // effects can only be dropped on clips
    const definitionType = dragMediaType(type)
    return definitionType !== TypeEffect
  }

  const onDragLeave = (event: DragEvent) => {
    eventStop(event)
    setDroppingPosition(PositionNone)
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
    if (droppingPosition === PositionAfter) return clipIndex + 1
    return clipIndex
  }

  const onDrop = (event: DragEvent) => {
    eventStop(event)
    const { dataTransfer, clientX } = event 
    console.log("Timeline onDrop", dataTransfer?.types)

    if (!(dataTransfer && dragTypeValid(dataTransfer, droppingClip))) {
      console.log("Timeline onDrop invalid", dataTransfer?.types, !!droppingClip)
      return
    }
    console.log("Timeline onDrop", dataTransfer.types, droppingClip)

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
    const editorIndex: MashIndex = { clip: indexDrop, track: index }

    if (droppingFiles) {
      drop(dataTransfer.files, editorIndex)
    } else if (draggingItem) {
      console.log("onDrop", data)
      if (isDragDefinitionObject(data)) {
        const { mediaObject } = data
        if (isMediaObject(mediaObject)) drop(mediaObject, editorIndex)
        // console.log("Timeline onDrop definition", definitionObject)
        
      } else {
        const { clip } = editor.selection
        assertClip(clip)
        
        // console.log("Timeline onDrop moving clip", editorIndex, clip.content.definition.label)
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

  const contextProps = {
    children: <View {...props} />,
    value: timelineContext
  }
  return <TimelineContext.Provider { ...contextProps } />
}
