import React from 'react'
import { EventType, SelectType } from '@moviemasher/moviemasher.js'

import { PropsWithoutChild, ReactResult } from '../../declarations'
import { useEditor } from '../../Hooks/useEditor'
import { useListeners } from '../../Hooks/useListeners'
import { View } from '../../Utilities/View'

export function PlayerContent(props: PropsWithoutChild): ReactResult {
  const editor = useEditor()
  const ref = React.useRef<HTMLDivElement>(null)

  const handleResize = () => { editor.imageSize = ref.current!.getBoundingClientRect() }
  const [resizeObserver] = React.useState(new ResizeObserver(handleResize))

  React.useEffect(() => {
    const { current } = ref
    if (current) resizeObserver.observe(current)
    return () => { resizeObserver.disconnect() }
  }, [])

  const handleDraw = () => {
    const svg = ref.current!
    svg.replaceChildren(editor.svg)
  }

  useListeners({ [EventType.Draw]: handleDraw, [EventType.Selection]: handleDraw })

  const onPointerDown = () => {
    console.log("PlayerContent onPointerDown")
    editor.deselect(SelectType.Clip)
  }

  const viewProps = {
    ...props, key: 'player-content', ref, onPointerDown
  }
  return <View { ...viewProps}></View>
}
