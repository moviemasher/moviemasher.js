import React, { ReactChild, ReactElement, useEffect, useRef } from 'react'
import { useState } from 'react';
import { roundWithMethod, SelectionObject, Visible, Element } from '@moviemasher/moviemasher.js';
import { View } from '../View'

import { SliderChangeHandler } from '../declarations';

interface TimelineNodesCopy { copy : ReactChild }
interface TimelineNodesCut { cut : ReactChild }
interface TimelineNodesDelete { delete : ReactChild }

interface TimelineNodesPaste { paste : ReactChild }
interface TimelineNodesRedo { redo : ReactChild }
interface TimelineNodesRender { render : ReactChild }
interface TimelineNodesSave { save : ReactChild }
interface TimelineNodesSplit { split : ReactChild }
interface TimelineNodesUndo { undo : ReactChild }
interface TimelineNodesZoom { zoom : ReactElement }

interface TimelineObject {
  clipsSlice: (frame: number, frames: number) => Visible[]
  frames : number
  controls: {
    copy? : {
      setter: (selection : SelectionObject[]) => void
      element : ReactChild
    }
    cut? : {
      setter: (selection : SelectionObject[]) => void
      nodes : TimelineNodesCut
    }
    delete? : {
      nodes : TimelineNodesDelete
    }
    scrub? : {
      frame : number
      setter: (value: number) => void
      element : ReactElement
    }
    paste? : {
      nodes : TimelineNodesPaste
    }
    redo? : {
      nodes : TimelineNodesRedo
    }
    render? : {
      handler: () => void
      nodes : TimelineNodesRender
    }
    save? : {
      handler: () => void
      nodes : TimelineNodesSave
    }
    split? : {
      nodes : TimelineNodesSplit
    }
    undo? : {
      nodes : TimelineNodesUndo
    }
    zoom? : {
      nodes : TimelineNodesZoom
    }
  }
}



const pixelsPerFrame = (frames: number, width: number, zoom : number): number => {
  if (!(frames && width)) return 0
  const factor = (1.01 - Math.max(0.01, Math.min(1.0, zoom)))
  const factoredFrames = frames * factor
  const perFrame = width / factoredFrames
  console.log("pixelsPerFrame", perFrame, width, factoredFrames)
  return perFrame
}

const framePixel = (frame: number, frames : number, width : number, zoom : number, rounding = 'ceil'): number => {
  if (!frame) return 0;
  const perFrame = pixelsPerFrame(frames, width, zoom)
  if (!perFrame) return 0

  const pixels = frame * perFrame
  console.log("framePixel", pixels, frame, perFrame)
  return roundWithMethod(pixels, rounding)
}

const pixelFrame = (pixels: number, frames : number, width : number, zoom : number, rounding = 'round'): number => {
  if (!pixels) return 0

  const perFrame = pixelsPerFrame(frames, width, zoom)
  if (!perFrame) return 0

  return roundWithMethod(pixels / perFrame, rounding)
}

