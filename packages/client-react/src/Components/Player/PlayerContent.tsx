import React from 'react'
import { 
  assertTrue, EventType, PointZero, Rect, SelectType, Svgs, eventStop,
  ClassDropping, isDefined, sizeCopy
} from '@moviemasher/moviemasher.js'

import { PropsWithoutChild, ReactResult, WithClassName } from '../../declarations'
import { useEditor } from '../../Hooks/useEditor'
import { useListeners } from '../../Hooks/useListeners'
import { View } from '../../Utilities/View'
import { EditorContext } from '../../Components/Masher/EditorContext'
import { dragType, dragTypes, TransferTypeFiles } from '../../Helpers/DragDrop'
import { PlayerContext } from './PlayerContext'

export interface PlayerContentProps extends PropsWithoutChild, WithClassName {}
export function PlayerContent(props: PlayerContentProps): ReactResult {
  const { className, ...rest } = props

  const svgRef = React.useRef<SVGSVGElement>(null)

  const editorContext = React.useContext(EditorContext)
  const [over, setOver] = React.useState(false)
  const editor = useEditor()
  const playerContext = React.useContext(PlayerContext)

  const { disabled } = playerContext
  const { dropFiles } = editorContext
  // const [svgs, setSvgs] = React.useState<Svgs>([])
  const [rect, setRect] = React.useState<Rect>(() => ({ ...PointZero, ...editor.rect }))
  const ref = React.useRef<HTMLDivElement>(null)

  const handleResize = () => { 
    const { current } = ref
    assertTrue(current)

    const rect = current.getBoundingClientRect()
    const { x, y, width, height } = rect
    setRect(original => {
      original.width = width
      original.height = height
      original.x = x
      original.y = y
      editor.rect = { ...original }
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
    const svgs = await editor.svgItems(disabled)
    const { current } = svgRef
    if (current) current.replaceChildren(...svgs)
  }

  useListeners({ [EventType.Draw]: handleDraw, [EventType.Selection]: handleDraw })

  const dragValid = (dataTransfer?: DataTransfer | null): boolean => {
    if (!dataTransfer) return false

    const types = dragTypes(dataTransfer)
    if (types.includes(TransferTypeFiles)) {
      console.log("PlayerContent dragValid FILES", types)
      return true
    }

    const type = dragType(dataTransfer)
    if (isDefined(type)) {
      console.log("PlayerContent dragValid TYPE", type)
      return true
    }
    return false
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

  const svgProps = {
    ref: svgRef, ...sizeCopy(rect), viewBox: `0 0 ${rect.width} ${rect.height}`
  }

  const children = <svg { ...svgProps } />
  const viewProps = {
    ...rest, 
    className: classes.join(' '),
    key: 'player-content', ref, children, 
    onDragOver, onDrop, onDragLeave,
  }
  return <View { ...viewProps}/>
}
