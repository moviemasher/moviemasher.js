import React from 'react'
import { 
  assertContainer, assertTrue, EventType, PointZero, Rect, SelectType, Svgs, timeEqualizeRates, timeFromArgs, 
  Clip,
  eventStop,
  ClassDropping} from '@moviemasher/moviemasher.js'

import { PropsWithoutChild, ReactResult, WithClassName } from '../../declarations'
import { useEditor } from '../../Hooks/useEditor'
import { useListeners } from '../../Hooks/useListeners'
import { View } from '../../Utilities/View'
import { PlayerContentSvgProps, PlayerContentSvg } from './PlayerContentSvg'
import { EditorContext } from '../../Contexts/EditorContext'
import { dragTypes, TransferTypeFiles } from '../../Helpers/DragDrop'

export interface PlayerContentProps extends PropsWithoutChild, WithClassName {}
export function PlayerContent(props: PlayerContentProps): ReactResult {
  const { className, ...rest } = props
  const [over, setOver] = React.useState(false)
  const editor = useEditor()
  const editorContext = React.useContext(EditorContext)
  const { dropFiles } = editorContext
  const [svgs, setSvgs] = React.useState<Svgs>([])
  const [rect, setRect] = React.useState<Rect>(() => ({ ...PointZero, ...editor.imageSize}))
  const ref = React.useRef<HTMLDivElement>(null)

  const handleResize = () => { 
    const { current } = ref
    assertTrue(current)

    const rect = current.getBoundingClientRect()
    
    const { x, y, width, height } = rect

    setRect(original => {
      console.log("PlayerContent setRect", x, y, width, height)
      original.width = width
      original.height = height
      original.x = x
      original.y = y
      const size = { width, height }
      editor.imageSize = size
      return original
    })
  }
  const [resizeObserver] = React.useState(new ResizeObserver(handleResize))

  React.useEffect(() => {
    const { current } = ref
    if (current) resizeObserver.observe(current)
    return () => { resizeObserver.disconnect() }
  }, [])

  const handleDraw = async () => { 
    const svgs = await editor.svgs
    setSvgs(svgs) 
  }

  useListeners({ [EventType.Draw]: handleDraw, [EventType.Selection]: handleDraw })

  const onPointerDown = () => {
    // console.log("PlayerContent onPointerDown")
    editor.selection.unset(SelectType.Clip)
  }
 

  const svgChildren = svgs.map(svg => {
    const svgProps: PlayerContentSvgProps = {
      ...svg, key: svg.id, contentRect: rect,
    }
    return <PlayerContentSvg { ...svgProps } />
  })
  // console.log("PlayerContent", svgChildren.length, "svgChildren")
  const svgProps = {
    children: svgChildren,
    ...editor.imageSize, viewBox: `0 0 ${editor.imageSize.width} ${editor.imageSize.height}`

  }

  const dragValid = (dataTransfer?: DataTransfer | null): boolean => {
    if (!dataTransfer) return false

    return dragTypes(dataTransfer).includes(TransferTypeFiles)
  }


  const onDragLeave = (event: DragEvent): void => {
    eventStop(event)
    setOver(false)
  }

  const onDrop = (event: DragEvent): void => {
    onDragLeave(event)
    const { dataTransfer } = event
    if (!(dataTransfer && dragValid(dataTransfer))) return 

    const { files } = dataTransfer
    dropFiles(files)
  } 

  const onDragOver = (event: DragEvent) => {
    eventStop(event)
    setOver(dragValid(event.dataTransfer))
  }
  const classes: string[] = []
  if (className) classes.push(className)
  if (over) classes.push(ClassDropping)
  
  const children = <svg { ...svgProps } />
  const viewProps = {
    ...rest, 
    className: classes.join(' '),
    key: 'player-content', ref, onPointerDown, children, 
    onDragOver, onDrop,
  }
  return <View { ...viewProps}/>
}