const Timeline : React.FC<TimelineObject> = (props) => {
  const scrubberReference = useRef<Element>(null)
  const contentReference = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(0.0)

  const nodes = []
  const controlNodes : ReactChild[] = []
  const { controls, clipsSlice, frames } = props
  const { scrub } = controls

  const handleClickCopy = () => {
    console.log("handleClickCopy")
  }
  const handleClickCut = () => {
    console.log("handleClickCut")
  }
  const handleClickDelete = () => {
    console.log("handleClickDelete")
  }
  const handleClickScrub = (event : React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget } = event
    console.log("handleClickFrame", currentTarget)
    // const number = typeof value === "number" ? value : value[0]
    // scrub.setter(number)
  }
  const handleClickPaste = () => {
    console.log("handleClickPaste")
  }
  const handleClickRedo = () => {
    console.log("handleClickRedo")
  }
  const handleClickRender = () => {
    console.log("handleClickRender")
  }
  const handleClickSave = () => {
    console.log("handleClickSave")
  }
  const handleClickSplit = () => {
    console.log("handleClickSplit")
  }
  const handleClickUndo = () => {
    console.log("handleClickUndo")
  }

  const controlNode = (key : string, child : ReactChild, handler: () => void) : ReactChild => {
    if (!React.isValidElement(child)) return key

    const attributes = {
      className: `moviemasher-${key} moviemasher-button`,
      key,
      onClick: handler,
     }
    return React.cloneElement(child, attributes)
  }

  if (controls.copy) controlNodes.push(controlNode('copy', controls.copy.element, handleClickCopy))
  if (controls.cut) controlNodes.push(controlNode('cut', controls.cut.nodes.cut, handleClickCut))
  if (controls.delete) controlNodes.push(controlNode('delete', controls.delete.nodes.delete, handleClickDelete))
  if (controls.paste) controlNodes.push(controlNode('paste', controls.paste.nodes.paste, handleClickPaste))
  if (controls.redo) controlNodes.push(controlNode('redo', controls.redo.nodes.redo, handleClickRedo))
  if (controls.render) controlNodes.push(controlNode('render', controls.render.nodes.render, handleClickRender))
  if (controls.save) controlNodes.push(controlNode('save', controls.save.nodes.save, handleClickSave))
  if (controls.split) controlNodes.push(controlNode('split', controls.split.nodes.split, handleClickSplit))
  if (controls.undo) controlNodes.push(controlNode('undo', controls.undo.nodes.undo, handleClickUndo))
  if (controlNodes.length) {
    nodes.push(<View key='controls' className="moviemasher-controls" children={controlNodes} />)
  }



  const contentWidth = (dontPad?: boolean) : number => {
    const { current } = contentReference
    const metrics = Element.scrollMetrics(current)
    if (!metrics) return 0

    const { width, padLeft, padRight } = metrics
    if (!width) return 0

    return width - (dontPad ? 0 : padLeft + padRight)
  }

  if (scrub) {
    const scrubX = (frame: number, frames: number): number => {
      const { current: currentScrubber } = scrubberReference
      const { current: currentContent } = contentReference
      if (!(currentScrubber && currentContent)) return 0

      const contentMetrics = Element.scrollMetrics(currentContent)
      const scrubMetrics = Element.scrollMetrics(currentScrubber)
      const parentMetrics = Element.scrollMetrics(currentScrubber.parentElement)
      if (!(contentMetrics && scrubMetrics && parentMetrics)) return 0


      const { width: scrubWidth } = scrubMetrics
      const { width: contentWidth, x: contentX, scrollLeft } = contentMetrics
      if (!(contentWidth && scrubWidth)) return 0

      const { x: parentX } = parentMetrics
      const scrubZeroX = parentX - (contentX + scrollLeft + (scrubWidth / 2))

      console.log("scrubX", scrubZeroX, "contentWidth", contentWidth)
      if (!(frame && contentWidth)) return scrubZeroX

      return scrubZeroX + framePixel(frame, frames, contentWidth, zoom)
    }

    const scrubOptions = {
      key: 'scrub-control',
      style: { left: scrubX(scrub.frame, frames) },
      className: 'moviemasher-scrub moviemasher-button',
      ref: scrubberReference,
    }
    const viewOptions = {
      key: 'scrub',
      children: React.cloneElement(scrub.element, scrubOptions),
      className: 'moviemasher-controls-scrub',
      onClick: handleClickScrub,
    }
    nodes.push(<View { ...viewOptions } />)
  }

  const contentNodes: ReactChild[] = []
  const { current } = contentReference
  const metrics = Element.scrollMetrics(current)

  if (metrics) {
    const { width, scrollLeft } = metrics
    const contentFrames = pixelFrame(width, frames, width, zoom)
    if (contentFrames) {
      const contentFrame = pixelFrame(scrollLeft, frames, width, zoom)
      const clips = clipsSlice(contentFrame, contentFrames)
      contentNodes.push(...clips.map(clip => {
        const clipOptions = {
          key: clip.identifier,
          className: 'moviemasher-clip',
          children: `${clip.label} ${clip.frame}:${clip.frames}`,
          style: {
            left: framePixel(clip.frame, frames, width, zoom),
            width: framePixel(clip.frames, frames, width, zoom)
          }
        }
        return <View {...clipOptions} />
      }))
    }
  }

  const contentViewOptions = {
    ref: contentReference,
    key: 'content',
    className: "moviemasher-content",
    children: contentNodes,
  }
  nodes.push(<View { ...contentViewOptions } />)

  const footerNodes = []

  if (controls.zoom) {
      const handleChangeZoom : SliderChangeHandler = (_event, value) => {
      const number = typeof value === "number" ? value : value[0]
      setZoom(number)
    }
    const zoomOptions = {
      key: 'zoom',
      value: zoom,
      min: 0,
      max: 1,
      className: 'moviemasher-zoom moviemasher-slider',
      step: 0.1,
      onChange: handleChangeZoom,
    }
    footerNodes.push(React.cloneElement(controls.zoom.nodes.zoom, zoomOptions))
  }
  if (footerNodes.length) {
    nodes.push(<View key='controls-footer' className="moviemasher-controls-footer" children={footerNodes} />)
  }

  // useEffect(() => {
  //   const { current: currentScrubber } = scrubberReference
  //   console.log("Timeline.useEffect", currentScrubber)
  //   if (!(currentScrubber)) return

  //   const [width, height] = elementDimensions(currentScrubber)

  //   console.log("Timeline.useEffect", width, height)
  //   if (!(width && height)) return

  //   setScrubberWidth(width)
  //   setScrubberHeight(height)

  //   const [parentWidth, parentHeight] = elementDimensions(currentScrubber)
  //   if (!(parentWidth && parentHeight)) return

  //   setScrubWidth(parentWidth)
  //   setScrubHeight(parentHeight)

  // }, [])
  return <View className='moviemasher-panel moviemasher-timeline' children={nodes} />
}

export {
  Timeline,
  TimelineObject,
  TimelineNodesCopy,
  TimelineNodesCut,
  TimelineNodesDelete,
  TimelineNodesPaste,
  TimelineNodesRedo,
  TimelineNodesRender,
  TimelineNodesSave,
  TimelineNodesSplit,
  TimelineNodesUndo,
  TimelineNodesZoom
}
