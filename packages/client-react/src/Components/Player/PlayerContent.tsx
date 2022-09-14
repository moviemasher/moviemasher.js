import React from 'react'
import { 
  EventType, Rect, eventStop, isDefinitionType, rectRound,
  ClassDropping, sizeCopy, sizeAboveZero, UnknownObject, assertDefinitionType, rectCopy, EditorIndex, assertObject, SelectType, idGenerate, 
} from '@moviemasher/moviemasher.js'

import { 
  PropsWithChildren,
  ReactResult, WithClassName 
} from '../../declarations'
import { useEditor } from '../../Hooks/useEditor'
import { useListeners } from '../../Hooks/useListeners'
import { View } from '../../Utilities/View'
import { EditorContext } from '../../Components/Masher/EditorContext'
import { assertDragDefinitionObject, dragData, dragType, dragTypes, 
  TransferTypeFiles 
} from '../../Helpers/DragDrop'
import { PlayerContext } from './PlayerContext'

export interface PlayerContentProps extends PropsWithChildren, WithClassName {}

/**
 * @parents Player
 */
export function PlayerContent(props: PlayerContentProps): ReactResult {
  const { children, className, ...rest } = props
  
  const editor = useEditor()
  const [rect, setRect] = React.useState<Rect>(() => (rectCopy(editor.rect)))
  const svgRef = React.useRef<SVGSVGElement>(null)
  const viewRef = React.useRef<HTMLDivElement>(null)
  const editorContext = React.useContext(EditorContext)
  const [over, setOver] = React.useState(false)
  const playerContext = React.useContext(PlayerContext)
  const { disabled } = playerContext
  const { drop } = editorContext
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

  const requestItems = () => {
    const { current } = svgRef
    assertObject(current)
    
    // const { rect } = editor
    const callId = idGenerate('svgItems')
    // console.log("PlayerContent.requestItems...", callId)
    return editor.svgItems(disabled).then(svgs => {
      // console.log("PlayerContent.requestItems!", callId)
      // current.replaceChildren()
      current.replaceChildren(...svgs)
      watching.drawing = false
      if (watching.redraw) handleDraw()
        // else 
      return callId
    })
    
  }

  const handleDraw = () => { 
    const { current } = svgRef
    const { rect } = editor
    if (!(current && sizeAboveZero(rect))) return

    if (watching.drawing) {
      watching.redraw = true
      return
    }
    watching.drawing = true
    watching.redraw = false

    requestItems()//.then(callId => console.log("PlayerContent.handleDraw resolved", callId))
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
    assertObject(edited)
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
      drop(data.definitionObject, editorIndex)
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
    const svgProps = { 
      ref: svgRef, ...sizeCopy(rect), 
      viewBox: `0 0 ${rect.width} ${rect.height}`,
      key: "svg",
    }
    const nodes = [<svg { ...svgProps } />]
      
    if (children) {
      const child = React.Children.only(children)
      if (React.isValidElement(child)) nodes.push(child)
    }
    viewProps.children = nodes 
  } 

  return <View { ...viewProps}/>
}
