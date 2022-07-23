import { Size } from "./Size"
import { NamespaceSvg } from "../Setup/Constants"
import { Rect, isRect, rectFromSize } from "./Rect"
import { isAboveZero } from "./Is"

export const svgOfDimensions = (dimensions: Size) => {
  const { width, height } = dimensions
  const element = globalThis.document.createElementNS(NamespaceSvg, 'svg')
  element.setAttribute('width', String(width))
  element.setAttribute('height', String(height))
  element.setAttribute('viewBox', `0 0 ${width} ${height}`)
  return element
}

export const svgGroupElement = (dimensions?: Size): SVGGElement => {
 
  const element = globalThis.document.createElementNS(NamespaceSvg, 'g')
  if (dimensions) {
    const { width, height } = dimensions
    element.setAttribute('width', String(width))
    element.setAttribute('height', String(height))
  }
  return element
}

export const svgPolygonElement = (size: Size | Rect, className = '', fill = 'none'): SVGPolygonElement => {
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

export const svgElement = (size: Size): SVGSVGElement => {
  const { width, height } = size
  const svgElement = globalThis.document.createElementNS(NamespaceSvg, 'svg')
  svgElement.setAttribute('width', String(width))
  svgElement.setAttribute('height', String(height))
  svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`)
  return svgElement
}