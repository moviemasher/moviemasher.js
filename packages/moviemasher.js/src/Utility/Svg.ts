import { Dimensions } from "../Setup/Dimensions"
import { NamespaceSvg } from "../Setup/Constants"
import { Rect } from "../declarations"
import { isRect } from "./Is"

export const svgOfDimensions = (dimensions: Dimensions) => {
  const { width, height } = dimensions
  const element = globalThis.document.createElementNS(NamespaceSvg, 'svg')
  element.setAttribute('width', String(width))
  element.setAttribute('height', String(height))
  element.setAttribute('viewBox', `0 0 ${width} ${height}`)
  return element
}

export const svgGroupElement = (dimensions?: Dimensions): SVGGElement => {
 
  const element = globalThis.document.createElementNS(NamespaceSvg, 'g')
  if (dimensions) {
    const { width, height } = dimensions
    element.setAttribute('width', String(width))
    element.setAttribute('height', String(height))
  }
  return element
}

export const svgPolygonElement = (size: Dimensions | Rect, className = '', fill = 'none'): SVGPolygonElement => {
  const { width, height } = size
  const element = globalThis.document.createElementNS(NamespaceSvg, 'polygon')
  element.setAttribute('points', `0,0 ${width},0 ${width},${height}, 0,${height}, 0,0`)
  if (isRect(size)) {
    const { x, y } = size
    element.setAttribute('transform', `translate(${x}, ${y})`)
  }
  if (fill) element.setAttribute('fill', fill)
  if (className) element.classList.add(className)
  return element
}
