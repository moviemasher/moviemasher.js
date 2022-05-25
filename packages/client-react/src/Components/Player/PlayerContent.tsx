import React from 'react'
import { EventType } from '@moviemasher/moviemasher.js'
import { PropsWithoutChild, ReactResult } from '../../declarations'
import { useEditor } from '../../Hooks/useEditor'
import { useListeners } from '../../Hooks'
import { View } from '../../Utilities/View'

export function PlayerContent(props: PropsWithoutChild): ReactResult {
  const editor = useEditor()
  const ref = React.useRef<HTMLDivElement>(null)
  const handleResize = () => {
    const { current } = ref
    if (!current) return

    const rect = current.getBoundingClientRect()
    // current.width = rect.width
    // current.height = rect.height
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

    current.replaceChildren(...editor.visibleSources)
    // while (current.firstChild) current.removeChild(current.firstChild)

    // editor.visibleSources.forEach(node => {
    //   if (node instanceof HTMLCanvasElement) {
    //     // console.log("PlayerContent", node.style)
    //     current.appendChild(node)
    //   }
    // })
    // current.appendChild(current.cr)
  }

  useListeners({ [EventType.Draw]: handleDraw })

  const viewProps = {
    ...props, key: 'player-content', ref
  }
  return <View { ...viewProps } />
}
