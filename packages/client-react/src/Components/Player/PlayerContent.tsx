import React from 'react'
import { assertArray, assertPopulatedArray, EventType, SelectType, Svg, Svgs } from '@moviemasher/moviemasher.js'

import { PropsWithoutChild, ReactResult } from '../../declarations'
import { useEditor } from '../../Hooks/useEditor'
import { useListeners } from '../../Hooks/useListeners'
import { View } from '../../Utilities/View'

export interface SvgContentProps extends PropsWithoutChild, Svg {}

export function SvgContent(props: SvgContentProps): ReactResult {
  const ref = React.useRef<HTMLDivElement>(null)
  const { element, id: key } = props
  const updateRef = () => {
    const { current } = ref
    if (current) current.replaceChildren(element)
  }
 
  React.useEffect(updateRef, [])

  if (ref.current) updateRef()

  const viewProps = { 
    key, ref
  }
  return <View { ...viewProps}></View>
}

export function PlayerContent(props: PropsWithoutChild): ReactResult {
  const editor = useEditor()
  const [svgs, setSvgs] = React.useState<Svgs>([])
  const ref = React.useRef<HTMLDivElement>(null)

  const handleResize = () => { editor.imageSize = ref.current!.getBoundingClientRect() }
  const [resizeObserver] = React.useState(new ResizeObserver(handleResize))

  React.useEffect(() => {
    const { current } = ref
    if (current) resizeObserver.observe(current)
    return () => { resizeObserver.disconnect() }
  }, [])

  const handleDraw = () => { 
    const { svgs } = editor
    // console.log("PlayerContent handleDraw svgs", svgs.length)
    setSvgs(svgs) 
  }

  useListeners({ [EventType.Draw]: handleDraw, [EventType.Selection]: handleDraw })

  const onPointerDown = () => {
    console.log("PlayerContent onPointerDown")
    editor.deselect(SelectType.Clip)
  }
  const children = svgs.map(svg => <SvgContent key={svg.id} {...svg}/>)
  const viewProps = {
    ...props, key: 'player-content', ref, onPointerDown, children,
  }
  return <View { ...viewProps}></View>
}
