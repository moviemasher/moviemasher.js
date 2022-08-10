import React from 'react'
import { 
  assertContainer, assertTrue, EventType, PointZero, Rect, SelectType, Svgs, timeEqualizeRates, timeFromArgs, 
  Clip} from '@moviemasher/moviemasher.js'

import { PropsWithoutChild, ReactResult } from '../../declarations'
import { useEditor } from '../../Hooks/useEditor'
import { useListeners } from '../../Hooks/useListeners'
import { View } from '../../Utilities/View'
import { PlayerContentSvgProps, PlayerContentSvg } from './PlayerContentSvg'

export function PlayerContent(props: PropsWithoutChild): ReactResult {
  const editor = useEditor()
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
  const children = <svg { ...svgProps } />
  const viewProps = {
    ...props, key: 'player-content', ref, onPointerDown, children, 
  }
  return <View { ...viewProps}/>
}
