import React from 'react'
import {
  UnknownObject, pixelFromFrame, DroppingPosition, ClassSelected, eventStop, 
  assertTrue,
  sizeAboveZero, svgPolygonElement,
  Size, EventType, isAboveZero, colorToRgb, colorRgbDifference, colorFromRgb, svgPatternElement, idGenerate, svgDefsElement, svgUrl, svgElement, sizeCeil, isEventType, isObject
} from '@moviemasher/moviemasher.js'

import { PropsWithoutChild, ReactResult, WithClassName } from '../../declarations'
import { DragSuffix, droppingPositionClass } from '../../Helpers/DragDrop'
import { TrackContext } from '../../Contexts/TrackContext'
import { TimelineContext } from '../Timeline/TimelineContext'
import { useEditor } from '../../Hooks/useEditor'
import { ClipContext } from './ClipContext'
import { View } from '../../Utilities/View'
import { useListeners } from '../../Hooks'

const ClipItemRefreshRate = 500

export interface ClipItemProps extends WithClassName, PropsWithoutChild {}
/**
 * @parents TimelineTrack
 */
export function ClipItem(props: ClipItemProps): ReactResult {
  const { className, ...rest } = props
  const svgRef = React.useRef<SVGSVGElement>(null)
  const viewRef = React.useRef<HTMLDivElement>(null)
  const editor = useEditor()
  const trackContext = React.useContext(TrackContext)
  const timelineContext = React.useContext(TimelineContext)
  const [nonce, setNonce] = React.useState(0)
  const updateNonce = () => { setNonce(new Date().valueOf()) }
  const watchingRef = React.useRef<UnknownObject>({})
  const { current: watching } = watchingRef
  const clipContext = React.useContext(ClipContext)
  const {
    droppingPosition, droppingClip, scale, selectedClip, onDrop,
    dragTypeValid, setDroppingPosition, setDroppingClip, setDroppingTrack, 
    onDragLeave,
  } = timelineContext
  const { track } = trackContext
  const { clip, prevClipEnd} = clipContext
  assertTrue(clip)

  const backgroundNode = (fill: string, size: Size, spacing: number) => {
    const rgb = colorToRgb(fill)
    const differenceRgb = colorRgbDifference(rgb)
    const forecolor = colorFromRgb(differenceRgb)
    const framePolygon = svgPolygonElement(size, '', fill)
    const spaceRect = { 
      x: size.width, y: 0,
      width: spacing, height: size.height, 
    }
    const spacePolygon = svgPolygonElement(spaceRect, '', forecolor)

    const patternSize = { 
      width: size.width + spacing, height: size.height
    }
    const patternId = idGenerate('pattern')
    const patternItems = [framePolygon, spacePolygon]
    const pattern = svgPatternElement(patternSize, patternId, patternItems)
    const defsElement = svgDefsElement([pattern])
    const patternedSize = { width: timelineContext.rect.width, height: parentHeight }
    const patternedPolygon = svgPolygonElement(patternedSize, '', svgUrl(patternId))
    return svgElement(patternedSize, [defsElement, patternedPolygon])
  }
  const getParentHeight = () => {
    const { current } = svgRef
    const parent = current?.parentNode
    if (parent instanceof HTMLDivElement) {

      return parent.offsetHeight // .getBoundingClientRect().height
    }
  
    // console.log("ClipItem.getParentHeight NO HEIGHT", !!current)
    return 0
  }

  const [parentHeight, setParentHeight] = React.useState(getParentHeight)

  const { label, type, frame, frames } = clip

  const getCurrentWidth = () => {
    if (!(isAboveZero(scale) && isAboveZero(frames))) {
      // console.log("ClipItem getCurrentWidth returing 0", scale, frames)
      return 0
    }

    const currentWidth = pixelFromFrame(frames, scale, 'floor')
    const { width } = watching
    if (currentWidth && currentWidth !== width) {
      watching.width = currentWidth
      updateNonce()
    }
    return currentWidth
  }

  const currentWidth = getCurrentWidth()

  const actionCallback = (event: Event) => { 
    // console.log("ClipItem actionCallback", event)
    if (watching.redraw) return
    
    const { type } = event
    if (!isEventType(type)) return
    if (!(event instanceof CustomEvent)) return
    if (type !== EventType.Action) return
    
    const { detail } = event
    if (!detail) return 
    
    const { action } = detail
    if (!action) return

    const { target } = action
    if (!isObject(target)) return

    switch(target) {
      case clip:
      case clip.container:
      case clip.content: break
      default: {
        if (action.property === 'color') break
        return
      }
    }    
    updateNonce()
  }

  useListeners({ [EventType.Action]: actionCallback, [EventType.Save]: updateNonce })

  const frameSize = () => {
    const { rect } = editor
    const size = { 
      width: parentHeight * (rect.width / rect.height), height: parentHeight
    }
    return sizeCeil(size)
  }

  const clipSize = (size: Size) => {
    const { width, height } = size
    return { width: Math.max(width, currentWidth), height }
  }

  const populateSvg = (): Promise<void> => {
    const { width, redraw } = watching
    delete watching.timeout 
    delete watching.redraw 
    
    const { current } = svgRef
    const { edited } = editor

    const allOk = current && edited && width && width === getCurrentWidth()
    if (redraw || !allOk) {
      updateNonce()
      if (!allOk) return Promise.resolve()
    }
    const currentSize = frameSize()
    const fullSize = clipSize(currentSize)
    
    // return Promise.resolve()
    
    const promise = clip.clipIcon(fullSize, timelineContext.scale, 2)
    if (!promise) return Promise.resolve()
    
    return promise.then(element => {
      const latestWidth = getCurrentWidth()
      if (element && width >= latestWidth) {
        // console.log("ClipItem.populateSvg replacing children", fullSize)
        current.replaceChildren(backgroundNode(edited.color, currentSize, 2), element)
      } //else console.log("ClipItem.populateSvg", !!element, width, ">= ?", latestWidth)
    })
  }
  
  const handleChange = () => {
    if (!parentHeight) {
      // console.log("ClipItem.handleChange no parentHeight")
      return setParentHeight(getParentHeight)
    }
     
    const { current } = svgRef
    const { edited } = editor
    if (!(current && edited)) return

    if (watching.timeout) {
      if (!watching.redraw) {
        // console.log("ClipItem.handleChange setting redraw", nonce, scale, parentHeight)
        watching.redraw = true
      }
      return
    }
    // // console.log("ClipItem.handleChange setting timeout", nonce, scale)
    watching.timeout = setTimeout(populateSvg, ClipItemRefreshRate)
  }

  React.useEffect(handleChange, [nonce, scale, parentHeight])
  
  const onPointerDown = (event: MouseEvent) => { 
    event.stopPropagation()
    editor.selection.set(clip) 
  }

  const onDragEnd = (event: DragEvent) => {
    eventStop(event)
    const { dataTransfer } = event
    if (!dataTransfer) return
    
    const { dropEffect } = dataTransfer
    if (dropEffect === 'none') {
      editor.removeClip(clip)
    }
  }

  const onDragStart = (event: DragEvent) => {
    onPointerDown(event)

    const { dataTransfer, clientX } = event
    const { current } = viewRef
    if (!(dataTransfer && current)) return

    const rect = current.getBoundingClientRect()
    const { left } = rect

    const data = { offset: clientX - left }
    const json = JSON.stringify(data)
    dataTransfer.effectAllowed = 'move'
    dataTransfer.setData(type + DragSuffix, json)
  }

  const onDragOver = (event: DragEvent) => {
    eventStop(event)
    const { dataTransfer } = event
    if (!dataTransfer) return

    const definitionType = dragTypeValid(dataTransfer, clip)
    const pos = definitionType ? DroppingPosition.At : DroppingPosition.None
    setDroppingTrack(definitionType ? track : undefined)
    setDroppingClip(definitionType ? clip : undefined)
    setDroppingPosition(pos)
  }

  const calculateClassName = (): string => {
    const selected = clip === selectedClip
    const classes: string[] = []
    if (className) classes.push(className)
    if (selected) classes.push(ClassSelected)
    if (droppingClip === clip) classes.push(droppingPositionClass(droppingPosition))

    // console.log("TimelineClip calculatedClassName", classes.join(' '))
    return classes.join(' ')
  }

  const childNodes = () => {
    const svgProps: UnknownObject = {
      key: "clip-previews", ref: svgRef
    }
    const size = { width: currentWidth, height: parentHeight }
    if (sizeAboveZero(size)) {
      const { width, height } = size
      svgProps.width = width
      svgProps.height = height
      svgProps.viewBox = `0 0 ${width} ${height}`
    }
    const nodes = [<svg { ...svgProps } />]
    if (label) nodes.unshift(<label key='label'>{label}</label>)
    return nodes
  }

  const style: UnknownObject = { width: currentWidth }
  if (prevClipEnd > -1) {
    style.marginLeft = pixelFromFrame(frame - prevClipEnd, scale, 'floor')
  }

  const clipProps = {
    ...rest,
    style,
    className: calculateClassName(),
    onPointerDown, onDragStart, onDragEnd,
    onDragOver, onDragLeave, onDrop,
    onClick: (event: React.MouseEvent) => event.stopPropagation(),
    draggable: true,
    ref: viewRef,
    children: childNodes()
  }

  return <View { ...clipProps } />
}
