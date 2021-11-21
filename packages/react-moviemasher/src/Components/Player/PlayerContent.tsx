import React from 'react'
import { UnknownObject, ContextFactory, EventType, Errors } from '@moviemasher/moviemasher.js'
import { EditorContext } from '../Editor/EditorContext'
import { CanvasView, CanvasViewProps } from '../../Utilities/CanvasView'

interface PlayerContentProps extends UnknownObject {
  children?: never
}

const PlayerContent : React.FunctionComponent<PlayerContentProps> = (props) => {
  const ref = React.useRef<HTMLCanvasElement>(null)

  const context = React.useContext(EditorContext)
  const { masher } = context

  const handleResize = () => {
    const { current } = ref
    if (!current) throw Errors.invalid.object

    const rect = current.getBoundingClientRect()
    current.width = rect.width
    current.height = rect.height
    masher.imageSize = rect
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

    const imageData = masher.imageData
    const context = ContextFactory.fromCanvas(current)
    context.drawImageData(imageData)
  }

  const removeListeners = () => {
    const { eventTarget } = masher
    eventTarget.removeEventListener(EventType.Draw, handleDraw)
  }

  const addListeners = () => {
    const { eventTarget } = masher
    eventTarget.addEventListener(EventType.Draw, handleDraw)
    return () => { removeListeners() }
  }

  React.useEffect(() => addListeners(), [])
  const { children, selectClass, ...rest } = props
  const canvasProps:CanvasViewProps = { ...rest, ref }
  return <CanvasView { ...canvasProps } />
}

export { PlayerContent }
