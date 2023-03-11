import React from 'react'
import { 
  EventType, Rect, eventStop, isMediaType, rectRound,
  ClassDropping, sizeAboveZero, UnknownRecord, assertMediaType, 
  rectCopy, MashIndex, assertObject, EmptyFunction, isMediaObject, ClipType, CurrentIndex, 
} from '@moviemasher/moviemasher.js'


import { PropsWithChildren } from "../../Types/Props"
import { 
  assertDragDefinitionObject, dragData, dragType, dragTypes, TransferTypeFiles 
} from '@moviemasher/client-core'
import { useMasher } from '../../Hooks/useMasher'
import { useListeners } from '../../Hooks/useListeners'
import { View } from '../../Utilities/View'
import MasherContext from '../Masher/MasherContext'
import { PlayerContext } from './PlayerContext'

const PlayerRefreshRate = 10

/**
 * @parents Player
 */
export function PlayerContent(props: PropsWithChildren) {
  const { children, className, ...rest } = props
  
  const masher = useMasher()
  const [rect, setRect] = React.useState<Rect>(() => (rectCopy(masher.rect)))
  const svgRef = React.useRef<HTMLDivElement>(null)//SVGSVGElement
  const viewRef = React.useRef<HTMLDivElement>(null)
  const masherContext = React.useContext(MasherContext)
  const [over, setOver] = React.useState(false)
  const playerContext = React.useContext(PlayerContext)
  const { disabled } = playerContext
  const { drop } = masherContext
  const watchingRef = React.useRef<UnknownRecord>({})
  const { current: watching } = watchingRef

  const handleResize = () => { 
    const { current } = viewRef
    if (!current) return
  
    const rect = rectRound(current.getBoundingClientRect())
    setRect(() => {
      masher.rect = rect
      return rectCopy(rect)
    })
  }

  const [resizeObserver] = React.useState(new ResizeObserver(handleResize))

  React.useEffect(() => {
    const { current } = viewRef
    if (current) resizeObserver.observe(current)
    return () => { resizeObserver.disconnect() }
  }, [resizeObserver])

  const swapChildren = (elements: Element[]) => {
    const { current } = svgRef
    if (!current) return

    current.replaceChildren(...elements)  
  }

  const requestItemsPromise = (): Promise<void> => {
    const { redraw } = watching
    delete watching.timeout 
    delete watching.redraw 

    return masher.previewItems(!disabled).then(svgs => {
   
      swapChildren(svgs)
      if (redraw) handleDraw()
    })
  }

  const requestItems = () => { requestItemsPromise().then(EmptyFunction) }

  const handleDraw = () => { 
    const { current } = svgRef
    const { rect } = masher
    if (!(current && sizeAboveZero(rect))) return

    if (watching.timeout) {
      watching.redraw = true
      return
    }
    watching.timeout = setTimeout(requestItems, PlayerRefreshRate)
  }

  useListeners({ [EventType.Draw]: handleDraw, [EventType.Selection]: handleDraw })

  const dragValid = (dataTransfer?: DataTransfer | null): dataTransfer is DataTransfer => {
    if (!dataTransfer) return false

    const types = dragTypes(dataTransfer)
    if (types.includes(TransferTypeFiles)) return true
    
    return isMediaType(dragType(dataTransfer))
  }

  const onDragLeave = (event: DragEvent): void => {
    eventStop(event)
    setOver(false)
  }

  const onDrop = (event: DragEvent): void => {
    onDragLeave(event)
    const { dataTransfer } = event
    if (!dragValid(dataTransfer)) return 
    
    const mashIndex: MashIndex = {
      clip: CurrentIndex,
      track: -1,
    }
    const types = dragTypes(dataTransfer)
    if (types.includes(TransferTypeFiles)) {
      drop(dataTransfer.files, mashIndex)
    } else {
      const type = dragType(dataTransfer)
      assertMediaType(type)
      const data = dragData(dataTransfer, type)
      assertDragDefinitionObject(data)
      const { mediaObject } = data
      if (isMediaObject(mediaObject)) drop(mediaObject, mashIndex)
    }
  } 

  const onDragOver = (event: DragEvent) => {
    eventStop(event)
    setOver(dragValid(event.dataTransfer))
  }

  const classes: string[] = []
  if (className) classes.push(className)
  if (over) classes.push(ClassDropping)

  const viewProps: UnknownRecord = {
    ...rest, ref: viewRef, 
    className: classes.join(' '),
    key: 'player-content', 
    onDragOver, onDrop, onDragLeave, 
    onPointerDown: () => { masher.selection.unset(ClipType) }
  }

  if (sizeAboveZero(rect)) {
    const svgProps = { ref: svgRef, key: "svg", className: 'svgs' }
    const nodes = [<div { ...svgProps } />]
    if (children) {
      const child = React.Children.only(children)
      if (React.isValidElement(child)) nodes.push(child)
    }
    viewProps.children = nodes 
  } 
  return <View { ...viewProps}/>
}
