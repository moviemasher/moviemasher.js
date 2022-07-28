import React from 'react'
import { EventType, SelectType, Svg, Svgs } from '@moviemasher/moviemasher.js'

import { PropsWithoutChild, ReactResult } from '../../declarations'
import { useEditor } from '../../Hooks/useEditor'
import { useListeners } from '../../Hooks/useListeners'
import { View } from '../../Utilities/View'

export interface SvgContentProps extends PropsWithoutChild, Svg {
  width: number
  height: number
}

export function SvgContent(props: SvgContentProps): ReactResult {
  const editor = useEditor()
  const ref = React.useRef<SVGSVGElement>(null)
  const { element, id: key } = props
  const updateRef = () => {
    const { current } = ref
    if (current) current.replaceChildren(element)
  }
 
  React.useEffect(updateRef, [])

  if (ref.current) updateRef()

  const { width, height } = editor.imageSize
  const viewProps = { key, ref, 
    width, height, viewBox: `0 0 ${width} ${height}`
   }
  return <svg { ...viewProps} />
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

  const handleDraw = () => { setSvgs(editor.svgs) }

  useListeners({ [EventType.Draw]: handleDraw, [EventType.Selection]: handleDraw })

  const onPointerDown = () => {
    console.log("PlayerContent onPointerDown")
    editor.deselect(SelectType.Clip)
  }
 

  const svgChildren = svgs.map(svg => {
    const svgProps = {
      ...svg, ...editor.imageSize, key: svg.id
    }
    return <SvgContent { ...svgProps } />
  })
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
