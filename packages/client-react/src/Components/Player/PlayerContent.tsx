import React from 'react'
import { 
  EventType, Rect, eventStop, isDefinitionType, rectRound,
  ClassDropping, sizeAboveZero, UnknownObject, assertDefinitionType, 
  rectCopy, EditorIndex, assertObject, SelectType, EmptyMethod, 
} from '@moviemasher/moviemasher.js'

import {  
  PropsWithChildren, ReactResult, WithClassName 
} from '../../declarations'
import { 
  assertDragDefinitionObject, dragData, dragType, dragTypes, TransferTypeFiles 
} from '../../Helpers/DragDrop'
import { useEditor } from '../../Hooks/useEditor'
import { useListeners } from '../../Hooks/useListeners'
import { View } from '../../Utilities/View'
import { MasherContext } from '../Masher/MasherContext'
import { PlayerContext } from './PlayerContext'

export interface PlayerContentProps extends PropsWithChildren, WithClassName {}
const PlayerRefreshRate = 10

/**
 * @parents Player
 */
export function PlayerContent(props: PlayerContentProps): ReactResult {
  const { children, className, ...rest } = props
  
  const editor = useEditor()
  const [rect, setRect] = React.useState<Rect>(() => (rectCopy(editor.rect)))
  const svgRef = React.useRef<HTMLDivElement>(null)//SVGSVGElement
  const viewRef = React.useRef<HTMLDivElement>(null)
  const masherContext = React.useContext(MasherContext)
  const [over, setOver] = React.useState(false)
  const playerContext = React.useContext(PlayerContext)
  const { disabled } = playerContext
  const { drop } = masherContext
  const watchingRef = React.useRef<UnknownObject>({})
  const { current: watching } = watchingRef

  const handleResize = () => { 
    const { current } = viewRef
    if (!current) return
  
    const rect = rectRound(current.getBoundingClientRect())
    setRect(() => {
      editor.rect = rect
      return rectCopy(rect)
    })
  }

  const [resizeObserver] = React.useState(new ResizeObserver(handleResize))

  React.useEffect(() => {
    const { current } = viewRef
    if (current) resizeObserver.observe(current)
    return () => { resizeObserver.disconnect() }
  }, [])

  const swapChildren = (elements: Element[]) => {
    const { current } = svgRef
    if (!current) return

    current.replaceChildren(...elements)  
  }

  const requestItemsPromise = (): Promise<void> => {
    const { redraw } = watching
    delete watching.timeout 
    delete watching.redraw 

    return editor.previewItems(!disabled).then(svgs => {
   
      swapChildren(svgs)
      if (redraw) handleDraw()
    })
  }

  const requestItems = () => { requestItemsPromise().then(EmptyMethod) }

  const handleDraw = () => { 
    const { current } = svgRef
    const { rect } = editor
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
    
    return isDefinitionType(dragType(dataTransfer))
  }

  const onDragLeave = (event: DragEvent): void => {
    eventStop(event)
    setOver(false)
  }

  const onDrop = (event: DragEvent): void => {
    onDragLeave(event)
    const { dataTransfer } = event
    if (!dragValid(dataTransfer)) return 

    const { edited } = editor
    assertObject(edited, 'edited')
    const editorIndex: EditorIndex = {
      clip: editor.time.scale(edited.quantize).frame,
      track: -1,
    }
    const types = dragTypes(dataTransfer)
    if (types.includes(TransferTypeFiles)) {
      drop(dataTransfer.files, editorIndex)
    } else {
      const type = dragType(dataTransfer)
      assertDefinitionType(type)
      const data = dragData(dataTransfer, type)
      assertDragDefinitionObject(data)
      drop(data.mediaObject, editorIndex)
    }
  } 

  const onDragOver = (event: DragEvent) => {
    eventStop(event)
    setOver(dragValid(event.dataTransfer))
  }

  const classes: string[] = []
  if (className) classes.push(className)
  if (over) classes.push(ClassDropping)

  const viewProps: UnknownObject = {
    ...rest, ref: viewRef, 
    className: classes.join(' '),
    key: 'player-content', 
    onDragOver, onDrop, onDragLeave, 
    onPointerDown: () => { editor.selection.unset(SelectType.Clip) }
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
