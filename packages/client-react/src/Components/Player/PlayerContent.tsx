import React from 'react'
import { ContextFactory, EventType } from '@moviemasher/moviemasher.js'

import { PropsWithoutChild, ReactResult } from '../../declarations'
import { CanvasView, CanvasViewProps } from '../../Utilities/CanvasView'
import { useEditor } from '../../Hooks/useEditor'

export function PlayerContent(props: PropsWithoutChild): ReactResult {
  const editor = useEditor()
  const ref = React.useRef<HTMLCanvasElement>(null)

  const handleResize = () => {
    const { current } = ref
    if (!current) return

    const rect = current.getBoundingClientRect()
    current.width = rect.width
    current.height = rect.height
    editor.imageSize = rect
  }

  const [resizeObserver] = React.useState(new ResizeObserver(handleResize))

  React.useEffect(() => {
    const { current } = ref
    if (current) resizeObserver.observe(current)
    return () => { resizeObserver.disconnect() }
  }, [])

  const handleDraw = () => {
    const { current } = ref
    if (!current) return

    const imageData = editor.imageData
    const context = ContextFactory.fromCanvas(current)
    context.drawImageData(imageData)
  }

  const removeListeners = () => {
    const { eventTarget } = editor
    eventTarget.removeEventListener(EventType.Draw, handleDraw)
  }

  const addListeners = () => {
    const { eventTarget } = editor
    eventTarget.addEventListener(EventType.Draw, handleDraw)
    return () => { removeListeners() }
  }

  React.useEffect(() => addListeners(), [])
  const { children, selectClass, ...rest } = props
  const canvasProps:CanvasViewProps = { ...rest, key: 'canvas', ref }
  return <CanvasView { ...canvasProps } />
}
