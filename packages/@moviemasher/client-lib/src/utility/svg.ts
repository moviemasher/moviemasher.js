import type { Rect, Size, SvgItems, SvgElement, Transparency } from '@moviemasher/shared-lib/types.js'

import { MIME_SVG, $ALPHA, svgStringClean } from '@moviemasher/shared-lib/runtime.js'
import { svgDefsElement, svgMaskElement, svgPolygonElement, svgSvgElement } from '@moviemasher/shared-lib/utility/svg.js'

export const svgColorMask = (svgImage: Element, size: Size, transparency: Transparency = $ALPHA, className = '', rect?: Rect): SvgElement => {
  const defs: SvgItems = []
  const maskedElement =  svgPolygonElement(rect || size, className)
  const maskElement = svgMaskElement(maskedElement, transparency)   
  maskElement.appendChild(svgImage)

  defs.push(maskElement)
  return svgSvgElement(size, [svgDefsElement(defs), maskedElement])
}

export const svgStringElement = (svgString: string) => {
  const cleaned = svgStringClean(svgString)
  if (!cleaned) return

  const parser = new globalThis.window.DOMParser()
  const parsed = parser.parseFromString(cleaned, MIME_SVG)
  const firstChild = parsed.children[0]
  if (!firstChild) return

  return firstChild
}
